import { SearchableSelect, SearchableSelectOption } from '@/components/shared/ui/SearchableSelect';

interface JobWorkplaceSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export const JobWorkplaceSelect = ({
  value,
  onValueChange,
  placeholder = "Select workplace type",
  searchPlaceholder = "Search workplace types...",
  emptyMessage = "No workplace types available",
  disabled = false,
  className,
  triggerClassName,
}: JobWorkplaceSelectProps) => {
  const workplaceOptions: SearchableSelectOption[] = [
    { value: "REMOTE", label: "Remote" },
    { value: "HYBRID", label: "Hybrid" },
    { value: "ONSITE", label: "Onsite" }
  ];

  return (
    <SearchableSelect
      options={workplaceOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      disabled={disabled}
     
    />
  );
}; 