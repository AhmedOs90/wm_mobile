// screens/JobSearchError.native.tsx
import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import Button from '@/components/ui/button';
import Layout from '@/components/shared/layout/Layout';
import { useJobSearch } from '@/contexts/JobSearchContext';

export const JobSearchError: React.FC = () => {
  const { error, queryClient } = useJobSearch();

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['jobs'] });
  }, [queryClient]);

  return (
    <Layout>
      <View className="p-6 bg-gray-50 min-h-screen">
        <View className="py-8 items-center">
          <Text className="text-red-500 text-lg mb-2">Error loading jobs</Text>
          <Text className="text-gray-600 text-center">
            {error?.message || 'An error occurred while fetching jobs'}
          </Text>

          <Button
            variant="outline"
            style={{ marginTop: 16 }}
            onPress={handleRetry}
          >
            Try Again
          </Button>
        </View>
      </View>
    </Layout>
  );
};

export default JobSearchError;
