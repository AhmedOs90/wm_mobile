import React from 'react';
import { View, Text } from 'react-native';
import Button from '@/components/ui/button';
import { Edit } from 'lucide-react-native';

interface ProfileHeaderProps {
  isEditing: boolean;
  onToggleEdit: () => void;
}

const ProfileHeader = ({ isEditing, onToggleEdit }: ProfileHeaderProps) => {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-3xl font-bold text-gray-900">My Profile</Text>
        <Button
          variant="outline"
          size="sm"
          onPress={onToggleEdit}
          iconLeft={<Edit size={16} />}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </View>
      <Text className="text-gray-600">
        Manage your professional profile and showcase your skills
      </Text>
    </View>
  );
};

export default ProfileHeader;
