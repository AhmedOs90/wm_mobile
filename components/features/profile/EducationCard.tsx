import React from 'react';
import { View, Text } from 'react-native';
import { Education } from '@/stores/educationStore';
import { Card, CardContent } from '@/components/ui/card';
import  Button  from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react-native';

interface EducationCardProps {
  education: Education;
  onEdit?: (education: Education) => void;
  onDelete?: (id: string | number) => void;
}

const EducationCard = ({ education, onEdit, onDelete }: EducationCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              {education.degree}
            </Text>
            <Text className="text-blue-600 font-medium">{education.school}</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {education.startDate.slice(0, 4)} - {education.endDate.slice(0, 4)}
            </Text>
            {!!education.gpa && (
              <Text className="text-sm text-gray-600 dark:text-gray-300">GPA: {education.gpa}</Text>
            )}
            {!!education.additionalInfo && (
              <Text className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {education.additionalInfo}
              </Text>
            )}
          </View>

          <View className="flex-row gap-2 ml-4">
            {onEdit && (
              <Button variant="ghost" size="sm" onPress={() => onEdit(education)}>
                <Edit size={16} color="#555" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onPress={() => onDelete(education.id)}>
                <Trash2 size={16} color="red" />
              </Button>
            )}
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default EducationCard;
