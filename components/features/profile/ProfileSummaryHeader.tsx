// ProfileSummaryHeader.tsx (React Native)
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Avatar from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Edit, Briefcase } from 'lucide-react-native';
import { getProfileImage } from '@/lib/assetHelper';
import { useProfile, useUpdateField } from '@/stores/userProfileStore';
import { Input } from '@/components/ui/input';

interface ProfileSummaryHeaderProps {
  isEditing: boolean;
  onEdit: () => void;
  onUploadPhoto: () => void;
}

const ProfileSummaryHeader = ({
  isEditing,
  onEdit,
  onUploadPhoto,
}: ProfileSummaryHeaderProps) => {
  const profile = useProfile();
  const updateField = useUpdateField();
  const [isSaving, setIsSaving] = useState(false);

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <View className="items-center">
            <Text className="text-gray-500">Loading profile...</Text>
          </View>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
  const location = [
    profile.city?.value,
    profile.state?.value,
    profile.residenceCountry?.value,
  ]
    .filter(Boolean)
    .join(', ');

  const initials = `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}` || '?';
  const avatarUri = getProfileImage(profile.profilePicture as string | undefined);

  const handleEditClick = async () => {
    if (isEditing) {
      setIsSaving(true);
      try {
        await onEdit();
      } catch (error) {
        console.error('Failed to save changes:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      onEdit();
    }
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-3">
        <View className="flex flex-col md:flex-row items-start md:items-center gap-3">
          {/* Profile Image */}
          <View className="relative items-center">
            <Avatar uri={avatarUri} fallbackText={initials} size={96} />
            {isEditing && (
              <View
                style={{
                  position: 'absolute',
                  bottom: -10,
                  left: 0,
                  right: 0,
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onPress={onUploadPhoto}
                  disabled={isSaving}
                >
                  Change
                </Button>
              </View>
            )}
          </View>

          {/* Main Info */}
          <View className="flex-1 min-w-0 gap-3">
            <View className="gap-2">
              {isEditing ? (
                <View className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={profile.firstName || ''}
                    onChangeText={(val) => updateField('firstName', val)}
                    placeholder="First Name"
                    editable={!isSaving}
                  />
                  <Input
                    value={profile.lastName || ''}
                    onChangeText={(val) => updateField('lastName', val)}
                    placeholder="Last Name"
                    editable={!isSaving}
                  />
                </View>
              ) : (
                <Text className="text-xl md:text-2xl font-bold text-gray-900">
                  {fullName || 'Complete Your Profile'}
                </Text>
              )}

              {isEditing ? (
                <Input
                  value={profile.intro || ''}
                  onChangeText={(val) => updateField('intro', val)}
                  placeholder="Professional title or headline"
                  editable={!isSaving}
                />
              ) : profile.intro ? (
                <View className="flex-row items-center gap-2">
                  <Briefcase size={16} color="#2563eb" />
                  <Text className="text-base text-primary font-medium">
                    {profile.intro}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Contact Info */}
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {isEditing ? (
                <>
                  <View className="flex-row items-center gap-2">
                    <Mail size={16} color="#2563eb" />
                    <Text numberOfLines={1} className="text-gray-700">
                      {profile.email}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <Phone size={16} color="#2563eb" />
                    <View className="flex-1">
                      <Input
                        value={profile.phone || ''}
                        onChangeText={(val) => updateField('phone', val)}
                        placeholder="Phone"
                        editable={!isSaving}
                      />
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <MapPin size={16} color="#2563eb" />
                    <Text numberOfLines={1} className="text-gray-700">
                      {location}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  {profile.email ? (
                    <View className="flex-row items-center gap-2">
                      <Mail size={16} color="#2563eb" />
                      <Text numberOfLines={1} className="text-sm text-gray-600">
                        {profile.email}
                      </Text>
                    </View>
                  ) : null}

                  {profile.phone ? (
                    <View className="flex-row items-center gap-2">
                      <Phone size={16} color="#2563eb" />
                      <Text className="text-sm text-gray-600">{profile.phone}</Text>
                    </View>
                  ) : null}

                  {location ? (
                    <View className="flex-row items-center gap-2">
                      <MapPin size={16} color="#2563eb" />
                      <Text numberOfLines={1} className="text-sm text-gray-600">
                        {location}
                      </Text>
                    </View>
                  ) : null}
                </>
              )}
            </View>

            {/* Status Badges */}
            <View className="flex-row flex-wrap gap-2">
              <Badge variant="outline" style={{ backgroundColor: '#ecfdf5', borderColor: '#bbf7d0' }}>
                Available for Opportunities
              </Badge>
              {profile.dateOfBirth ? (
                <Badge variant="outline" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                  Profile Complete
                </Badge>
              ) : null}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex flex-col sm:flex-row md:flex-col gap-2">
            <Button
              onPress={handleEditClick}
              disabled={isSaving}
              variant={isEditing ? 'outline' : 'default'}
              iconLeft={<Edit size={16} color={isEditing ? '#111827' : '#ffffff'} />}
            >
              {isEditing ? (isSaving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
            </Button>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default ProfileSummaryHeader;
