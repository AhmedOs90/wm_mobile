import type { Job } from '@/wm-api/types.gen';

// Mock interface to replace missing Supabase type
interface CandidateDashboardSummaryResponseDto {
  profileCompletion: {
    CV: boolean;
    workExperiences: boolean;
    skills: boolean;
    summary: boolean;
  };
  applicationsCount?: number;
  interviewInvitationsCount?: number;
  profileViewsCount?: number;
  jobInvitationsCount?: number;
  jobRecommendations?: Job[];
}

// UI-specific interfaces for the dashboard
export interface DashboardMetrics {
  applications: number;
  interviews: number;
  profileViews: number;
  jobInvites: number;
}

export interface ProfileCompletionData {
  hasCV: boolean;
  hasWorkHistory: boolean;
  hasSkills: boolean;
  hasSummary: boolean;
  completionScore: number;
}

export interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  matchScore: number;
  postedDate: string;
}

// Transform raw API data to UI-friendly format
export const transformDashboardData = (rawData: CandidateDashboardSummaryResponseDto) => {
  const profileCompletion = rawData.profileCompletion;
  
  const completionScore = Math.round(
    [
      profileCompletion.CV,
      profileCompletion.workExperiences,
      profileCompletion.skills,
      profileCompletion.summary
    ].filter(Boolean).length / 4 * 100
  );

  return {
    metrics: {
      applications: rawData.applicationsCount || 0,
      interviews: rawData.interviewInvitationsCount || 0,
      profileViews: rawData.profileViewsCount || 0,
      jobInvites: rawData.jobInvitationsCount || 0,
    },
    profileCompletion: {
      hasCV: profileCompletion.CV === true,
      hasWorkHistory: profileCompletion.workExperiences === true,
      hasSkills: profileCompletion.skills === true,
      hasSummary: profileCompletion.summary === true,
      completionScore,
    }
  };
};

// Transform raw job data to UI-friendly format
export const transformJobData = (rawJobs: Job[]): RecommendedJob[] => {
  return rawJobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.employer?.firstName || 'Unknown Company',
    location: job.city?.city || job.location || 'Remote',
    salary: job.salaryFrom && job.salaryTo 
      ? `${job.salaryCurrency?.name || '$'}${job.salaryFrom} - ${job.salaryTo}`
      : 'Salary not specified',
    type: job.jobType?.jobType || 'Full-time',
    matchScore: Math.floor(Math.random() * 20) + 80, // This should come from backend
    postedDate: new Date(job.createdAt).toLocaleDateString(),
  }));
};

// Fallback data for when API calls fail
export const getFallbackDashboardData = () => ({
  metrics: {
    applications: "-",
    interviews: "-",
    profileViews: "-",
    jobInvites: "-",
  },
  profileCompletion: {
    hasCV: false,
    hasWorkHistory: false,
    hasSkills: false,
    hasSummary: false,
    completionScore: 0,
  }
});

export const getFallbackJobs = (): RecommendedJob[] => [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechCorp',
    location: 'Remote',
    salary: '$80k - $120k',
    type: 'Full-time',
    matchScore: 95,
    postedDate: '2 days ago',
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'New York, NY',
    salary: '$70k - $100k',
    type: 'Full-time',
    matchScore: 88,
    postedDate: '1 day ago',
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'GrowthCo',
    location: 'San Francisco, CA',
    salary: '$90k - $130k',
    type: 'Full-time',
    matchScore: 82,
    postedDate: '3 days ago',
  },
]; 