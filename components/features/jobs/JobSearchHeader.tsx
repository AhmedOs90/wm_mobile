// components/jobs/JobSearchHeader.native.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface JobSearchHeaderProps {
  title?: string;
  subtitle?: string;
}

export const JobSearchHeader: React.FC<JobSearchHeaderProps> = ({
  title = 'Find Your Dream Job',
  subtitle = 'Discover opportunities that match your skills and career goals',
}) => {
  return (
    <View className="mb-6">
      <Text className="text-3xl font-bold text-gray-900 mb-2">{title}</Text>
      <Text className="text-gray-600">{subtitle}</Text>
    </View>
  );
};

export default JobSearchHeader;
