import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { candidateJobsControllerFindAll } from '@/wm-api/sdk.gen';
import { JobApplication } from '@/wm-api/types.gen';

const APPLICATIONS_PER_PAGE = 10;

interface UseApplicationsOptions {
  userId?: string;
  enabled?: boolean;
}

interface UseApplicationsReturn {
  applications: JobApplication[];
  isInitialLoading: boolean;
  hasError: boolean;
  fetchError: Error | null;
  isFetchingMore: boolean;
  hasMorePages: boolean;
  loadNextPage: () => void;
  resetPagination: () => void;
  refreshData: () => void;
  retryFetch: () => void;
}

export const useApplications = ({
  userId,
  enabled = true,
}: UseApplicationsOptions): UseApplicationsReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [accumulatedApplications, setAccumulatedApplications] = useState<JobApplication[]>([]);

  const {
    data: applicationsResponse,
    isLoading: isInitialLoading,
    isError: hasError,
    error: fetchError,
    isFetching: isFetchingMore,
    refetch: retryFetch,
  } = useQuery({
    queryKey: ['candidate-applications', userId, refreshKey, currentPage],
    queryFn: async () => {
      if (!userId) return { applications: [], paginationMeta: null };

      try {
        const response = await candidateJobsControllerFindAll({
          query: {
            page: currentPage,
            limit: APPLICATIONS_PER_PAGE,
          },
        });

        const paginationMeta = response.data?.meta;
        if (paginationMeta) {
          setHasMorePages((paginationMeta?.page ?? 0) < (paginationMeta?.totalPages ?? 0));
        } else {
          setHasMorePages(false);
        }

        return {
          applications: response.data?.data || [],
          paginationMeta: response.data?.meta,
        };
      } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
    },
    enabled: enabled && !!userId,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Accumulate applications across pages
  useEffect(() => {
    if (applicationsResponse?.applications) {
      setAccumulatedApplications((prev) =>
        currentPage === 1 ? applicationsResponse.applications : [...prev, ...applicationsResponse.applications]
      );
    }
  }, [applicationsResponse, currentPage]);

  const loadNextPage = useCallback(() => {
    if (hasMorePages && !isFetchingMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMorePages, isFetchingMore]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setHasMorePages(true);
    setAccumulatedApplications([]);
  }, []);

  const refreshData = useCallback(() => {
    resetPagination();
    setRefreshKey((prev) => prev + 1);
  }, [resetPagination]);

  return {
    applications: accumulatedApplications,
    isInitialLoading,
    hasError,
    fetchError: fetchError as Error,
    isFetchingMore,
    hasMorePages,
    loadNextPage,
    resetPagination,
    refreshData,
    retryFetch,
  };
};
