import React from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Plus } from 'lucide-react-native';

import Button from '@/components/ui/button';
import EducationCard from './EducationCard';
import CertificationCard from './CertificationCard';

import {
  useEducation,
  useCertifications,
  useEducationLoading,
  useEducationError,
  useFetchEducation,
  useFetchCertifications,
  useDeleteEducation,
  type Education,
  type Certification
} from '@/stores/educationStore';

import { toast } from '@/hooks/use-toast';

interface EducationTabProps {
  onAddEducation: () => void;
  onAddCertification: () => void;
  onEditEducation?: (education: Education) => void;
  onEditCertification?: (certification: Certification) => void;
  onVerifyCertification?: (certification: Certification) => void;
}

const EducationTab = ({
  onAddEducation,
  onAddCertification,
  onEditEducation,
  onEditCertification,
  onVerifyCertification
}: EducationTabProps) => {
  const education = useEducation();
  const certifications = useCertifications();
  const isLoading = useEducationLoading();
  const error = useEducationError();
  const refetchEducation = useFetchEducation();
  const refetchCertifications = useFetchCertifications();
  const deleteEducation = useDeleteEducation();

  const handleDeleteEducation = async (id: string | number) => {
    Alert.alert(
      "Delete Education",
      "Are you sure you want to delete this education record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEducation.mutateAsync(String(id));
              toast({
                title: "Education Deleted",
                description: "Education record has been successfully deleted.",
              });
            } catch (err) {
              toast({
                title: "Error",
                description: "Failed to delete education record. Please try again.",
                variant: "destructive",
              });
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="p-4 space-y-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold">Education</Text>
          <Button onPress={onAddEducation} iconLeft={<Plus size={16} />}>
            Add Education
          </Button>
        </View>
        <View className="items-center py-8">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-gray-500">Loading education...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-4 space-y-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold">Education</Text>
          <Button onPress={onAddEducation} iconLeft={<Plus size={16} />}>
            Add Education
          </Button>
        </View>
        <View className="items-center py-8">
          <Text className="text-red-500">Error loading education: {error}</Text>
          <Button variant="outline" onPress={() => refetchEducation()} style={{ marginTop: 16 }}>
            Try Again
          </Button>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="p-4 space-y-6">
      {/* Education Section */}
      <View>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold">Education</Text>
          <Button onPress={onAddEducation} iconLeft={<Plus size={16} />}>
            Add Education
          </Button>
        </View>

        {education.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-gray-500">No education history added yet.</Text>
            <Button onPress={onAddEducation} style={{ marginTop: 16 }} iconLeft={<Plus size={16} />}>
              Add Your First Education
            </Button>
          </View>
        ) : (
          education.map((edu) => (
            <EducationCard
              key={edu.id}
              education={edu}
              onEdit={onEditEducation}
              onDelete={handleDeleteEducation}
            />
          ))
        )}
      </View>

      {/* Certifications Section */}
      <View className="mt-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold">Certifications</Text>
          <Button onPress={onAddCertification} iconLeft={<Plus size={16} />}>
            Add Certification
          </Button>
        </View>

        {certifications.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-gray-500">No certifications added yet.</Text>
            <Button onPress={onAddCertification} style={{ marginTop: 16 }} iconLeft={<Plus size={16} />}>
              Add Your First Certification
            </Button>
          </View>
        ) : (
          certifications.map((cert) => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              onEdit={onEditCertification}
              onVerify={onVerifyCertification}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default EducationTab;
