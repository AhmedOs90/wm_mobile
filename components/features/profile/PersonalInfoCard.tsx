import { View, Text, Alert, ViewStyle, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { Popover } from '@/components/ui/popover';
import { AppCalendar } from '@/components/ui/calendar';

import { useProfile, useUpdateField, useFormErrors } from '@/stores/userProfileStore';
import { staticDataControllerGetGenders } from '@/wm-api/sdk.gen.ts';
import { Gender } from '@/wm-api/types.gen';

interface PersonalInfoCardProps {
  isEditing: boolean;
  showHeader?: boolean;
}

const PersonalInfoCard = ({ isEditing, showHeader = true }: PersonalInfoCardProps) => {
  const profile = useProfile();
  const updateField = useUpdateField();
  const formErrors = useFormErrors();
  const [genders, setGenders] = useState<Gender[]>([]);

  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    profile?.dateOfBirth ? new Date(profile.dateOfBirth) : undefined
  );

  useEffect(() => {
    if (profile?.dateOfBirth) {
      setDateOfBirth(new Date(profile.dateOfBirth));
    }
  }, [profile?.dateOfBirth]);

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await staticDataControllerGetGenders();
        setGenders(response.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch genders:', error);
      }
    };
    fetchGenders();
  }, []);

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
      {showHeader && (
        <View className="px-4 pt-5">
          <Text className="text-xl font-semibold">Personal Information</Text>
        </View>
      )}

      <View className={`space-y-6 px-4 pb-6 ${!showHeader ? 'pt-6' : ''}`}>
        {/* Gender */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Gender</Text>
          {isEditing ? (
            <>
              <Select
                data={genders.map((g) => ({ label: g.gender, value: g.id }))}
                value={profile.gender?.id || ''}
                onChange={(item) => {
                  const selected = genders.find((g) => g.id === item.value);
                  updateField('gender', selected ? { id: selected.id, value: selected.gender } : null);
                }}
                placeholder="Select gender"
              />
              {formErrors.gender && (
                <Text className="text-red-500 text-xs mt-1">{formErrors.gender}</Text>
              )}
            </>
          ) : (
            <Text>
              {profile.gender?.id
                ? genders.find((g) => g.id === profile.gender?.id)?.gender || profile.gender?.value || 'Not specified'
                : 'Not specified'}
            </Text>
          )}
        </View>

        {/* Date of Birth */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Date of Birth <Text className="text-red-500">*</Text>
          </Text>
          {isEditing ? (
            <Popover
              content={
                <AppCalendar
                  onDayPress={(day) => {
                    const date = new Date(day.dateString);
                    setDateOfBirth(date);
                    updateField('dateOfBirth', date.toISOString().split('T')[0]);
                  }}
                  markedDates={
                    dateOfBirth
                      ? {
                        [dateOfBirth.toISOString().split('T')[0]]: {
                          selected: true,
                          selectedColor: '#1f2937',
                        },
                      }
                      : undefined
                  }
                />
              }
            >
              <Button
                variant="outline"
                style={StyleSheet.flatten([
                  {
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'row',
                  },
                  !dateOfBirth ? { opacity: 0.6 } : null,
                  formErrors.dateOfBirth ? { borderColor: '#EF4444', borderWidth: 1 } : null,
                ])}
              >
                <CalendarIcon size={16} style={{ marginRight: 8 }} />
                <Text style={{ fontWeight: '400' }}>
                  {dateOfBirth ? format(dateOfBirth, 'PPP') : 'Pick a date'}
                </Text>
              </Button>

            </Popover>
          ) : (
            <Text>{dateOfBirth ? format(dateOfBirth, 'PPP') : 'Not specified'}</Text>
          )}
          {formErrors.dateOfBirth && (
            <Text className="text-red-500 text-xs mt-1">{formErrors.dateOfBirth}</Text>
          )}
        </View>
      </View>
    </Card>
  );
};

export default PersonalInfoCard;
