import { View, Text } from 'react-native';
import { User, FileText } from 'lucide-react-native';
import { useProfile, useUpdateField } from '@/stores/userProfileStore';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ProfessionalSummaryCardProps {
  isEditing: boolean;
  onEdit: () => void;
}

const ProfessionalSummaryCard = ({ isEditing, onEdit }: ProfessionalSummaryCardProps) => {
  const profile = useProfile();
  const updateField = useUpdateField();

  if (!profile) {
    return (
      <Card>
        <View className="p-6">
          <Text className="text-center text-gray-500">Loading...</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <View className="px-4 pt-5 pb-2 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <User size={20} color="#1f2937" />
          <Text className="text-lg font-semibold">Professional Summary</Text>
        </View>
      </View>

      <View className="px-4 pb-6 pt-2 space-y-6">
        {isEditing ? (
          <Textarea
            value={profile.summary || ''}
            onChangeText={(val) => updateField('summary', val)}
            placeholder="Describe your professional background, skills, and career objectives..."
            style={{ minHeight: 120 }}
          />
        ) : (
          <View style={{ minHeight: 120 }}>
            {profile.summary ? (
              <Text className="text-gray-700 leading-relaxed">
                {profile.summary}
              </Text>
            ) : (
              <View className="h-28 border-2 border-dashed border-gray-200 rounded-lg items-center justify-center">
                <FileText size={24} color="#9ca3af" />
                <Text className="text-xs text-gray-500 mt-1">Add a professional summary</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

export default ProfessionalSummaryCard;
