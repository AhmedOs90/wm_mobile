export type PointsAction = 
  | 'signup_job'
  | 'job_post'
  | 'referral'
  | 'successful_referral'
  | 'annual_subscription'
  | 'candidate_invite';

const POINTS_VALUES: Record<PointsAction, number> = {
  signup_job: 10,
  job_post: 5,
  referral: 5,
  successful_referral: 15,
  annual_subscription: 50,
  candidate_invite: 5
};

// Mock data storage
const mockPointsData = new Map<string, {
  points_earned: number;
  current_balance: number;
  points_used: number;
  updated_at: string;
}>();

const mockTransactions: Array<{
  id: string;
  employer_id: string;
  transaction_type: 'earn' | 'redeem';
  points_amount: number;
  action_type: string;
  description: string;
  reference_id?: string;
  expires_at?: string;
  ip_address?: string;
  created_at: string;
}> = [];

/**
 * Award points to an employer for a specific action
 */
export async function awardPoints({
  employerId,
  action,
  description,
  referenceId,
  ipAddress
}: {
  employerId: string;
  action: PointsAction;
  description?: string;
  referenceId?: string;
  ipAddress?: string;
}) {
  const pointsAmount = POINTS_VALUES[action];
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 12); // Points expire after 12 months

  try {
    // Add transaction to mock data
    mockTransactions.push({
      id: Math.random().toString(36).substr(2, 9),
      employer_id: employerId,
      transaction_type: 'earn',
      points_amount: pointsAmount,
      action_type: action,
      description: description || `Earned ${pointsAmount} points for ${action.replace('_', ' ')}`,
      reference_id: referenceId,
      expires_at: expiresAt.toISOString(),
      ip_address: ipAddress,
      created_at: new Date().toISOString()
    });

    // Update or create employer points record
    const existingPoints = mockPointsData.get(employerId);
    
    if (existingPoints) {
      // Update existing record
      mockPointsData.set(employerId, {
        ...existingPoints,
        points_earned: existingPoints.points_earned + pointsAmount,
        current_balance: existingPoints.current_balance + pointsAmount,
        updated_at: new Date().toISOString()
      });
    } else {
      // Create new record
      mockPointsData.set(employerId, {
        points_earned: pointsAmount,
        current_balance: pointsAmount,
        points_used: 0,
        updated_at: new Date().toISOString()
      });
    }

    return { success: true, pointsAwarded: pointsAmount };
  } catch (error) {
    console.error('Error awarding points:', error);
    return { success: false, error };
  }
}

/**
 * Redeem points for a discount
 */
export async function redeemPoints({
  employerId,
  pointsAmount,
  description,
  referenceId
}: {
  employerId: string;
  pointsAmount: number;
  description: string;
  referenceId?: string;
}) {
  try {
    // Check if employer has enough points
    const pointsData = mockPointsData.get(employerId);

    if (!pointsData || pointsData.current_balance < pointsAmount) {
      return { success: false, error: 'Insufficient points' };
    }

    // Add redemption transaction
    mockTransactions.push({
      id: Math.random().toString(36).substr(2, 9),
      employer_id: employerId,
      transaction_type: 'redeem',
      points_amount: pointsAmount,
      action_type: 'discount_redemption',
      description,
      reference_id: referenceId,
      created_at: new Date().toISOString()
    });

    // Update employer points balance
    mockPointsData.set(employerId, {
      ...pointsData,
      points_used: pointsData.points_used + pointsAmount,
      current_balance: pointsData.current_balance - pointsAmount,
      updated_at: new Date().toISOString()
    });

    return { success: true, pointsRedeemed: pointsAmount };
  } catch (error) {
    console.error('Error redeeming points:', error);
    return { success: false, error };
  }
}

/**
 * Get current points balance for an employer
 */
export async function getPointsBalance(employerId: string) {
  try {
    const pointsData = mockPointsData.get(employerId);
    return pointsData?.current_balance || 0;
  } catch (error) {
    console.error('Error getting points balance:', error);
    return 0;
  }
}

/**
 * Get available discount percentage for an employer
 */
export async function getAvailableDiscount(employerId: string) {
  try {
    const currentPoints = await getPointsBalance(employerId);
    
    // Mock discount tiers
    const mockTiers = [
      { points_required: 100, discount_percentage: 5 },
      { points_required: 250, discount_percentage: 10 },
      { points_required: 500, discount_percentage: 15 },
      { points_required: 1000, discount_percentage: 20 }
    ];

    const applicableTier = mockTiers
      .filter(tier => tier.points_required <= currentPoints)
      .sort((a, b) => b.points_required - a.points_required)[0];

    return applicableTier?.discount_percentage || 0;
  } catch (error) {
    console.error('Error getting available discount:', error);
    return 0;
  }
}

/**
 * Check if a referral should be marked as successful (referred employer posted job within 72 hours)
 */
export async function checkReferralSuccess(referralId: string, jobId: string) {
  try {
    // Mock referral data
    const mockReferral = {
      id: referralId,
      referring_employer_id: 'mock-employer-id',
      referred_employer_email: 'mock@example.com',
      referred_employer_signup_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      job_post_points_awarded: false,
      status: 'pending'
    };

    if (!mockReferral || mockReferral.job_post_points_awarded) {
      return { success: false, message: 'Referral not found or already processed' };
    }

    const jobPostTime = new Date();
    const signupTime = new Date(mockReferral.referred_employer_signup_date);
    const hoursDiff = (jobPostTime.getTime() - signupTime.getTime()) / (1000 * 60 * 60);

    if (hoursDiff <= 72) {
      // Award successful referral points
      await awardPoints({
        employerId: mockReferral.referring_employer_id,
        action: 'successful_referral',
        description: `Successful referral: ${mockReferral.referred_employer_email} posted a job within 72 hours`,
        referenceId: jobId
      });

      return { success: true, pointsAwarded: POINTS_VALUES.successful_referral };
    }

    return { success: false, message: 'Job posted after 72-hour window' };
  } catch (error) {
    console.error('Error checking referral success:', error);
    return { success: false, error };
  }
}

/**
 * Get points transaction history for an employer
 */
export async function getPointsHistory(employerId: string, limit = 50) {
  try {
    const employerTransactions = mockTransactions
      .filter(t => t.employer_id === employerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);

    return employerTransactions;
  } catch (error) {
    console.error('Error getting points history:', error);
    return [];
  }
}