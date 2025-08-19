// components/states/LoadingSpinner.tsx

import React, { memo } from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  color?: string;
}

const sizeMap = {
  sm: 20,
  md: 36,
  lg: 48,
};

const LoadingSpinner = memo(({ size = 'md', style, color = '#2563EB' }: LoadingSpinnerProps) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={sizeMap[size]} color={color} />
    </View>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
