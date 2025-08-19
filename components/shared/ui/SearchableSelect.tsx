// components/shared/ui/SearchableSelect.tsx

import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, Text, View } from 'react-native';

export interface SearchableSelectOption {
  label: string;
  value: string;
}

interface Props {
  options: SearchableSelectOption[];
  value?: string;
  onValueChange: (val: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  disabled?: boolean;
  selectedOption?: SearchableSelectOption; // ✅ NEW
}

export const SearchableSelect: React.FC<Props> = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options available',
  loading = false,
  disabled = false,
  selectedOption,
}) => {
  const currentSelected = React.useMemo(() => {
    // Prefer the selectedOption if value is not found in options
    const fromOptions = options.find((opt) => opt.value === value);
    return fromOptions || selectedOption || null;
  }, [options, value, selectedOption]);

  if (!loading && options.length === 0) {
    return <Text style={styles.emptyText}>{emptyMessage}</Text>;
  }

  return (
    <Dropdown
      data={options}
      value={currentSelected?.value}
      labelField="label"
      valueField="value"
      placeholder={loading ? 'Loading...' : placeholder}
      search
      searchPlaceholder={searchPlaceholder}
      disable={disabled}
      onChange={(item) => onValueChange(item.value)}
      style={styles.dropdown}
      placeholderStyle={styles.placeholder}
      selectedTextStyle={styles.selected}
      itemTextStyle={styles.item}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  placeholder: {
    color: '#999',
  },
  selected: {
    color: '#000',
  },
  item: {
    color: '#000',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    padding: 10,
  },
});
