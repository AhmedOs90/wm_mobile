// components/Separator.tsx
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

type SeparatorProps = {
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
  decorative?: boolean; // not used, for parity only
};

const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  style,
}) => {
  return (
    <View
      style={[
        orientation === 'horizontal'
          ? styles.horizontal
          : styles.vertical,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
    backgroundColor: '#e5e7eb', // Tailwind gray-200 (border)
  },
  vertical: {
    width: 1,
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
});

export default Separator;
