import { useState, useEffect, useCallback, memo } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchableSelect, SearchableSelectOption } from '@/components/shared/ui/SearchableSelect';
import {
  staticDataControllerGetCountriesWithQuery,
} from "@/wm-api/sdk.gen.ts";
import type { Country } from "@/wm-api/types.gen.ts";

interface CountrySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  // Optional callback for when search query changes (for external state management if needed)
  onSearchQueryChange?: (query: string) => void;
}

const CountrySelectComponent = ({
  value,
  onValueChange,
  placeholder = "Select your country",
  searchPlaceholder = "Search countries...",
  emptyMessage = "No countries available",
  disabled = false,
  className,
  triggerClassName,
  onSearchQueryChange,
}: CountrySelectProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Countries Query with search functionality
  const { data: countries, isLoading: countriesLoading } = useQuery({
    queryKey: ['countries', debouncedSearchQuery],
    queryFn: async () => {
      try {
        const response = await staticDataControllerGetCountriesWithQuery({
          query: { query: debouncedSearchQuery || '' }
        });
        return response.data?.data || [];
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        return [];
      }
    },
    staleTime: debouncedSearchQuery ? 0 : 60000, // No cache for search queries, cache for initial load
    refetchOnWindowFocus: false,
  });

  // Transform countries data to SearchableSelectOption format
  const countryOptions: SearchableSelectOption[] = (countries || []).map((country: Country) => ({
    value: country.id || '',
    label: country.country || '',
  }));

  // Handle search change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    onSearchQueryChange?.(query);
  }, [onSearchQueryChange]);

  // Find selected option from cache if not in current options
  const selectedOption = useCallback(() => {
    if (!value) return undefined;
    
    // First try to find in current options
    const currentOption = countryOptions.find(option => option.value === value);
    if (currentOption) return currentOption;
    
    // If not found, look in React Query cache for any countries data
    const allCachedCountries: Country[] = [];
    
    // Get all cached country queries (including different search query variations)
    const cache = queryClient.getQueriesData({ 
      queryKey: ['countries'], 
      exact: false // This allows partial matching to get all countries queries
    });
    
    cache.forEach(([queryKey, data]) => {
      // Ensure this is a countries query with the right structure
      if (Array.isArray(queryKey) && queryKey[0] === 'countries' && Array.isArray(data)) {
        allCachedCountries.push(...data);
      }
    });
    
    // Find the selected country in cached data
    const cachedCountry = allCachedCountries.find(country => country.id === value);
    return cachedCountry ? {
      value: cachedCountry.id || '',
      label: cachedCountry.country || ''
    } : undefined;
  }, [value, countryOptions, queryClient]);

  return (
    <SearchableSelect
      options={countryOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={countriesLoading ? "Loading..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      loading={countriesLoading}
      emptyMessage={emptyMessage}
      disabled={disabled || countriesLoading}
      selectedOption={selectedOption()}
    />
  );
};

export const CountrySelect = memo(CountrySelectComponent); 