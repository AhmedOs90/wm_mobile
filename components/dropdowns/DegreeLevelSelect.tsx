import { useQuery } from "@tanstack/react-query";
import { SearchableSelect, SearchableSelectOption } from '@/components/shared/ui/SearchableSelect';
import { staticDataControllerFindAllDegreeLevels } from "@/wm-api/sdk.gen.ts";
import type { DegreeLevel } from "@/wm-api/types.gen.ts";

interface DegreeLevelSelectProps {
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

export const DegreeLevelSelect = ({
  value,
  onValueChange,
  placeholder = "Select degree level",
  searchPlaceholder = "Search levels...",
  emptyMessage = "No levels available",
  disabled = false,
  className,
  triggerClassName,
}: DegreeLevelSelectProps) => {
  const { data: degreeLevels, isLoading: degreeLevelsLoading } = useQuery({
    queryKey: ['degree-levels'],
    queryFn: async () => {
      try {
        const response = await staticDataControllerFindAllDegreeLevels();
        return response.data?.data || [];
      } catch (error) {
        console.error("Failed to fetch degree levels:", error);
        return [];
      }
    },
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const degreeLevelOptions: SearchableSelectOption[] = (degreeLevels || []).map((level: DegreeLevel) => ({
    value: level.id || '',
    label: level.degreeLevel || '',
  }));

  return (
    <SearchableSelect
      options={degreeLevelOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={degreeLevelsLoading ? "Loading..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      loading={degreeLevelsLoading}
      emptyMessage={emptyMessage}
      disabled={disabled}

    />
  );
}; 