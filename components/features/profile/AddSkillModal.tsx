import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Code, Award } from 'lucide-react-native';

import { ModalDialog } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { SkillSelect } from '@/components/dropdowns/SkillSelect';

import type { CreateSkillDto, UpdateSkillDto } from '@/wm-api/types.gen.ts';

interface SkillData {
  name: string;
  percentage: number;
  yearsOfExperience: number;
}

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: CreateSkillDto | UpdateSkillDto) => void;
  editingSkill?: {
    id: string | number;
    name: string;
    percentage?: number;
    yearsOfExperience?: number;
    skillId?: string;
    otherSkillId?: string;
  };
}

const experienceLevels = [
  { value: 1, label: '1 year' },
  { value: 2, label: '2 years' },
  { value: 3, label: '3 years' },
  { value: 4, label: '4 years' },
  { value: 5, label: '5+ years' }
];

const AddSkillModal = ({
  isOpen,
  onClose,
  onSave,
  editingSkill
}: AddSkillModalProps) => {
  const [formData, setFormData] = useState<SkillData>({
    name: '',
    percentage: 50,
    yearsOfExperience: 1
  });

  useEffect(() => {
    if (editingSkill && isOpen) {
      setFormData({
        name: editingSkill.name || '',
        percentage: editingSkill.percentage || 50,
        yearsOfExperience: editingSkill.yearsOfExperience || 1
      });
    } else if (!editingSkill && isOpen) {
      setFormData({
        name: '',
        percentage: 50,
        yearsOfExperience: 1
      });
    }
  }, [editingSkill, isOpen]);

  const handleInputChange = (field: keyof SkillData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a skill name.'
      });
      return;
    }

    if (editingSkill) {
      const updateData: UpdateSkillDto = {
        percentage: formData.percentage,
        yearsOfExperience: formData.yearsOfExperience
      };
      onSave(updateData);
    } else {
      const createData: CreateSkillDto = {
        name: formData.name,
        percentage: formData.percentage,
        yearsOfExperience: formData.yearsOfExperience
      };
      onSave(createData);
    }
  };

  return (
    <ModalDialog
      title={editingSkill ? 'Edit Skill' : 'Add Skill'}
      trigger={<></>} // Handled externally
      footer={
        <View className="flex-row justify-end space-x-4 pt-4">
          <Button variant="outline" onPress={onClose}>
            Cancel
          </Button>
          <Button onPress={handleSave}>
            {editingSkill ? 'Update' : 'Add Skill'}
          </Button>
        </View>
      }
    >
      {/* Skill Info */}
      <Card className="bg-blue-50/30 border-blue-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex-row items-center gap-2">
            <Code size={20} color="#2563eb" />
            <Text className="text-blue-600">Skill Information</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <View className="space-y-2">
            <Label>Skill Name *</Label>
            <SkillSelect
              value={formData.name}
              onValueChange={(value) => handleInputChange('name', value)}
              placeholder="Select or search for a skill..."
            />
            <Text className="text-xs text-gray-500">
              Search and select from available skills
            </Text>
          </View>

          <View className="space-y-2">
            <Label>Or enter custom skill</Label>
            <Input
              placeholder="e.g. React, Python, Project Management..."
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>
        </CardContent>
      </Card>

      {/* Proficiency Level */}
      <Card className="bg-green-50/30 border-green-200 mt-4">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex-row items-center gap-2">
            <Award size={20} color="#16a34a" />
            <Text className="text-green-600">Proficiency Level</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <View className="space-y-2">
            <Label>Skill Level: {formData.percentage}%</Label>
            <View className="w-full">
              <Input
                value={`${formData.percentage}`}
                onChangeText={(text) =>
                  handleInputChange('percentage', parseInt(text) || 0)
                }
                keyboardType="numeric"
              />
            </View>
            <View className="flex-row justify-between text-xs text-gray-500">
              <Text>Beginner</Text>
              <Text>Intermediate</Text>
              <Text>Expert</Text>
            </View>
          </View>

          <View className="space-y-2">
            <Label>Years of Experience</Label>
            <Select
              data={experienceLevels}
              value={formData.yearsOfExperience}
              onChange={(item) =>
                handleInputChange('yearsOfExperience', item.value)
              }
              placeholder="Select experience level"
            />
          </View>
        </CardContent>
      </Card>
    </ModalDialog>
  );
};

export default AddSkillModal;
