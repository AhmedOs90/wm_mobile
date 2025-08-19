// components/Select.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export type SelectOption = {
  label: string;
  value: string | number;
};

type SelectProps = {
  data: SelectOption[];
  value: string | number;
  onChange: (item: SelectOption) => void;
  placeholder?: string;
  disabled?: boolean;
};

const Select: React.FC<SelectProps> = ({
  data,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
}) => {
  return (
    <Dropdown
      style={[styles.dropdown, disabled && styles.disabled]}
      placeholderStyle={styles.placeholder}
      selectedTextStyle={styles.selectedText}
      iconStyle={styles.icon}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disable={disabled}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 45,
    borderColor: '#d1d5db', // Tailwind gray-300
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  disabled: {
    opacity: 0.5,
  },
  placeholder: {
    fontSize: 14,
    color: '#9ca3af', // Tailwind gray-400
  },
  selectedText: {
    fontSize: 14,
    color: '#111827', // Tailwind gray-900
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#9ca3af',
  },
});

export default Select;
