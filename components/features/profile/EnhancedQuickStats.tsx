import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import {
  Briefcase,
  GraduationCap,
  Award,
  Send,
  TrendingUp,
  Eye
} from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';

import { candidatesControllerGetProfileStats } from '@/wm-api/sdk.gen.ts';
import { ProfileStatsResponseDto } from '@/wm-api/types.gen.ts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EnhancedQuickStats = () => {
  const { data: profileStats, isLoading, error } = useQuery({
    queryKey: ['profileStats'],
    queryFn: async () => {
      try {
        const response = await candidatesControllerGetProfileStats();
        return response.data?.data;
      } catch (error) {
        console.error("Error fetching profile stats:", error);
        if (error instanceof Error) {
          throw error.message;
        }
        throw error;
      }
    },
    staleTime: 50 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const actualStats: ProfileStatsResponseDto = profileStats || {
    applications: 0,
    skills: 0,
    education: 0,
    experience: 0,
  };

  const statItems = [
    {
      label: 'Applications',
      value: actualStats.applications,
      icon: Send,
      color: '#2563eb', // text-blue-600
      bgColor: '#eff6ff', // bg-blue-50
      borderColor: '#bfdbfe', // border-blue-200
      description: 'Jobs applied',
    },
    {
      label: 'Skills',
      value: actualStats.skills,
      icon: Award,
      color: '#7c3aed', // text-purple-600
      bgColor: '#f5f3ff', // bg-purple-50
      borderColor: '#ddd6fe', // border-purple-200
      description: 'Verified skills',
    },
    {
      label: 'Education',
      value: actualStats.education,
      icon: GraduationCap,
      color: '#ea580c', // text-orange-600
      bgColor: '#fff7ed', // bg-orange-50
      borderColor: '#fed7aa', // border-orange-200
      description: 'Qualifications',
    },
    {
      label: 'Experience',
      value: actualStats.experience,
      icon: Briefcase,
      color: '#16a34a', // text-green-600
      bgColor: '#ecfdf5', // bg-green-50
      borderColor: '#bbf7d0', // border-green-200
      description: 'Years of work',
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <View className="p-4">
            <ActivityIndicator size="large" />
            <Text className="mt-2 text-gray-500">Loading stats...</Text>
          </View>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Text className="text-sm text-red-500">
            Failed to load profile stats. Please try again.
          </Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-base font-semibold text-gray-900">Profile Stats</Text>
          <Badge variant="outline">
            <View className="flex-row items-center gap-1">
              <TrendingUp size={12} color="#6b7280" />
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Profile Strength</Text>
            </View>
          </Badge>
        </View>

        <View className="flex flex-wrap flex-row -mx-1">
          {statItems.map((item) => (
            <View
              key={item.label}
              style={{
                width: '48%',
                margin: '1%',
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: item.borderColor,
                backgroundColor: item.bgColor,
              }}
            >
              <View className="flex-row justify-between mb-2">
                <item.icon size={20} color={item.color} />
                <Eye size={14} color="#9ca3af" />
              </View>
              <View>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: item.color }}>
                  {item.value}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
                  {item.label}
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  );
};

export default EnhancedQuickStats;
