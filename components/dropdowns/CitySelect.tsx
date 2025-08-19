import React from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchableSelect, SearchableSelectOption } from '@/components/shared/ui/SearchableSelect';
import { staticDataControllerGetCitiesByStateId } from "@/wm-api/sdk.gen.ts";
import type { City } from "@/wm-api/types.gen.ts";

interface CitySelectProps {
  stateId?: string;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export const CitySelect = ({
  stateId,
  value,
  onValueChange,
  placeholder = "Select your city (optional)",
  searchPlaceholder = "Search cities...",
  emptyMessage = "No cities available",
  disabled = false,
  className,
  triggerClassName,
}: CitySelectProps) => {
  const queryClient = useQueryClient();
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

  // Transform cities data to SearchableSelectOption format
  const cityOptions: SearchableSelectOption[] = (cities || []).map((city: City) => ({
    value: city.id || '',
    label: city.city || '',
  }));

  // Find selected option from cache if not in current options
  const selectedOption = React.useMemo(() => {
    if (!value) return undefined;
    
    // First try to find in current options
    const currentOption = cityOptions.find(option => option.value === value);
    if (currentOption) return currentOption;
    
    // If not found, look in React Query cache for cities data
    const allCachedCities: City[] = [];
    
    // Get all cached cities queries (including different stateId variations)
    const cache = queryClient.getQueriesData({ 
      queryKey: ['cities'], 
      exact: false // This allows partial matching to get all cities queries
    });
    
    cache.forEach(([queryKey, data]) => {
      // Ensure this is a cities query with the right structure
      if (Array.isArray(queryKey) && queryKey[0] === 'cities' && Array.isArray(data)) {
        allCachedCities.push(...data);
      }
    });
    
    // Find the selected city in cached data
    const cachedCity = allCachedCities.find(city => city.id === value);
    return cachedCity ? {
      value: cachedCity.id || '',
      label: cachedCity.city || ''
    } : undefined;
  }, [value, cityOptions, queryClient]);

  return (
    <SearchableSelect
      options={cityOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={citiesLoading ? "Loading..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      loading={citiesLoading}
      emptyMessage={emptyMessage}
      disabled={disabled || !stateId}
      selectedOption={selectedOption}
    />
  );
}; 