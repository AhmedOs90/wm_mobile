import { useQuery } from "@tanstack/react-query";
import { SearchableSelect, SearchableSelectOption } from '@/components/shared/ui/SearchableSelect';
import { staticDataControllerGetSkills } from "@/wm-api/sdk.gen.ts";
import type { Skill } from "@/wm-api/types.gen.ts";

interface SkillSelectProps {
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

export const SkillSelect = ({
  value,
  onValueChange,
  placeholder = "Select skill",
  searchPlaceholder = "Search skills...",
  emptyMessage = "No skills available",
  disabled = false,
  className,
  triggerClassName,
}: SkillSelectProps) => {
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ['available-skills'],
    queryFn: async () => {
      try {
        const response = await staticDataControllerGetSkills();
        return response.data?.data || [];
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        return [];
      }
    },
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const skillOptions: SearchableSelectOption[] = (skills || []).map((skill: Skill) => ({
    value: skill.jobSkill || '',
    label: skill.jobSkill || '',
  }));

  return (
    <SearchableSelect
      options={skillOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={skillsLoading ? "Loading..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      loading={skillsLoading}
      emptyMessage={emptyMessage}
      disabled={disabled}

    />
  );
}; 