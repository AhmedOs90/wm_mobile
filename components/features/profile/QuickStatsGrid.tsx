import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import type { QuickStats } from './types';

interface QuickStatsGridProps {
  stats: QuickStats;
}

const QuickStatsGrid = ({ stats }: QuickStatsGridProps) => {
  const items = [
    { label: 'Applications', value: stats.applications, color: 'text-green-600' },
    { label: 'Skills',       value: stats.skills,       color: 'text-purple-600' },
    { label: 'Education',    value: stats.education,    color: 'text-orange-600' },
    { label: 'Experience',   value: stats.experience,   color: 'text-blue-600' },
  ];

  return (
    <View className="flex-row flex-wrap -mx-2">
      {items.map((item) => (
        <View key={item.label} className="w-1/2 p-2">
          <Card>
            <CardContent className="p-4 items-center">
              <Text className={`text-2xl font-bold ${item.color}`}>{item.value}</Text>
              <Text className="text-sm text-gray-600">{item.label}</Text>
            </CardContent>
          </Card>
        </View>
      ))}
    </View>
  );
};

export default QuickStatsGrid;
