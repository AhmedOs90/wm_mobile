import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  candidateEducationsControllerFindAll,
  candidateEducationsControllerCreate,
  candidateEducationsControllerUpdate,
  candidateEducationsControllerRemove
} from '@/wm-api/sdk.gen';
import { Education as ApiEducation, CreateEducationDto, UpdateEducationDto } from '@/wm-api/types.gen';

// Education interface matching the component expectations
export interface Education {
  id: string | number;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  // Additional fields for editing
  degreeLevelId?: string;
  degreeTypeId?: string;
  degree_title?: string;
  isOngoing?: boolean;
  countryName?: string;
  countryId?: string;
  studiedSubjects?: string;
  additionalInfo?: string;
}

// Certification interface for future use
export interface Certification {
  id: string | number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  isVerified: boolean;
}

// Transform API response to Education format
const transformApiToEducation = (apiEdu: ApiEducation): Education => {
  console.log('🔄 Transforming education data:', apiEdu);
  
  const transformed = {
    id: apiEdu.id,
    degree: apiEdu.degreeLevel?.degreeLevel || apiEdu.degreeType?.degreeType || apiEdu.degree_title || 'Degree not specified',
    school: apiEdu.institution || 'Institution not specified',
    location: `${apiEdu.city?.city || ''} ${apiEdu.state?.state || ''} ${apiEdu.country?.country || ''}`.trim() || 'Location not specified',
    startDate: apiEdu.from || '',
    endDate: apiEdu.isOngoing ? 'Present' : (apiEdu.to || ''),
    gpa: apiEdu.degree_result ? `${apiEdu.degree_result}%` : 'Not specified',
    // Store original API data for editing
    degreeLevelId: apiEdu.degreeLevelId || '',
    degreeTypeId: apiEdu.degreeTypeId || '',
    degree_title: apiEdu.degree_title || '',
    isOngoing: apiEdu.isOngoing || false,
    countryName: apiEdu.country?.country || '',
    countryId: apiEdu.countryId || '',
    studiedSubjects: apiEdu.description || '',
    additionalInfo: apiEdu.description || ''
  };
  
  console.log('✅ Transformed education:', transformed);
  return transformed;
};

// React Query hook for education with transformation
export const useEducationQuery = () => {
  return useQuery({
    queryKey: ['candidate-education'],
    queryFn: async () => {
      console.log('🔄 Fetching education with React Query...');
      
      const response = await candidateEducationsControllerFindAll();
      
      console.log('✅ Education API Response:', response);
      
      if (!response.data?.data) {
        throw new Error('Invalid education response structure');
      }

      // Transform API data to Education format
      const rawData = response.data.data || [];
      console.log('📊 Raw education data from API:', rawData);
      
      const education = rawData.map(transformApiToEducation);
      
      console.log('✅ Final transformed education list:', education);
      
      return education;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// React Query hook for certifications (placeholder for future implementation)
export const useCertificationsQuery = () => {
  return useQuery({
    queryKey: ['candidate-certifications'],
    queryFn: async () => {
      // Placeholder for future certification API implementation
      console.log('📝 Certifications API not yet implemented');
      return [] as Certification[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: false, // Disable until API is available
  });
};

// Convenience hooks for easier component usage
export const useEducation = () => {
  const query = useEducationQuery();
  return query.data || [];
};

export const useCertifications = () => {
  const query = useCertificationsQuery();
  return query.data || [];
};

export const useEducationLoading = () => {
  const query = useEducationQuery();
  return query.isLoading;
};

export const useEducationError = () => {
  const query = useEducationQuery();
  return query.error?.message || null;
};

export const useEducationFetching = () => {
  const query = useEducationQuery();
  return query.isFetching;
};

export const useFetchEducation = () => {
  const query = useEducationQuery();
  return query.refetch;
};

export const useFetchCertifications = () => {
  const query = useCertificationsQuery();
  return query.refetch;
};

// Create Education Mutation
export const useCreateEducation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (educationData: CreateEducationDto) => {
      console.log('🔄 Creating education with data:', educationData);
      const response = await candidateEducationsControllerCreate({
        body: educationData
      });
      console.log('✅ Education created successfully:', response);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('🔄 Invalidating education queries after successful creation...');
      queryClient.invalidateQueries({ queryKey: ['candidate-education'] });
      console.log('✅ Education queries invalidated');
    },
    onError: (error) => {
      console.error('❌ Error creating education:', error);
    }
  });
};

// Update Education Mutation
export const useUpdateEducation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEducationDto }) => {
      console.log('🔄 Updating education:', id, data);
      const response = await candidateEducationsControllerUpdate({
        path: { id },
        body: data
      });
      console.log('✅ Education updated:', response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-education'] });
    },
    onError: (error) => {
      console.error('❌ Error updating education:', error);
    }
  });
};

// Delete Education Mutation
export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🔄 Deleting education:', id);
      const response = await candidateEducationsControllerRemove({
        path: { id }
      });
      console.log('✅ Education deleted:', response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-education'] });
    },
    onError: (error) => {
      console.error('❌ Error deleting education:', error);
    }
  });
}; 