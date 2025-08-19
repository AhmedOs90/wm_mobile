import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <Text className="text-sm text-gray-500">
          Control your privacy and data preferences
        </Text>
      </CardHeader>

      <CardContent>
        <View className="items-center justify-center p-12 rounded-lg border-2 border-dashed border-gray-300">
          <View className="items-center">
            <Text className="text-xl font-medium text-gray-500">Coming Soon</Text>
            <Text className="text-sm text-gray-500 text-center mt-1">
              Privacy control features are currently in development
            </Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;

