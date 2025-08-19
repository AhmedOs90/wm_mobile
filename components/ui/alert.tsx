// components/ui/Alert.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type AlertVariant = 'default' | 'destructive';

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
}

export const Alert = ({ variant = 'default', children }: AlertProps) => {
  return (
    <View style={[styles.alert, variantStyles[variant]]}>
      {children}
    </View>
  );
};

export const AlertTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.title}>{children}</Text>
);

export const AlertDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => <Text style={styles.description}>{children}</Text>;
const styles = StyleSheet.create({
  alert: {
    width: '100%',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

const variantStyles: Record<'default' | 'destructive', any> = {
  default: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
  },
  destructive: {
    backgroundColor: '#fff5f5',
    borderColor: '#fca5a5',
  },
};
