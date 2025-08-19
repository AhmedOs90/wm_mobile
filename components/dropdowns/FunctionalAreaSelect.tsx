import { useQuery } from "@tanstack/react-query";
import { SearchableSelect, SearchableSelectOption } from '@/components/shared/ui/SearchableSelect';
import { staticDataControllerGetFunctionalAreasWithQuery } from "@/wm-api/sdk.gen.ts";
import type { FunctionalArea } from "@/wm-api/types.gen.ts";

interface FunctionalAreaSelectProps {
  categoryId?: string;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

const STALE_TIME = 10 * 60 * 1000; // 10 minutes

export const FunctionalAreaSelect = ({
  categoryId,
  value,
  onValueChange,
  placeholder = "Select position",
  searchPlaceholder = "Search positions...",
  emptyMessage = "No positions available",
  disabled = false,
  className,
  triggerClassName,
}: FunctionalAreaSelectProps) => {
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
    refetchOnWindowFocus: false,
  });

  // Filter functional areas by category if categoryId is provided
  const filteredFunctionalAreas = categoryId 
    ? (functionalAreas || []).filter((area: FunctionalArea) => area.categoryId === categoryId)
    : (functionalAreas || []);

  // Transform functional areas data to SearchableSelectOption format
  const functionalAreaOptions: SearchableSelectOption[] = filteredFunctionalAreas.map((area: FunctionalArea) => ({
    value: area.id || '',
    label: area.functionalArea || '',
  }));

  return (
    <SearchableSelect
      options={functionalAreaOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={functionalAreasLoading ? "Loading..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      loading={functionalAreasLoading}
      emptyMessage={emptyMessage}
      disabled={disabled}
    />
  );
}; 