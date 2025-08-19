// SkillsTab.tsx (React Native)
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react-native';
import { toast } from '@/hooks/use-toast';

import {
  useSkills,
  useSkillsLoading,
  useSkillsError,
  useFetchSkills,
  useDeleteSkill,
  type Skill,
} from '@/stores/skillsStore';

interface SkillsTabProps {
  onAddSkill: () => void;
  onEditSkill?: (skill: Skill) => void;
}

const SkillsTab = ({ onAddSkill, onEditSkill }: SkillsTabProps) => {
  const skills = useSkills();
  const isLoading = useSkillsLoading();
  const error = useSkillsError();
  const refetchSkills = useFetchSkills();
  const deleteSkill = useDeleteSkill();

  const handleDeleteSkill = (id: string | number) => {
    Alert.alert(
      'Delete Skill',
      'Are you sure you want to delete this skill?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSkill.mutateAsync(String(id));
              toast({
                title: 'Skill Deleted',
                description: 'Skill has been successfully deleted.',
              });
            } catch {
              toast({
                title: 'Error',
                description: 'Failed to delete skill. Please try again.',
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
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold">Skills & Expertise</Text>
          <Button iconLeft={<Plus size={16} />} onPress={onAddSkill}>
            Add Skill
          </Button>
        </View>
        <View className="items-center py-8">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-gray-500">Loading skills...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-4 space-y-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold">Skills & Expertise</Text>
          <Button iconLeft={<Plus size={16} />} onPress={onAddSkill}>
            Add Skill
          </Button>
        </View>
        <View className="items-center py-8">
          <Text className="text-red-500">Error loading skills: {error}</Text>
          <Button
            variant="outline"
            onPress={() => refetchSkills()}
            style={{ marginTop: 16 }}
          >
            Try Again
          </Button>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="p-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-semibold">Skills & Expertise</Text>
        <Button iconLeft={<Plus size={16} />} onPress={onAddSkill}>
          Add Skill
        </Button>
      </View>

      {skills.length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-gray-500">No skills added yet.</Text>
          <Button
            iconLeft={<Plus size={16} />}
            onPress={onAddSkill}
            style={{ marginTop: 16 }}
          >
            Add Your First Skill
          </Button>
        </View>
      ) : (
        <View className="flex-row flex-wrap -mx-2">
          {skills.map((skill) => {
            const pct = skill.percentage ?? 0;
            return (
              <View key={skill.id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                <Card className="hover:shadow-md">
                  <CardContent className="p-4">
                    <View className="flex-row justify-between items-start mb-3">
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text className="font-semibold text-gray-900 mb-1">
                          {skill.name}
                        </Text>

                        <View className="gap-2">
                          <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">
                              Proficiency
                            </Text>
                            <Text className="text-sm font-medium">{pct}%</Text>
                          </View>

                          {/* Progress bar */}
                          <View
                            style={{
                              width: '100%',
                              height: 8,
                              backgroundColor: '#e5e7eb', // gray-200
                              borderRadius: 9999,
                              overflow: 'hidden',
                            }}
                          >
                            <View
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                backgroundColor: '#2563eb', // blue-600
                                borderRadius: 9999,
                              }}
                            />
                          </View>

                          {skill.yearsOfExperience ? (
                            <Text className="text-xs text-gray-500">
                              {skill.yearsOfExperience} year
                              {skill.yearsOfExperience > 1 ? 's' : ''} experience
                            </Text>
                          ) : null}
                        </View>
                      </View>

                      <View className="flex-row ml-2">
                        {onEditSkill ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onPress={() => onEditSkill(skill)}
                            iconLeft={<Edit size={16} color="#2563eb" />}
                            style={{ marginRight: 6 }}
                          />
                        ) : null}
                        <Button
                          variant="ghost"
                          size="icon"
                          onPress={() => handleDeleteSkill(skill.id)}
                          iconLeft={<Trash2 size={16} color="#DC2626" />}
                        />
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default SkillsTab;
