// components/ui/Badge.tsx
import React from 'react';
import { Text, View, StyleSheet, ViewProps } from 'react-native';

type Variant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps extends ViewProps {
  variant?: Variant;
  children: React.ReactNode;
}

const Badge = ({ variant = 'default', style, children, ...props }: BadgeProps) => {
  return (
    <View style={[styles.base, variantStyles[variant], style]} {...props}>
      <Text style={[styles.text, textStyles[variant]]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

const variantStyles: Record<Variant, object> = {
  default: {
    backgroundColor: '#3b82f6', // primary
    borderColor: 'transparent',
  },
  secondary: {
    backgroundColor: '#e5e7eb',
    borderColor: 'transparent',
  },
  destructive: {
    backgroundColor: '#ef4444',
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#6b7280',
  },
};

const textStyles: Record<Variant, object> = {
  default: { color: 'white' },
  secondary: { color: '#111827' },
  destructive: { color: 'white' },
  outline: { color: '#111827' },
};

export { Badge };
