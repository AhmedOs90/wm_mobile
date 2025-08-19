import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Upload, User, Mail, Phone, Briefcase } from 'lucide-react-native';
import Avatar from '@/components/ui/avatar';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProfile, useUpdateField, useFormErrors } from '@/stores/userProfileStore';
import { useState } from 'react';
import { getProfileImage } from '@/lib/assetHelper';
import {Card} from '@/components/ui/card'; // assuming your RN version is also implemented

interface BasicInformationCardProps {
  isEditing: boolean;
  onUploadPhoto: () => void;
}

const BasicInformationCard = ({ isEditing, onUploadPhoto }: BasicInformationCardProps) => {
  const profile = useProfile();
  const updateField = useUpdateField();
  const formErrors = useFormErrors();
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  const handleProfilePictureChange = async () => {
    // TODO: integrate image picker (e.g., react-native-image-picker)
    Alert.alert('Not implemented', 'Image picker integration is pending.');
  };

  if (!profile) {
    return (
      <Card>
        <View className="p-6">
          <Text className="text-center text-gray-500">Loading profile...</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <View className="px-4 py-5">
        <Text className="text-xl font-semibold mb-4">General Information</Text>

        {/* Avatar and Upload */}
        <View className="flex-row items-center space-x-4 mb-6">
          <Avatar
            uri={profilePicturePreview || getProfileImage(profile.profilePicture as string)}
            fallbackText={`${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`}
            size={96}
          />
          <View>
            {isEditing ? (
              <TouchableOpacity onPress={handleProfilePictureChange}>
                <Button variant="outline">
                  <Upload size={16} className="mr-2" />
                  {profile.profilePicture ? 'Change Photo' : 'Upload Photo'}
                </Button>
              </TouchableOpacity>
            ) : (
              <Button variant="outline" onPress={onUploadPhoto} disabled>
                <Upload size={16} className="mr-2" />
                View Photo
              </Button>
            )}
            <Text className="text-xs text-gray-500 mt-1">
              JPG, PNG or GIF. Max size of 2MB
            </Text>
          </View>
        </View>

        {/* Input fields */}
        <View className="flex-col space-y-6">
          {/* First Name & Last Name */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-1">First Name <Text className="text-red-500">*</Text></Text>
              {isEditing ? (
                <>
                  <Input
                    value={profile.firstName || ''}
                    onChangeText={(val) => updateField('firstName', val)}
                    className={formErrors.firstName ? 'border-red-500' : ''}
                  />
                  {formErrors.firstName && <Text className="text-red-500 text-xs mt-1">{formErrors.firstName}</Text>}
                </>
              ) : (
                <View className="flex-row items-center space-x-2">
                  <User size={16} color="#9ca3af" />
                  <Text>{profile.firstName || 'Not provided'}</Text>
                </View>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-1">Last Name <Text className="text-red-500">*</Text></Text>
              {isEditing ? (
                <>
                  <Input
                    value={profile.lastName || ''}
                    onChangeText={(val) => updateField('lastName', val)}
                    className={formErrors.lastName ? 'border-red-500' : ''}
                  />
                  {formErrors.lastName && <Text className="text-red-500 text-xs mt-1">{formErrors.lastName}</Text>}
                </>
              ) : (
                <View className="flex-row items-center space-x-2">
                  <User size={16} color="#9ca3af" />
                  <Text>{profile.lastName || 'Not provided'}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Email */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Email <Text className="text-red-500">*</Text></Text>
            {isEditing ? (
              <>
                <Input
                  value={profile.email || ''}
                  onChangeText={(val) => updateField('email', val)}
                  keyboardType="email-address"
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && <Text className="text-red-500 text-xs mt-1">{formErrors.email}</Text>}
              </>
            ) : (
              <View className="flex-row items-center space-x-2">
                <Mail size={16} color="#9ca3af" />
                <Text>{profile.email || 'Not provided'}</Text>
              </View>
            )}
          </View>

          {/* Phone */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Phone <Text className="text-red-500">*</Text></Text>
            {isEditing ? (
              <>
                <Input
                  value={profile.phone || ''}
                  onChangeText={(val) => updateField('phone', val)}
                  keyboardType="phone-pad"
                  className={formErrors.phone ? 'border-red-500' : ''}
                />
                {formErrors.phone && <Text className="text-red-500 text-xs mt-1">{formErrors.phone}</Text>}
              </>
            ) : (
              <View className="flex-row items-center space-x-2">
                <Phone size={16} color="#9ca3af" />
                <Text>{profile.phone || 'Not provided'}</Text>
              </View>
            )}
          </View>

          {/* Location */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Location</Text>
            {isEditing ? (
              <>
                <Input
                  value={profile.streetAddress || ''}
                  onChangeText={(val) => updateField('streetAddress', val)}
                  className={formErrors.streetAddress ? 'border-red-500' : ''}
                />
                {formErrors.streetAddress && <Text className="text-red-500 text-xs mt-1">{formErrors.streetAddress}</Text>}
              </>
            ) : (
              <View className="flex-row items-center space-x-2">
                <Briefcase size={16} color="#9ca3af" />
                <Text>{profile.streetAddress || 'Not provided'}</Text>
              </View>
            )}
          </View>

          {/* Professional Intro */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Professional Intro</Text>
            {isEditing ? (
              <>
                <Textarea
                  style={{ minHeight: 100 }} // or `height: 100`
                  value={profile.intro || ''}
                  onChangeText={(val) => updateField('intro', val)}
                  placeholder="Write a brief introduction about yourself..."
                  className={formErrors.intro ? 'border-red-500' : ''}
                />
                {formErrors.intro && <Text className="text-red-500 text-xs mt-1">{formErrors.intro}</Text>}
              </>
            ) : (
              <Text className="text-gray-700">{profile.intro || 'No intro provided'}</Text>
            )}
          </View>

          {/* Professional Summary */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Professional Summary</Text>
            {isEditing ? (
              <>
                <Textarea
                  value={profile.summary || ''}
                  style={{ minHeight: 120 }} // or `height: 100`
                  
                  onChangeText={(val) => updateField('summary', val)}
                  placeholder="Write a detailed summary about your professional background, skills, and career objectives..."
                  className={formErrors.summary ? 'border-red-500' : ''}
                />
                {formErrors.summary && <Text className="text-red-500 text-xs mt-1">{formErrors.summary}</Text>}
              </>
            ) : (
              <Text className="text-gray-600">{profile.summary || 'No summary provided'}</Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

export default BasicInformationCard;
