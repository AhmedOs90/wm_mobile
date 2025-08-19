import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Briefcase } from 'lucide-react-native';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  style?: object;
}

const EmptyState = memo(({ 
  message, 
  icon = <Briefcase size={48} color="#9ca3af" />,  // Tailwind's text-muted-foreground = #9ca3af
  style = {} 
}: EmptyStateProps) => (
  <View style={[styles.container, style]}>
    <View style={styles.iconWrapper}>
      {icon}
    </View>
    <Text style={styles.message}>{message}</Text>
  </View>
));

EmptyState.displayName = 'EmptyState';

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb', // Tailwind border-border = #e5e7eb
    backgroundColor: '#ffffff', // Tailwind bg-card = #ffffff
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  iconWrapper: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 18,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
