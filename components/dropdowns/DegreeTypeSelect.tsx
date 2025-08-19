import { useQuery } from "@tanstack/react-query";
import { SearchableSelect, SearchableSelectOption } from '@/components/shared/ui/SearchableSelect';
import { staticDataControllerGetDegreeTypes } from "@/wm-api/sdk.gen.ts";
import type { DegreeType } from "@/wm-api/types.gen.ts";

interface DegreeTypeSelectProps {
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

export const DegreeTypeSelect = ({
  value,
  onValueChange,
  placeholder = "Select degree type",
  searchPlaceholder = "Search types...",
  emptyMessage = "No types available",
  disabled = false,
  className,
  triggerClassName,
}: DegreeTypeSelectProps) => {
  const { data: degreeTypes, isLoading: degreeTypesLoading } = useQuery({
    queryKey: ['degree-types'],
    queryFn: async () => {
      try {
        const response = await staticDataControllerGetDegreeTypes();
        return response.data?.data || [];
      } catch (error) {
        console.error("Failed to fetch degree types:", error);
        return [];
      }
    },
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const degreeTypeOptions: SearchableSelectOption[] = (degreeTypes || []).map((type: DegreeType) => ({
    value: type.id || '',
    label: type.degreeType || '',
  }));

  return (
    <SearchableSelect
      options={degreeTypeOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={degreeTypesLoading ? "Loading..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      loading={degreeTypesLoading}
      emptyMessage={emptyMessage}
      disabled={disabled}

    />
  );
}; 