// components/RadioGroup.tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

type RadioOption = {
  value: string;
  label?: React.ReactNode;
};

type RadioGroupProps = {
  value: string;
  onValueChange: (val: string) => void;
  options: RadioOption[];
  style?: ViewStyle;
  itemStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  options,
  style,
  itemStyle,
  indicatorStyle,
}) => {
  return (
    <View style={[styles.group, style]}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.radio, itemStyle]}
          onPress={() => onValueChange(opt.value)}
          accessibilityRole="radio"
          accessibilityState={{ selected: value === opt.value }}
        >
          <View style={styles.circleOuter}>
            {value === opt.value && <View style={[styles.circleInner, indicatorStyle]} />}
          </View>
          {opt.label}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    gap: 8,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circleOuter: {
    width: 16,
    height: 16,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#3B82F6', // primary
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#3B82F6',
  },
});
