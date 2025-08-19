import React, { useCallback, memo } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchableSelect, SearchableSelectOption } from '@/components/shared/ui/SearchableSelect';
import { staticDataControllerGetStatesByCountryId } from "@/wm-api/sdk.gen.ts";
import type { State } from "@/wm-api/types.gen.ts";

interface StateSelectProps {
  countryId?: string;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

const StateSelectComponent = ({
  countryId,
  value,
  onValueChange,
  placeholder = "Select your state",
  searchPlaceholder = "Search states...",
  emptyMessage = "No states available",
  disabled = false,
  className,
  triggerClassName,
}: StateSelectProps) => {
  const queryClient = useQueryClient();
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

  // Transform states data to SearchableSelectOption format
  const stateOptions: SearchableSelectOption[] = (states || []).map((state: State) => ({
    value: state.id || '',
    label: state.state || '',
  }));

  // Find selected option from cache if not in current options
  const selectedOption = useCallback(() => {
    if (!value) return undefined;
    
    // First try to find in current options
    const currentOption = stateOptions.find(option => option.value === value);
    if (currentOption) return currentOption;
    
    // If not found, look in React Query cache for any states data
    const allCachedStates: State[] = [];
    
    // Get all cached state queries (including different country variations)
    const cache = queryClient.getQueriesData({ 
      queryKey: ['states'], 
      exact: false // This allows partial matching to get all states queries
    });
    
    cache.forEach(([queryKey, data]) => {
      // Ensure this is a states query with the right structure
      if (Array.isArray(queryKey) && queryKey[0] === 'states' && Array.isArray(data)) {
        allCachedStates.push(...data);
      }
    });
    
    // Find the selected state in cached data
    const cachedState = allCachedStates.find(state => state.id === value);
    return cachedState ? {
      value: cachedState.id || '',
      label: cachedState.state || ''
    } : undefined;
  }, [value, stateOptions, queryClient]);

  return (
    <SearchableSelect
      options={stateOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={statesLoading ? "Loading..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      loading={statesLoading}
      emptyMessage={emptyMessage}
      disabled={disabled || !countryId}
      selectedOption={selectedOption()}
    />
  );
};

export const StateSelect = memo(StateSelectComponent); 