// components/states/ErrorState.tsx

import Button from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
  title?: string;
  style?: object;
}

const ErrorState = memo(({ 
  error, 
  onRetry, 
  title = 'Failed to load data',
  style = {} 
}: ErrorStateProps) => (
  <View style={[styles.container, style]}>
    <AlertTriangle color="#EF4444" size={48} style={styles.icon} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{error.message || 'An unexpected error occurred'}</Text>
    <Button variant="outline" onPress={onRetry} iconLeft={<RefreshCw size={16} color="black" />}>
      Try Again
    </Button>
  </View>
));

ErrorState.displayName = 'ErrorState';

export default ErrorState;
const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA', // red-200
    backgroundColor: '#ffffff',
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827', // gray-900
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#4B5563', // gray-600
    marginBottom: 16,
    textAlign: 'center',
  },
});
