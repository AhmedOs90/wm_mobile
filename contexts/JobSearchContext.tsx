import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { candidateJobsControllerGetFavourite, candidateJobsControllerSaveJob, jobsControllerGetJobs } from '@/wm-api/sdk.gen';
import type { JobsControllerGetJobsResponse } from '@/wm-api/types.gen';
import { useToast } from '@/hooks/use-toast';

// Debounce hook for search optimization
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface JobSearchState {
  // State
  inputSearchTerm: string;
  setInputSearchTerm: (term: string) => void;
  searchTerm: string;
  page: number;
  isSaving: boolean;
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  isPublic:boolean
  // Data
  jobs: any[];
  totalJobs: number;
  totalPages: number;
  hasMore: boolean;
  savedJobIds: string[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  isLoadingSavedJobs: boolean;
  
  
  // Actions
  handleSave: (jobId: string) => Promise<void>;
  loadMore: () => void;
  handleSearch: () => void;
  handleCountryChange: (country: string) => void;
  handleStateChange: (state: string) => void;
  handleCityChange: (city: string) => void;
  queryClient: any;
}

const JobSearchContext = createContext<JobSearchState | undefined>(undefined);

interface JobSearchProviderProps {
  children: ReactNode;
  initialSearchTerm?: string;
  initialPage?: number;
  isPublic? : boolean,

}

export const JobSearchProvider = ({ 
  children, 
  initialSearchTerm = '', 
  initialPage = 1,
  isPublic = false,
}: JobSearchProviderProps) => {
  const [inputSearchTerm, setInputSearchTerm] = useState(initialSearchTerm);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [page, setPage] = useState(initialPage);

  const [isSaving, setIsSaving] = useState(false);
  const [optimisticSavedJobs, setOptimisticSavedJobs] = useState<Set<string>>(new Set());

  // Location filter states
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(inputSearchTerm, 500);

  // Auto-update search term when debounced value changes
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
    setPage(1); // Reset to first page when search changes
  }, [debouncedSearchTerm]);

  // Jobs data query
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching
  } = useQuery<JobsControllerGetJobsResponse>({
    queryKey: ['jobs', page, searchTerm, selectedCountry, selectedState, selectedCity],
    queryFn: async () => {
      const response = await jobsControllerGetJobs({
        query: {
          page,
          limit: 20,
          search: searchTerm || undefined,
          country: selectedCountry ? [selectedCountry] : undefined,
          state: selectedState ? [selectedState] : undefined,
          city: selectedCity ? [selectedCity] : undefined
        }
      });

      if (!response || !response.data) {
        throw new Error('Invalid response from jobsControllerGetJobs');
      }

      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
    placeholderData: (previousData) => previousData,
    // Always enable the query to show initial results
    enabled: true,
  });

  // Saved jobs query - fetch all favorites once
  const {
    data: savedJobsData,
    refetch: refetchSavedJobs,
    isLoading: isLoadingSavedJobs
  } = useQuery({
    queryKey: ['savedJobs'],
    queryFn: async () => {
      const response = await candidateJobsControllerGetFavourite({
        query: {
          page: 1,
          limit: 100
        }
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    enabled: !isPublic,
  });

  const jobs = useMemo(() => data?.data ?? [], [data?.data]);
  const totalJobs = useMemo(() => data?.meta?.total ?? 0, [data?.meta?.total]);
  const totalPages = useMemo(() => Math.ceil(totalJobs / 20), [totalJobs]);
  console.log(data?.meta?.total);
  const hasMore = useMemo(() => page < totalPages, [page, totalPages]);

  const savedJobIds = useMemo(() => {
    const dataArray = Array.isArray(savedJobsData?.data) ? savedJobsData.data : [];
    const serverJobIds = dataArray
      .map(job => job?.jobId)
      .filter(Boolean);
    
    return Array.from(new Set([...serverJobIds, ...optimisticSavedJobs]));
  }, [savedJobsData, optimisticSavedJobs]);

  const handleSave = useCallback(async (jobId: string) => {
    const isCurrentlySaved = savedJobIds.includes(jobId);
    
    setOptimisticSavedJobs(prev => {
      const newSet = new Set(prev);
      if (isCurrentlySaved) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });

    setIsSaving(true);
    
    try {
      await candidateJobsControllerSaveJob({ body: { jobId }, throwOnError: true });
      await refetchSavedJobs();
      setOptimisticSavedJobs(new Set());
      
      toast({
        title: isCurrentlySaved ? "Job removed from favorites" : "Job saved successfully!",
        description: isCurrentlySaved 
          ? "Job has been removed from your favorites"
          : "You can view your saved jobs in your profile."
      });
    } catch (error: any) {
      setOptimisticSavedJobs(prev => {
        const newSet = new Set(prev);
        if (isCurrentlySaved) {
          newSet.add(jobId);
        } else {
          newSet.delete(jobId);
        }
        return newSet;
      });
      
      toast({
        title: "Error While Saving",
        description: error.message || "Failed to save job"
      });
    } finally {
      setIsSaving(false);
    }
  }, [savedJobIds, refetchSavedJobs, toast]);

const loadMore = useCallback(() => {
  if (isPublic) return; 
  if (hasMore && !isFetching) {
    setPage(prev => prev + 1);
  }
}, [hasMore, isFetching, isPublic]);


  const handleSearch = useCallback(() => {
    setSearchTerm(inputSearchTerm);
    setPage(1);
  }, [inputSearchTerm]);

  // Location filter handlers
  const handleCountryChange = useCallback((country: string) => {
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    setPage(1);
  }, []);

  const handleStateChange = useCallback((state: string) => {
    setSelectedState(state);
    setSelectedCity('');
    setPage(1);
  }, []);

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    setPage(1);
  }, []);

  // Clear optimistic state when component unmounts or saved jobs refetch
  useEffect(() => {
    if (savedJobsData) {
      setOptimisticSavedJobs(new Set());
    }
  }, [savedJobsData]);

  const value = useMemo(() => ({
    // State
    inputSearchTerm,
    setInputSearchTerm,
    searchTerm,
    page,
    isSaving,
    selectedCountry,
    selectedState,
    selectedCity,
    
    // Data
    jobs,
    totalJobs,
    totalPages,
    hasMore,
    savedJobIds,
    isLoading,
    isError,
    error,
    isFetching,
    isLoadingSavedJobs,
    isPublic,
    // Actions
    handleSave,
    loadMore,
    handleSearch,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
    queryClient,
  }), [
    inputSearchTerm,
    searchTerm,
    page,
    isSaving,
    selectedCountry,
    selectedState,
    selectedCity,
    jobs,
    totalJobs,
    totalPages,
    hasMore,
    savedJobIds,
    isLoading,
    isError,
    error,
    isFetching,
    isLoadingSavedJobs,
    isPublic,
    handleSave,
    loadMore,
    handleSearch,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
    queryClient,
  ]);

  return (
    <JobSearchContext.Provider value={value}>
      {children}
    </JobSearchContext.Provider>
  );
};

export const useJobSearch = () => {
  const context = useContext(JobSearchContext);
  if (context === undefined) {
    throw new Error('useJobSearch must be used within a JobSearchProvider');
  }
  return context;
}; 