import { useQuery } from "@tanstack/react-query";
import { SearchableSelect, SearchableSelectOption } from "../shared/ui/SearchableSelect";
import { staticDataControllerGetCareerLevels } from "@/wm-api/sdk.gen";
import type { CareerLevel } from "@/wm-api/types.gen.ts";

interface CareerLevelSelectProps {
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

export const CareerLevelSelect = ({
  value,
  onValueChange,
  placeholder = "Select experience",
  searchPlaceholder = "Search levels...",
  emptyMessage = "No levels available",
  disabled = false,
  className,
  triggerClassName,
}: CareerLevelSelectProps) => {
  // Career Levels Query
  const { data: careerLevels, isLoading: careerLevelsLoading } = useQuery({
    queryKey: ['careerLevels'],
    queryFn: async () => {
      try {
        const response = await staticDataControllerGetCareerLevels();
        return response.data?.data || [];
      } catch (error) {
        console.error("Failed to fetch career levels:", error);
        return [];
      }
    },
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  // Transform career levels data to SearchableSelectOption format
  const careerLevelOptions: SearchableSelectOption[] = (careerLevels || []).map((level: CareerLevel) => ({
    value: level.id || '',
    label: level.careerLevel || '',
  }));

  return (
    <SearchableSelect
      options={careerLevelOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={careerLevelsLoading ? "Loading..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      loading={careerLevelsLoading}
      emptyMessage={emptyMessage}
      disabled={disabled}

    />
  );
}; 