import { View, Text } from 'react-native';
import { useProfile, useUpdateField } from '@/stores/userProfileStore';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CountrySelect, StateSelect, CitySelect } from '@/components/dropdowns';
import { useQuery } from '@tanstack/react-query';
import {
  staticDataControllerGetStatesByCountryId,
  staticDataControllerGetCitiesByStateId,
} from '@/wm-api/sdk.gen';

interface AddressCardProps {
  isEditing: boolean;
  showHeader?: boolean;
}

const AddressCard = ({ isEditing, showHeader = true }: AddressCardProps) => {
  const profile = useProfile();
  const updateField = useUpdateField();

  const { data: states } = useQuery({
    queryKey: ['states', profile?.residenceCountry?.id],
    queryFn: async () => {
      if (!profile?.residenceCountry?.id) return [];
      try {
        const response = await staticDataControllerGetStatesByCountryId({
          path: { countryId: profile.residenceCountry.id },
        });
        return response.data?.data || [];
      } catch (error) {
        console.error('Failed to fetch states:', error);
        return [];
      }
    },
    enabled: !!profile?.residenceCountry?.id,
  });

  const { data: cities } = useQuery({
    queryKey: ['cities', profile?.state?.id],
    queryFn: async () => {
      if (!profile?.state?.id) return [];
      try {
        const response = await staticDataControllerGetCitiesByStateId({
          path: { stateId: profile.state.id },
        });
        return response.data?.data || [];
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        return [];
      }
    },
    enabled: !!profile?.state?.id,
  });

  const handleCountryChange = (countryId: string, fieldName: 'nationality' | 'residenceCountry') => {
    updateField(fieldName, countryId ? { id: countryId, value: '' } : null);
    if (fieldName === 'residenceCountry') {
      updateField('state', null);
      updateField('city', null);
    }
  };

  const handleStateChange = (stateId: string) => {
    const selected = states?.find((s) => s.id === stateId);
    updateField('state', selected ? { id: selected.id, value: selected.state } : null);
    updateField('city', null);
  };

  const handleCityChange = (cityId: string) => {
    const selected = cities?.find((c) => c.id === cityId);
    updateField('city', selected ? { id: selected.id, value: selected.city } : null);
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
      {showHeader && (
        <View className="px-4 pt-5">
          <Text className="text-xl font-semibold">Address</Text>
        </View>
      )}
      <View className={`px-4 pb-6 ${!showHeader ? 'pt-6' : ''} space-y-6`}>
        {/* Nationality / Residence / State */}
        <View className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-1">Nationality</Text>
            {isEditing ? (
              <CountrySelect
                value={profile.nationality?.id || ''}
                onValueChange={(val) => handleCountryChange(val, 'nationality')}
              />
            ) : (
              <Text>{profile.nationality?.value || 'Not specified'}</Text>
            )}
          </View>

          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-1">Country of Residence</Text>
            {isEditing ? (
              <CountrySelect
                value={profile.residenceCountry?.id || ''}
                onValueChange={(val) => handleCountryChange(val, 'residenceCountry')}
              />
            ) : (
              <Text>{profile.residenceCountry?.value || 'Not specified'}</Text>
            )}
          </View>

          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-1">State / Province</Text>
            {isEditing ? (
              <StateSelect
                countryId={profile.residenceCountry?.id}
                value={profile.state?.id || ''}
                onValueChange={handleStateChange}
              />
            ) : (
              <Text>
                {profile.state?.id
                  ? states?.find((s) => s.id === profile.state?.id)?.state || profile.state?.value || 'Not specified'
                  : 'Not specified'}
              </Text>
            )}
          </View>
        </View>

        {/* City / Street */}
        <View className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-1">City</Text>
            {isEditing ? (
              <CitySelect
                stateId={profile.state?.id}
                value={profile.city?.id || ''}
                onValueChange={handleCityChange}
              />
            ) : (
              <Text>
                {profile.city?.id
                  ? cities?.find((c) => c.id === profile.city?.id)?.city || profile.city?.value || 'Not specified'
                  : 'Not specified'}
              </Text>
            )}
          </View>

          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-1">Street Address</Text>
            {isEditing ? (
              <Input
                value={profile.streetAddress || ''}
                onChangeText={(val) => updateField('streetAddress', val)}
                placeholder="Enter street address"
              />
            ) : (
              <Text>{profile.streetAddress || 'Not specified'}</Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

export default AddressCard;
