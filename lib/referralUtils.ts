export interface ReferralSignupData {
  referralCode: string;
  newEmployerEmail: string;
  newEmployerId: string;
}

// Mock data storage
const mockReferrals = new Map<string, {
  id: string;
  referral_code: string;
  referring_employer_id: string;
  referred_employer_id?: string;
  referred_employer_email?: string;
  referred_employer_signup_date?: string;
  status: string;
  job_post_points_awarded: boolean;
  referred_employer_first_job_date?: string;
}>();

const mockCompanies = new Map<string, {
  id: string;
  email: string;
  created_at: string;
}>();

const mockJobs = new Map<string, {
  id: string;
  company_id: string;
  created_at: string;
}>();

export const processReferralSignup = async (data: ReferralSignupData) => {
  try {
    // Find the referral record
    const referralRecord = Array.from(mockReferrals.values()).find(
      ref => ref.referral_code === data.referralCode
    );

    if (!referralRecord) {
      throw new Error('Invalid referral code');
    }

    // Update the referral record with the new employer
    mockReferrals.set(referralRecord.id, {
      ...referralRecord,
      referred_employer_id: data.newEmployerId,
      referred_employer_email: data.newEmployerEmail,
      referred_employer_signup_date: new Date().toISOString(),
      status: 'registered'
    });

    // Add basic referral points (5 points) to the referring employer
    await addPointsToEmployer({
      employerId: referralRecord.referring_employer_id,
      points: 5,
      actionType: 'referral',
      description: `Referral bonus for ${data.newEmployerEmail}`,
      referenceId: referralRecord.id
    });

    return referralRecord;
  } catch (error) {
    console.error('Error processing referral signup:', error);
    throw error;
  }
};

export interface AddPointsData {
  employerId: string;
  points: number;
  actionType: string;
  description?: string;
  referenceId?: string;
  expiresAt?: string;
}

export const addPointsToEmployer = async (data: AddPointsData) => {
  try {
    // Mock implementation - just return success
    console.log(`Adding ${data.points} points to employer ${data.employerId} for ${data.actionType}`);
    return 100; // Mock balance
  } catch (error) {
    console.error('Error adding points to employer:', error);
    throw error;
  }
};

export const processJobPostingBonus = async (employerId: string, jobId: string) => {
  try {
    // Check if employer signed up recently (within 72 hours)
    const company = mockCompanies.get(employerId) || {
      id: employerId,
      email: 'mock@example.com',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24 hours ago
    };

    const signupTime = new Date(company.created_at);
    const now = new Date();
    const timeDiff = now.getTime() - signupTime.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    let points = 5; // Default job posting bonus
    let actionType = 'job_post';
    let description = 'Job posting bonus';

    // Check if this is their first job within 72 hours of signup
    const employerJobs = Array.from(mockJobs.values()).filter(job => job.company_id === employerId);

    if (hoursDiff <= 72 && employerJobs.length === 1) {
      // First job within 72 hours - give signup bonus (10 points total)
      points = 10;
      actionType = 'signup_job';
      description = 'Signup + job posting bonus (within 72 hours)';
    }

    await addPointsToEmployer({
      employerId,
      points,
      actionType,
      description,
      referenceId: jobId
    });

    // Check if this employer was referred and award successful referral bonus
    const referrals = Array.from(mockReferrals.values()).filter(
      ref => ref.referred_employer_id === employerId && ref.status === 'registered'
    );

    // If employer was referred and this is within 72 hours, award successful referral bonus
    if (referrals.length > 0 && hoursDiff <= 72) {
      const referral = referrals[0];
      
      // Update referral status
      mockReferrals.set(referral.id, {
        ...referral,
        status: 'job_posted',
        referred_employer_first_job_date: new Date().toISOString(),
        job_post_points_awarded: true
      });

      // Award successful referral bonus (15 points)
      await addPointsToEmployer({
        employerId: referral.referring_employer_id,
        points: 15,
        actionType: 'successful_referral',
        description: `Successful referral bonus - ${company.email} posted job within 72h`,
        referenceId: referral.id
      });
    }

    return points;
  } catch (error) {
    console.error('Error processing job posting bonus:', error);
    throw error;
  }
};

export const processAnnualSubscriptionBonus = async (employerId: string, subscriptionId: string) => {
  try {
    await addPointsToEmployer({
      employerId,
      points: 50,
      actionType: 'annual_subscription',
      description: 'Annual subscription bonus',
      referenceId: subscriptionId
    });

    return 50;
  } catch (error) {
    console.error('Error processing annual subscription bonus:', error);
    throw error;
  }
};

export const processCandidateInviteBonus = async (employerId: string, candidateId: string) => {
  try {
    await addPointsToEmployer({
      employerId,
      points: 5,
      actionType: 'candidate_invite',
      description: 'Candidate invitation bonus',
      referenceId: candidateId
    });

    return 5;
  } catch (error) {
    console.error('Error processing candidate invite bonus:', error);
    throw error;
  }
};