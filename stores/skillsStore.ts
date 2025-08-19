import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  candidateSkillsControllerFindAll,
  candidateSkillsControllerCreate,
  candidateSkillsControllerUpdate,
  candidateSkillsControllerRemove
} from '@/wm-api/sdk.gen';
import { CandidateSkill, CreateSkillDto, UpdateSkillDto } from '@/wm-api/types.gen';

// Skills interfaces matching the component expectations
export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Skill {
  id: string | number;
  name: string;
  category: string;
  yearsOfExperience?: number;
  percentage?: number;
  skillId?: string;
  otherSkillId?: string;
}

// Transform API response to Skill format
const transformApiToSkill = (apiSkill: CandidateSkill): Skill => {
  return {
    id: apiSkill.id,
    name: apiSkill.skill?.jobSkill || apiSkill.otherSkill?.otherSkill || 'Unknown Skill',
    category: 'Technical Skills',
    yearsOfExperience: apiSkill.yearsOfExperience || 0,
    percentage: apiSkill.percentage || 0,
    skillId: apiSkill.skillId || '',
    otherSkillId: apiSkill.otherSkillId || ''
  };
};

// Group skills by category
const groupSkillsByCategory = (skills: Skill[]): SkillGroup[] => {
  if (skills.length === 0) {
    return [{ category: 'Technical Skills', items: ['No skills added yet'] }];
  }

  const grouped = skills.reduce((acc, skill) => {
    const category = skill.category || 'Technical Skills';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return Object.entries(grouped).map(([category, items]) => ({
    category,
    items
  }));
};

// React Query hook for skills with transformation
export const useSkillsQuery = () => {
  return useQuery({
    queryKey: ['candidate-skills'],
    queryFn: async () => {
      console.log('🔄 Fetching skills with React Query...');
      
      const response = await candidateSkillsControllerFindAll();
      
      console.log('✅ Skills API Response:', response);
      
      if (!response.data?.data) {
        throw new Error('Invalid skills response structure');
      }

      // Transform API data to Skill format
      const skills = (response.data.data || []).map(transformApiToSkill);
      
      console.log('✅ Transformed skills:', skills);
      
      return {
        skills,
        skillGroups: groupSkillsByCategory(skills)
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Convenience hooks for easier component usage
export const useSkills = () => {
  const query = useSkillsQuery();
  return query.data?.skills || [];
};

export const useSkillGroups = () => {
  const query = useSkillsQuery();
  return query.data?.skillGroups || [];
};

export const useSkillsLoading = () => {
  const query = useSkillsQuery();
  return query.isLoading;
};

export const useSkillsError = () => {
  const query = useSkillsQuery();
  return query.error?.message || null;
};

export const useSkillsFetching = () => {
  const query = useSkillsQuery();
  return query.isFetching;
};

export const useFetchSkills = () => {
  const query = useSkillsQuery();
  return query.refetch;
};

// Create Skill Mutation
export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (skillData: CreateSkillDto) => {
      console.log('🔄 Creating skill:', skillData);
      const response = await candidateSkillsControllerCreate({
        body: skillData
      });
      console.log('✅ Skill created:', response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-skills'] });
    },
    onError: (error) => {
      console.error('❌ Error creating skill:', error);
    }
  });
};

// Update Skill Mutation
export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSkillDto }) => {
      console.log('🔄 Updating skill:', id, data);
      const response = await candidateSkillsControllerUpdate({
        path: { id },
        body: data
      });
      console.log('✅ Skill updated:', response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-skills'] });
    },
    onError: (error) => {
      console.error('❌ Error updating skill:', error);
    }
  });
};

// Delete Skill Mutation
export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🔄 Deleting skill:', id);
      const response = await candidateSkillsControllerRemove({
        path: { id }
      });
      console.log('✅ Skill deleted:', response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-skills'] });
    },
    onError: (error) => {
      console.error('❌ Error deleting skill:', error);
    }
  });
}; 