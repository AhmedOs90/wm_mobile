import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { ModalDialog } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { User, Briefcase } from 'lucide-react-native';

import {
  CountrySelect,
  JobTypeSelect,
  StateSelect,
  CitySelect,
  JobWorkplaceSelect,
} from '@/components/dropdowns';

import type {
  CreateExperienceDto,
  UpdateExperienceDto,
  UserExperience,
} from '@/wm-api/types.gen.ts';

interface ExperienceData {
  jobTypeId: string;
  jobWorkplace: string;
  jobTitle: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrentJob: boolean;
  description: string;
  countryId: string;
  stateId: string;
  cityId: string;
  reference: {
    name: string;
    position: string;
    contact1: string;
    contact2: string;
  };
}

interface AddExperienceModalProps {
  editingExperience?: UserExperience;
  onClose: () => void;
  onSave: (experience: CreateExperienceDto | UpdateExperienceDto) => void;
}

const AddExperienceModal = ({
  editingExperience,
  onClose,
  onSave,
}: AddExperienceModalProps) => {
  const [formData, setFormData] = useState<ExperienceData>({
    jobTypeId: '',
    jobWorkplace: '',
    jobTitle: '',
    company: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    isCurrentJob: false,
    description: '',
    countryId: '',
    stateId: '',
    cityId: '',
    reference: {
      name: '',
      position: '',
      contact1: '',
      contact2: '',
    },
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const years = Array.from({ length: 30 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    if (editingExperience) {
      const startDate = editingExperience.from ? new Date(editingExperience.from) : new Date();
      const endDate = editingExperience.to && !editingExperience.currentlyWorking
        ? new Date(editingExperience.to)
        : null;

      setFormData({
        jobTypeId: editingExperience.jobTypeId || '',
        jobWorkplace: editingExperience.jobWorkplace || 'ONSITE',
        jobTitle: editingExperience.title || '',
        company: editingExperience.company || '',
        startMonth: startDate.toLocaleString('default', { month: 'long' }),
        startYear: startDate.getFullYear().toString(),
        endMonth: endDate ? endDate.toLocaleString('default', { month: 'long' }) : '',
        endYear: endDate ? endDate.getFullYear().toString() : '',
        isCurrentJob: editingExperience.currentlyWorking || false,
        description: editingExperience.description || '',
        countryId: editingExperience.countryId || '',
        stateId: editingExperience.stateId || '',
        cityId: editingExperience.cityId || '',
        reference: { name: '', position: '', contact1: '', contact2: '' },
      });
    }
  }, [editingExperience]);

const handleInputChange = (field: string, value: string | boolean) => {
  if (field.startsWith('reference.')) {
    const [, child] = field.split('.');
    setFormData(prev => ({
      ...prev,
      reference: {
        ...prev.reference,
        [child]: value,
      },
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }
};

  const handleSave = () => {
    if (
      !formData.jobTitle ||
      !formData.company ||
      !formData.jobTypeId ||
      !formData.jobWorkplace ||
      !formData.startMonth ||
      !formData.startYear
    ) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const apiData: CreateExperienceDto = {
      title: formData.jobTitle,
      company: formData.company,
      description: formData.description,
      jobTypeId: formData.jobTypeId,
      jobWorkplace: formData.jobWorkplace as 'REMOTE' | 'HYBRID' | 'ONSITE',
      countryId: formData.countryId || undefined,
      stateId: formData.stateId || undefined,
      cityId: formData.cityId || undefined,
      from: `${formData.startYear}-${String(months.indexOf(formData.startMonth) + 1).padStart(2, '0')}-01`,
      to: formData.isCurrentJob ? undefined : `${formData.endYear}-${String(months.indexOf(formData.endMonth) + 1).padStart(2, '0')}-01`,
      currentlyWorking: formData.isCurrentJob,
    };

    onSave(apiData);
  };

  return (
    <ModalDialog
      title={editingExperience ? 'Edit Experience' : 'Add Experience/Activity'}
      trigger={
        <Button>{editingExperience ? 'Edit' : 'Add Experience'}</Button>
      }
      footer={
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="outline" onPress={onClose}>Cancel</Button>
          <Button onPress={handleSave}>{editingExperience ? 'Update' : 'Save'}</Button>
        </View>
      }
    >
      {/* ====== BASIC INFO ====== */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle><Briefcase size={18} /> Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Job Type *</Label>
          <JobTypeSelect
            value={formData.jobTypeId}
            onValueChange={(val) => handleInputChange('jobTypeId', val)}
          />

          <Label>Work Location *</Label>
          <JobWorkplaceSelect
            value={formData.jobWorkplace}
            onValueChange={(val) => handleInputChange('jobWorkplace', val)}
          />

          <Label>Job Title *</Label>
          <Input
            value={formData.jobTitle}
            placeholder="Job Title"
            onChangeText={(val) => handleInputChange('jobTitle', val)}
          />

          <Label>Company *</Label>
          <Input
            value={formData.company}
            placeholder="Company Name"
            onChangeText={(val) => handleInputChange('company', val)}
          />

          <Label>Start Date *</Label>
          <Select
            data={months.map(m => ({ label: m, value: m }))}
            value={formData.startMonth}
            onChange={(item) => handleInputChange('startMonth', String(item.value))}
            placeholder="Month"
          />
          <Select
            data={years.map(y => ({ label: y, value: y }))}
            value={formData.startYear}
            onChange={(item) => handleInputChange('startYear', item.value.toString())}
            placeholder="Year"
          />

          <Label>End Date *</Label>
          <Select
            data={months.map(m => ({ label: m, value: m }))}
            value={formData.endMonth}
            onChange={(item) => handleInputChange('endMonth', item.value.toString())}
            placeholder="Month"
            disabled={formData.isCurrentJob}
          />
          <Select
            data={years.map(y => ({ label: y, value: y }))}
            value={formData.endYear}
            onChange={(item) => handleInputChange('endYear', item.value.toString())}
            placeholder="Year"
            disabled={formData.isCurrentJob}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
  <Checkbox
    checked={formData.isCurrentJob}
    onChange={(val) => handleInputChange('isCurrentJob', val)}
  />
  <Label>I currently work here</Label>
</View>

        </CardContent>
      </Card>

      {/* ====== DESCRIPTION ====== */}
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle>Description & Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            placeholder="Enter description"
            onChangeText={(val) => handleInputChange('description', val)}
          />

          <CountrySelect
            value={formData.countryId}
            onValueChange={(val) => handleInputChange('countryId', val)}
          />
          <StateSelect
            countryId={formData.countryId}
            value={formData.stateId}
            onValueChange={(val) => handleInputChange('stateId', val)}
          />
          <CitySelect
            stateId={formData.stateId}
            value={formData.cityId}
            onValueChange={(val) => handleInputChange('cityId', val)}
          />
        </CardContent>
      </Card>

      {/* ====== REFERENCES ====== */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle><User size={18} /> References</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Name</Label>
          <Input
            value={formData.reference.name}
            onChangeText={(val) => handleInputChange('reference.name', val)}
            placeholder="Reference name"
          />

          <Label>Position</Label>
          <Input
            value={formData.reference.position}
            onChangeText={(val) => handleInputChange('reference.position', val)}
            placeholder="Position/Title"
          />

          <Label>Contact 1</Label>
          <Input
            value={formData.reference.contact1}
            onChangeText={(val) => handleInputChange('reference.contact1', val)}
            placeholder="Primary contact"
          />

          <Label>Contact 2</Label>
          <Input
            value={formData.reference.contact2}
            onChangeText={(val) => handleInputChange('reference.contact2', val)}
            placeholder="Secondary contact"
          />
        </CardContent>
      </Card>
    </ModalDialog>
  );
};
export default AddExperienceModal;
