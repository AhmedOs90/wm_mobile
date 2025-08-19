import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Separator from '@/components/ui/separator';
import {
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  Clock,
  User,
  Phone,
  CheckCircle2,
} from 'lucide-react-native';
import { Experience } from '@/stores/experienceStore';

interface ExperienceCardProps {
  experience: Experience;
  onEdit?: (experience: Experience) => void;
  onDelete?: (id: string | number) => void;
}

const ExperienceCard = ({ experience, onEdit, onDelete }: ExperienceCardProps) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Keeps your original format: "Month YYYY"
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const getWorkplaceLabel = (workplace?: string | null) => {
    switch (workplace) {
      case 'REMOTE':
        return 'Remote';
      case 'HYBRID':
        return 'Hybrid';
      case 'ONSITE':
        return 'On-site';
      default:
        return workplace || '';
    }
  };

  const getWorkplaceBadgeColor = (workplace?: string | null) => {
    switch (workplace) {
      case 'REMOTE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'HYBRID':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ONSITE':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <View className="p-6">
        {/* Header Section */}
        <View className="flex-row items-start justify-between mb-6">
          <View className="flex-1">
            <View className="mb-2">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="p-2 rounded-lg bg-primary/10">
                  <Briefcase size={20} className="text-primary" />
                </View>
                <View>
                  <Text className="text-xl font-bold text-gray-900">{experience.title}</Text>
                  <Text className="text-sm font-medium text-muted-foreground">
                    {experience.company}
                  </Text>
                </View>
              </View>
            </View>

            {/* Status and Workplace Badges */}
            <View className="flex-row flex-wrap gap-3 mb-1">
              {experience.currentlyWorking ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <View className="flex-row items-center">
                    <CheckCircle2 size={12} className="mr-1" />
                    <Text>Currently Working</Text>
                  </View>
                </Badge>
              ) : null}

              {experience.jobWorkplace ? (
                <Badge className={getWorkplaceBadgeColor(experience.jobWorkplace)}>
                  <Text>{getWorkplaceLabel(experience.jobWorkplace)}</Text>
                </Badge>
              ) : null}

              {(experience.jobType?.jobType || experience.jobTypeId) ? (
                <Badge variant="outline" className="bg-gray-50">
                  <View className="flex-row items-center">
                    <Briefcase size={12} className="mr-1" />
                    <Text>{experience.jobType?.jobType || `Job Type ID: ${experience.jobTypeId}`}</Text>
                  </View>
                </Badge>
              ) : null}
            </View>
          </View>

          {/* Action Buttons */}
          {/* Action Buttons */}
<View style={{ flexDirection: 'row', gap: 8 }}>
  {onEdit ? (
    <Button
      variant="ghost"
      size="icon"
      onPress={() => onEdit(experience)}
      iconLeft={<Edit size={16} color="#374151" />} // gray-700
    />
  ) : null}

  {onDelete ? (
    <Button
      variant="ghost"
      size="icon"
      onPress={() => onDelete(experience.id)}
      iconLeft={<Trash2 size={16} color="#DC2626" />} // red-600
    />
  ) : null}
</View>

        </View>

        {/* Date and Location Section */}
        <View className="mb-6 mt-4">
          <View className="md:flex-row flex-col gap-4">
            <View className="flex-row items-center gap-2 text-muted-foreground mb-4 md:mb-0">
              <Calendar size={14} />
              <Text className="text-sm">
                {formatDate(experience.from)} -{' '}
                {experience.currentlyWorking ? 'Present' : formatDate(experience.to)}
              </Text>
            </View>

            {(experience.countryObj?.country ||
              experience.state?.state ||
              experience.city?.city) && (
              <View className="flex-row items-center gap-2 text-muted-foreground">
                <MapPin size={14} />
                <Text className="text-sm">
                  {[
                    experience.city?.city,
                    experience.state?.state,
                    experience.countryObj?.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        {experience.description ? (
          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <Clock size={16} className="text-primary" />
              <Text className="font-semibold text-gray-900">Role Description</Text>
            </View>
            <Text className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {experience.description}
            </Text>
          </View>
        ) : null}

        {/* Achievements Section */}
        {experience.achievements && experience.achievements.length > 0 ? (
          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-green-600" />
              <Text className="font-semibold text-gray-900">Key Achievements</Text>
            </View>
            <View className="space-y-2">
              {experience.achievements.map((achievement, index) => (
                <View key={index} className="flex-row items-start gap-3">
                  <View className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <Text className="text-gray-700 leading-relaxed flex-1">{achievement}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* References Section */}
        {experience.referenceName || experience.referenceContact ? (
          <>
            <Separator/>
            <View>
              <View className="flex-row items-center gap-2 mb-4">
                <User size={16} className="text-primary" />
                <Text className="font-semibold text-gray-900">Reference Information</Text>
              </View>
              <View className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                {experience.referenceName ? (
                  <Text className="font-medium text-gray-900 mb-2">
                    {experience.referenceName}
                  </Text>
                ) : null}
                {experience.referenceContact ? (
                  <View className="flex-row items-center gap-2">
                    <Phone size={12} />
                    <Text className="text-sm text-gray-600">{experience.referenceContact}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </>
        ) : null}

        {/* Company Information Section */}
        {experience.companyAddress || experience.companyContact ? (
          <>
            <Separator />
            <View>
              <View className="flex-row items-center gap-2 mb-4">
                <Building2 size={16} className="text-primary" />
                <Text className="font-semibold text-gray-900">Company Information</Text>
              </View>
              <View className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {experience.companyAddress ? (
                  <View className="mb-2">
                    <Text className="text-sm font-medium text-gray-700">Address:</Text>
                    <Text className="text-sm text-gray-600">{experience.companyAddress}</Text>
                  </View>
                ) : null}
                {experience.companyContact ? (
                  <View className="flex-row items-center gap-2">
                    <Phone size={12} />
                    <Text className="text-sm text-gray-600">{experience.companyContact}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </>
        ) : null}
      </View>
    </Card>
  );
};

export default ExperienceCard;
