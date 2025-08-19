/**
 * Common React Query configuration for consistent caching and retry behavior across the application
 */

/**
 * Default query options for static data (degree levels, countries, etc.)
 * - Longer cache times since static data changes infrequently
 * - Background refetch disabled for window focus to reduce API calls
 */
export const staticDataQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes when unused
  retry: 3, // Retry failed requests 3 times
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  refetchOnWindowFocus: false, // Don't refetch when window regains focus
  refetchOnMount: true, // Always refetch when component mounts
};

/**
 * Default query options for user data (profile, applications, etc.)
 * - Shorter cache times since user data changes more frequently
 * - Background refetch enabled for fresh data
 */
export const userDataQueryOptions = {
  staleTime: 2 * 60 * 1000, // 2 minutes - data stays fresh for 2 minutes
  gcTime: 5 * 60 * 1000, // 5 minutes - cache persists for 5 minutes when unused
  retry: 2, // Retry failed requests 2 times (less aggressive for user data)
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff with lower max
  refetchOnWindowFocus: true, // Refetch when window regains focus for fresh user data
  refetchOnMount: true, // Always refetch when component mounts
};

/**
 * Default query options for real-time data (notifications, messages, etc.)
 * - Very short cache times for real-time updates
 * - Aggressive refetching for fresh data
 */
export const realTimeQueryOptions = {
  staleTime: 30 * 1000, // 30 seconds - data stays fresh for 30 seconds
  gcTime: 2 * 60 * 1000, // 2 minutes - cache persists for 2 minutes when unused
  retry: 1, // Retry failed requests 1 time only
  retryDelay: 1000, // 1 second retry delay
  refetchOnWindowFocus: true, // Always refetch when window regains focus
  refetchOnMount: true, // Always refetch when component mounts
  refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
};

/**
 * Helper function to create useQueries configuration with consistent options
 * @param queries Array of query configurations
 * @param defaultOptions Default options to apply (defaults to staticDataQueryOptions)
 * @returns Formatted queries array for useQueries
 */
export const createQueriesConfig = (
  queries: Array<{
    queryKey: unknown[];
    queryFn: () => Promise<any>;
    options?: Record<string, unknown>;
  }>,
  defaultOptions = staticDataQueryOptions
) => {
  return {
    queries: queries.map(({ queryKey, queryFn, options = {} }) => ({
      queryKey,
      queryFn,
      ...defaultOptions,
      ...options, // Allow overriding default options
    })),
  };
};

/**
 * Helper function to create single query configuration with consistent options
 * @param queryKey Query key
 * @param queryFn Query function
 * @param options Additional options to merge
 * @param defaultOptions Default options to apply (defaults to staticDataQueryOptions)
 * @returns Query configuration object
 */
export const createQueryConfig = (
  queryKey: unknown[],
  queryFn: () => Promise<any>,
  options: Record<string, unknown> = {},
  defaultOptions = staticDataQueryOptions
) => ({
  queryKey,
  queryFn,
  ...defaultOptions,
  ...options, // Allow overriding default options
});