import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  candidateExperiencesControllerFindAll,
  candidateExperiencesControllerCreate,
  candidateExperiencesControllerUpdate,
  candidateExperiencesControllerRemove
} from '@/wm-api/sdk.gen';
import { UserExperience, CreateExperienceDto, UpdateExperienceDto } from '@/wm-api/types.gen';

// Experience interface matching the API response
export interface Experience {
  id: string | number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  jobTypeId?: string;
  jobWorkplace?: string;
  countryId?: string;
  stateId?: string;
  cityId?: string;
  country?: string;
  // Direct API fields for enhanced display
  from?: string;
  to?: string;
  currentlyWorking?: boolean;
  jobType?: { jobType: string };
  state?: { state: string };
  city?: { city: string };
  countryObj?: { country: string };
  // Reference fields from API
  referenceName?: string;
  referenceContact?: string;
  companyAddress?: string;
  companyContact?: string;
}

// Transform API response to Experience format
const transformApiToExperience = (apiExp: UserExperience): Experience => {
  // Format location string
  const locationParts = [
    apiExp.city?.city,
    apiExp.state?.state, 
    apiExp.country?.country
  ].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'Location not specified';

  return {
    id: apiExp.id,
    title: apiExp.title || 'No title provided',
    company: apiExp.company || 'Company not specified',
    location: location,
    startDate: apiExp.from || '',
    endDate: apiExp.currentlyWorking ? 'Present' : (apiExp.to || ''),
    description: apiExp.description || 'No description provided',
    achievements: [], // Note: achievements field doesn't exist on UserExperience API
    jobTypeId: apiExp.jobTypeId || '',
    jobWorkplace: apiExp.jobWorkplace || '',
    countryId: apiExp.countryId || '',
    stateId: apiExp.stateId || '',
    cityId: apiExp.cityId || '',
    country: apiExp.country?.country || '',
    // Include raw API fields for enhanced display
    from: apiExp.from,
    to: apiExp.to,
    currentlyWorking: apiExp.currentlyWorking,
    jobType: apiExp.jobType,
    state: apiExp.state,
    city: apiExp.city,
    countryObj: apiExp.country,
    // Reference information
    referenceName: apiExp.referenceName,
    referenceContact: apiExp.referenceContact,
    companyAddress: apiExp.companyAddress,
    companyContact: apiExp.companyContact,
  };
};

// React Query hook for experiences with transformation
export const useExperiences = () => {
  return useQuery({
    queryKey: ['candidate-experiences'],
    queryFn: async () => {
      console.log('🔄 Fetching experiences with React Query...');
      
      const response = await candidateExperiencesControllerFindAll();
      
      console.log('✅ Experiences API Response:', response);
      
      if (!response.data?.data) {
        throw new Error('Invalid experiences response structure');
      }

      // Transform API data to Experience format
      const experiences = (response.data.data || []).map(transformApiToExperience);
      
      console.log('✅ Transformed experiences:', experiences);
      
      return experiences;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Convenience hooks for easier component usage
export const useExperiencesData = () => {
  const query = useExperiences();
  return query.data || [];
};

export const useExperiencesLoading = () => {
  const query = useExperiences();
  return query.isLoading;
};

export const useExperiencesError = () => {
  const query = useExperiences();
  return query.error?.message || null;
};

export const useExperiencesFetching = () => {
  const query = useExperiences();
  return query.isFetching;
};

export const useFetchExperiences = () => {
  const query = useExperiences();
  return query.refetch;
};

// Create Experience Mutation
export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (experienceData: CreateExperienceDto) => {
      console.log('🔄 Creating experience:', experienceData);
      const response = await candidateExperiencesControllerCreate({
        body: experienceData
      });
      console.log('✅ Experience created:', response);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch experiences
      queryClient.invalidateQueries({ queryKey: ['candidate-experiences'] });
    },
    onError: (error) => {
      console.error('❌ Error creating experience:', error);
    }
  });
};

// Update Experience Mutation
export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateExperienceDto }) => {
      console.log('🔄 Updating experience:', id, data);
      const response = await candidateExperiencesControllerUpdate({
        path: { id },
        body: data
      });
      console.log('✅ Experience updated:', response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-experiences'] });
    },
    onError: (error) => {
      console.error('❌ Error updating experience:', error);
    }
  });
};

// Delete Experience Mutation
export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🔄 Deleting experience:', id);
      const response = await candidateExperiencesControllerRemove({
        path: { id }
      });
      console.log('✅ Experience deleted:', response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-experiences'] });
    },
    onError: (error) => {
      console.error('❌ Error deleting experience:', error);
    }
  });
}; 