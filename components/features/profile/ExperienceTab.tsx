import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Plus } from 'lucide-react-native';

import Button from '@/components/ui/button';
import ExperienceCard from './ExperienceCard';
import { toast } from '@/hooks/use-toast';

import {
  useExperiencesData,
  useExperiencesLoading,
  useExperiencesError,
  useFetchExperiences,
  useDeleteExperience,
  type Experience
} from '@/stores/experienceStore';

interface ExperienceTabProps {
  onAddExperience: () => void;
  onEditExperience?: (experience: Experience) => void;
}

const ExperienceTab = ({
  onAddExperience,
  onEditExperience,
}: ExperienceTabProps) => {
  const experiences = useExperiencesData();
  const isLoading = useExperiencesLoading();
  const error = useExperiencesError();
  const refetchExperiences = useFetchExperiences();
  const deleteExperience = useDeleteExperience();

  const handleDeleteExperience = async (id: string | number) => {
    Alert.alert(
      'Delete Experience',
      'Are you sure you want to delete this experience?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExperience.mutateAsync(String(id));
              toast({
                title: 'Experience Deleted',
                description: 'Experience has been successfully deleted.',
              });
            } catch (err) {
              toast({
                title: 'Error',
                description: 'Failed to delete experience. Please try again.',
                variant: 'destructive',
              });
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="p-4 space-y-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-semibold">Work Experience</Text>
          <Button iconLeft={<Plus size={16} />} onPress={onAddExperience}>
            Add Experience
          </Button>
        </View>
        <View className="items-center py-8">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-gray-500">Loading experiences...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-4 space-y-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-semibold">Work Experience</Text>
          <Button iconLeft={<Plus size={16} />} onPress={onAddExperience}>
            Add Experience
          </Button>
        </View>
        <View className="items-center py-8">
          <Text className="text-red-500">Error loading experiences: {error}</Text>
          <Button
            variant="outline"
            onPress={() => refetchExperiences()}
            style={{ marginTop: 16 }}
          >
            Try Again
          </Button>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="p-4 space-y-6">
      <View className="flex-row justify-between items-center">
        <Text className="text-xl font-semibold">Work Experience</Text>
        <Button iconLeft={<Plus size={16} />} onPress={onAddExperience}>
          Add Experience
        </Button>
      </View>

      {experiences.length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-gray-500">No work experience added yet.</Text>
          <Button iconLeft={<Plus size={16} />} onPress={onAddExperience} style={{ marginTop: 16 }}>
            Add Your First Experience
          </Button>
        </View>
      ) : (
        experiences.map((experience) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            onEdit={onEditExperience}
            onDelete={handleDeleteExperience}
          />
        ))
      )}
    </ScrollView>
  );
};

export default ExperienceTab;
