import { SearchableSelect, SearchableSelectOption } from '@/components/shared/ui/SearchableSelect';

interface WorkTypeSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export const WorkTypeSelect = ({
  value,
  onValueChange,
  placeholder = "Select work type",
  searchPlaceholder = "Search work types...",
  emptyMessage = "No work types available",
  disabled = false,
  className,
  triggerClassName,
}: WorkTypeSelectProps) => {
  const workTypeOptions: SearchableSelectOption[] = [
    { value: "Remote", label: "Remote" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Onsite", label: "Onsite" }
  ];

  return (
    <SearchableSelect
      options={workTypeOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      disabled={disabled}
    />
  );
}; 