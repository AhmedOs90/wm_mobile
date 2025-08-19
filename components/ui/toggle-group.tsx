import React, { createContext, useContext } from 'react';
import { View, StyleSheet,TouchableOpacity, Text, } from 'react-native';


const ToggleGroupContext = createContext({
  selected: '',
  onSelect: (val: string) => {},
});

export const ToggleGroup = ({
  value,
  onValueChange,
  children,
  style,
}: {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  style?: any;
}) => {
  return (
    <ToggleGroupContext.Provider value={{ selected: value, onSelect: onValueChange }}>
      <View style={[styles.group, style]}>{children}</View>
    </ToggleGroupContext.Provider>
  );
};

export const ToggleGroupItem = ({
  value,
  label,
  disabled,
}: {
  value: string;
  label: string;
  disabled?: boolean;
}) => {
  const { selected, onSelect } = useContext(ToggleGroupContext);

  const isSelected = selected === value;

  return (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      disabled={disabled}
      style={[
        styles.item,
        isSelected ? styles.itemSelected : null,
        disabled ? styles.itemDisabled : null,
      ]}
    >
      <Text style={[styles.text, isSelected ? styles.textSelected : null]}>{label}</Text>
    </TouchableOpacity>
  );
};


export const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  itemSelected: {
    backgroundColor: '#007bff',
  },
  itemDisabled: {
    opacity: 0.5,
  },
  text: {
    color: '#333',
  },
  textSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
