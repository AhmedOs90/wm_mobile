import { useQuery } from "@tanstack/react-query";
import { SearchableSelect, SearchableSelectOption } from '@/components/shared/ui/SearchableSelect';
import { staticDataControllerGetCategories } from "@/wm-api/sdk.gen.ts";
import type { Category } from "@/wm-api/types.gen.ts";

interface JobCategorySelectProps {
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

export const JobCategorySelect = ({
  value,
  onValueChange,
  placeholder = "Select category",
  searchPlaceholder = "Search categories...",
  emptyMessage = "No categories available",
  disabled = false,
  className,
  triggerClassName,
}: JobCategorySelectProps) => {
  // Categories Query
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await staticDataControllerGetCategories();
        return response.data?.data || [];
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
      }
    },
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  // Transform categories data to SearchableSelectOption format
  const categoryOptions: SearchableSelectOption[] = (categories || []).map((category: Category) => ({
    value: category.id || '',
    label: category.categoryName || '',
  }));

  return (
    <SearchableSelect
      options={categoryOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={categoriesLoading ? "Loading..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      loading={categoriesLoading}
      emptyMessage={emptyMessage}
      disabled={disabled}

    />
  );
}; 