import { candidatesControllerGetDashboardSummary } from '@sdk.gen.ts';
import type { Job } from '@types.gen.ts';

// Mock interface to replace missing types
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

export const candidateApi = {
  async getDashboardSummary(): Promise<CandidateDashboardSummaryResponseDto> {
    const { data } = await candidatesControllerGetDashboardSummary();
    return {
      profileCompletion: {
        CV: data?.data.profileCompletion.CV,
        workExperiences: data?.data.profileCompletion.workExperiences,
        skills: data?.data.profileCompletion.skills,
        summary: data?.data.profileCompletion.summary
      },
      applicationsCount: data?.data.applicationsCount,
      interviewInvitationsCount: data?.data.interviewInvitationsCount,
      profileViewsCount: data?.data.profileViewsCount,
      jobInvitationsCount: data?.data.jobInvitationsCount,
      jobRecommendations: data?.data.jobRecommendations
    };
  },
};