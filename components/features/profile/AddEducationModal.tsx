import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View, Switch } from 'react-native';
import { Education, CreateEducationDto, UpdateEducationDto } from '@/wm-api/types.gen';
import { toast } from '@/hooks/use-toast';
import Select from '@/components/ui/select';
import {DegreeLevelSelect} from '@/components/dropdowns/DegreeLevelSelect';
import { DegreeTypeSelect } from '@/components/dropdowns/DegreeTypeSelect';
import Button from '@/components/ui/button';

interface EducationData {
  degreeLevelId: string;
  degreeTypeId: string;
  university: string;
  startYear: string;
  endYear: string;
  isCurrentlyStudying: boolean;
  grade: string;
  additionalInfo: string;
}

interface AddEducationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (education: CreateEducationDto | UpdateEducationDto) => void;
  editingEducation?: Education;
}

const AddEducationModal = ({ visible, onClose, onSave, editingEducation }: AddEducationModalProps) => {
  const [formData, setFormData] = useState<EducationData>({
    degreeLevelId: '',
    degreeTypeId: '',
    university: '',
    startYear: '',
    endYear: '',
    isCurrentlyStudying: false,
    grade: '',
    additionalInfo: ''
  });

  const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    if (editingEducation && visible) {
      const startDate = editingEducation.year_from ? new Date(editingEducation.year_from) : new Date();
      const present = Date.now();
      const endDate = editingEducation.year_to !== present && editingEducation.year_to ? new Date(editingEducation.year_to) : null;
      setFormData({
        degreeLevelId: editingEducation.degreeLevelId || '',
        degreeTypeId: editingEducation.degreeTypeId || '',
        university: editingEducation.institution || '',
        startYear: startDate.getFullYear().toString(),
        endYear: endDate ? endDate.getFullYear().toString() : '',
        isCurrentlyStudying: editingEducation.isOngoing,
        grade: editingEducation.degree_result ? editingEducation.degree_result.toString() : '',
        additionalInfo: editingEducation.description || ''
      });
    } else if (!editingEducation && visible) {
      setFormData({
        degreeLevelId: '',
        degreeTypeId: '',
        university: '',
        startYear: '',
        endYear: '',
        isCurrentlyStudying: false,
        grade: '',
        additionalInfo: ''
      });
    }
  }, [editingEducation, visible]);

  const handleInputChange = (field: keyof EducationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.degreeLevelId || !formData.degreeTypeId || !formData.university || !formData.startYear) {
      toast({ title: 'Missing Information', description: 'Please fill in all required fields.' });
      return;
    }
    if (formData.grade) {
      const gradeNumber = parseFloat(formData.grade);
      if (isNaN(gradeNumber) || gradeNumber < 1 || gradeNumber > 100) {
        toast({ title: 'Invalid Grade', description: 'Grade must be between 1 and 100.' });
        return;
      }
    }

    const apiData = {
      degree_title: 'General Studies',
      institution: formData.university,
      degreeLevelId: formData.degreeLevelId,
      degreeTypeId: formData.degreeTypeId,
      from: `${formData.startYear}-01-01`,
      to: formData.isCurrentlyStudying ? undefined : `${formData.endYear}-12-31`,
      isOngoing: formData.isCurrentlyStudying,
      degree_result: formData.grade ? parseFloat(formData.grade) : undefined,
      description: formData.additionalInfo || ''
    };

    onSave(apiData);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          {editingEducation ? 'Edit Education' : 'Add Degree'}
        </Text>
        <DegreeLevelSelect
          value={formData.degreeLevelId}
          onValueChange={(val: string | boolean) => handleInputChange('degreeLevelId', val)}
        />

        <View style={{ height: 10 }} />

        <DegreeTypeSelect
          value={formData.degreeTypeId}
          onValueChange={(val: string | boolean) => handleInputChange('degreeTypeId', val)}
        />

        <View style={{ height: 10 }} />
        <Text>University *</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6 }}
          value={formData.university}
          placeholder="University name"
          onChangeText={(text) => handleInputChange('university', text)}
        />

        <View style={{ height: 10 }} />
        <Select
          data={years.map(y => ({ label: y, value: y }))}
          value={formData.startYear}
          onChange={(item: { label: string; value: string | number }) => handleInputChange('startYear', item.value.toString())}
          placeholder="Start Year"
        />

        <View style={{ height: 10 }} />
        <Select
          data={years.map(y => ({ label: y, value: y }))}
          value={formData.endYear}
          onChange={(item: { label: string; value: string | number }) => handleInputChange('endYear', item.value.toString())}
          placeholder="End Year"
          disabled={formData.isCurrentlyStudying}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ marginRight: 10 }}>Currently Studying</Text>
          <Switch
            value={formData.isCurrentlyStudying}
            onValueChange={(val) => handleInputChange('isCurrentlyStudying', val)}
          />
        </View>

        <View style={{ height: 10 }} />
        <Text>Grade (%)</Text>
        <TextInput
          keyboardType="numeric"
          value={formData.grade}
          placeholder="Enter grade (1–100)"
          onChangeText={(text) => handleInputChange('grade', text)}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6 }}
        />

        <View style={{ height: 10 }} />
        <Text>Additional Info</Text>
        <TextInput
          value={formData.additionalInfo}
          onChangeText={(text) => handleInputChange('additionalInfo', text)}
          placeholder="Additional details..."
          multiline
          numberOfLines={4}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6 }}
        />

        <View style={{ height: 20 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <Button onPress={onClose} variant="outline">Cancel</Button>
  <Button onPress={handleSave}>{editingEducation ? 'Update' : 'Save'}</Button>
</View>

      </ScrollView>
    </Modal>
  );
};

export default AddEducationModal;