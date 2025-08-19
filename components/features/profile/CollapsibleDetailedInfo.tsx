import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronRight, User, MapPin } from 'lucide-react-native';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PersonalInfoCard from './PersonalInfoCard';
import AddressCard from './AddressCard';

interface CollapsibleDetailedInfoProps {
  isEditing: boolean;
}

const CollapsibleDetailedInfo = ({ isEditing }: CollapsibleDetailedInfoProps) => {
  const [expandedSections, setExpandedSections] = useState({
    personal: false,
    address: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'personal' as const,
      title: 'Personal Information',
      icon: User,
      description: 'Gender, date of birth, and other personal details',
      component: <PersonalInfoCard isEditing={isEditing} showHeader={false} />
    },
    {
      id: 'address' as const,
      title: 'Address & Location',
      icon: MapPin,
      description: 'Nationality, residence, and location information',
      component: <AddressCard isEditing={isEditing} showHeader={false} />
    }
  ];

  return (
    <View className="space-y-4">
      {sections.map(({ id, title, icon: Icon, description, component }) => (
        <Card key={id} className="border-gray-200">
          <CardHeader className="pb-3">
            <TouchableOpacity
              onPress={() => toggleSection(id)}
              className="flex-row items-center justify-between w-full"
            >
              <View className="flex-row items-center gap-3">
                <View className="p-2 rounded-lg bg-primary/10">
                  <Icon size={16} color="#2563EB" />
                </View>
                <View>
                  <Text className="font-medium text-gray-900">{title}</Text>
                  <Text className="text-sm text-gray-500">{description}</Text>
                </View>
              </View>
              {expandedSections[id] ? (
                <ChevronDown size={16} color="#9CA3AF" />
              ) : (
                <ChevronRight size={16} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </CardHeader>

          {expandedSections[id] && (
            <CardContent className="pt-0">{component}</CardContent>
          )}
        </Card>
      ))}
    </View>
  );
};

export default CollapsibleDetailedInfo;
