import { useQuery } from "@tanstack/react-query";
import { SearchableSelectOption } from "../components/shared/ui/SearchableSelect";
import {
  staticDataControllerGetCountriesWithQuery,
  staticDataControllerGetCareerLevels,
  staticDataControllerGetFunctionalAreasWithQuery,
  staticDataControllerGetSkills,
  staticDataControllerGetCategories,
  staticDataControllerGetStatesByCountryId,
  staticDataControllerGetCitiesByStateId,
} from "@/wm-api/sdk.gen";

// Configuration
const STALE_TIME = 10 * 60 * 1000; // 10 minutes
const COUNTRIES_LIMIT = 25;

export const useStaticData = (countrySearchQuery: string, countryId: string, stateId: string, skillsSearchQuery?: string) => {
  // Countries Query
  const { data: countries, isLoading: countriesLoading } = useQuery({
    queryKey: ['countries', countrySearchQuery],
    queryFn: async () => {
      try {
        const response = await staticDataControllerGetCountriesWithQuery({
          query: { query: countrySearchQuery || '' }
        });
        const data = response.data?.data || [];
        // Apply limit only when no search query to maintain consistency with previous behavior
        return countrySearchQuery ? data : data.slice(0, COUNTRIES_LIMIT);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        return [];
      }
    },
    staleTime: countrySearchQuery ? 0 : 60000, // No cache for search queries, cache for initial load
    refetchOnWindowFocus: false,
  });

  // Categories Query
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await staticDataControllerGetCategories();
      return response.data?.data || [];
    },
    staleTime: STALE_TIME,
  });

  // Career Levels Query
  const { data: careerLevels, isLoading: careerLevelsLoading } = useQuery({
    queryKey: ['careerLevels'],
    queryFn: async () => {
      const response = await staticDataControllerGetCareerLevels();
      return response.data?.data || [];
    },
    staleTime: STALE_TIME,
  });

  // Skills Query
  const { data: skills, isLoading: skillsLoading, error: skillsError } = useQuery({
    queryKey: ['skills', skillsSearchQuery],
    queryFn: async () => {
      try {
        const response = await staticDataControllerGetSkills({
          query: skillsSearchQuery ? { name: skillsSearchQuery } : undefined
        });
        return response.data?.data || [];
      } catch (error) {
        console.error('Skills API error:', error);
        return [];
      }
    },
    staleTime: skillsSearchQuery ? 0 : STALE_TIME, // No cache for search queries, cache for initial load
    refetchOnWindowFocus: false,
  });

  // States Query (dependent on country)
  const { data: states, isLoading: statesLoading } = useQuery({
    queryKey: ['states', countryId],
    queryFn: async () => {
      if (!countryId) return [];
      try {
        const response = await staticDataControllerGetStatesByCountryId({
          path: { countryId }
        });
        return response.data?.data || [];
      } catch (error) {
        console.error("Failed to fetch states:", error);
        return [];
      }
    },
    enabled: !!countryId,
  });

  // Cities Query (dependent on state)
  const { data: cities, isLoading: citiesLoading } = useQuery({
    queryKey: ['cities', stateId],
    queryFn: async () => {
      if (!stateId) return [];
      try {
        const response = await staticDataControllerGetCitiesByStateId({
          path: { stateId }
        });
        return response.data?.data || [];
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        return [];
      }
    },
    enabled: !!stateId,
  });

  // Functional Areas Query
  const { data: functionalAreas, isLoading: functionalAreasLoading } = useQuery({
    queryKey: ['functionalAreas'],
    queryFn: async () => {
      try {
        const response = await staticDataControllerGetFunctionalAreasWithQuery();
        return response.data?.data || [];
      } catch (error) {
        console.error("Failed to fetch functional areas:", error);
        return [];
      }
    },
    staleTime: STALE_TIME,
  });

  // Transform data to SearchableSelectOption format
  const countryOptions: SearchableSelectOption[] = Array.isArray(countries) && countries.length > 0 
    ? countries.map(country => ({ value: country.id, label: country.country }))
    : [];

  const stateOptions: SearchableSelectOption[] = Array.isArray(states) && states.length > 0
    ? states.map(state => ({ value: state.id, label: state.state }))
    : [];

  const cityOptions: SearchableSelectOption[] = Array.isArray(cities) && cities.length > 0
    ? cities.map(city => ({ value: city.id, label: city.city }))
    : [];

  const jobCategoryOptions: SearchableSelectOption[] = Array.isArray(categories) && categories.length > 0
    ? categories.map(category => ({ value: category.id, label: category.categoryName }))
    : [];

  const positionOptions: SearchableSelectOption[] = Array.isArray(functionalAreas) && functionalAreas.length > 0
    ? functionalAreas.map(area => ({ value: area.id, label: area.functionalArea }))
    : [];

  const careerLevelOptions: SearchableSelectOption[] = Array.isArray(careerLevels) && careerLevels.length > 0
    ? careerLevels.map(level => ({ value: level.id, label: level.careerLevel }))
    : [];

  const availableSkills = Array.isArray(skills) ? skills : [];
  
  const skillOptions: SearchableSelectOption[] = [
    ...availableSkills.map(skill => ({
      value: typeof skill === 'string' ? skill : skill.id,
      label: typeof skill === 'string' ? skill : skill.jobSkill,
    })),
    // { value: "other", label: "Other (specify below)" }
  ];

  return {
    // Raw data
    countries,
    categories,
    careerLevels,
    skills: availableSkills,
    states,
    cities,
    functionalAreas,
    
    // Loading states
    countriesLoading,
    categoriesLoading,
    careerLevelsLoading,
    skillsLoading,
    statesLoading,
    citiesLoading,
    functionalAreasLoading,
    
    // Transformed options
    countryOptions,
    stateOptions,
    cityOptions,
    jobCategoryOptions,
    positionOptions,
    careerLevelOptions,
    skillOptions,
  };
}; 