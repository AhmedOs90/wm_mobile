// components/jobs/JobSearchFilters.native.tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import Select, { type SelectOption } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CountrySelect, StateSelect, CitySelect } from '@/components/dropdowns';
import { Search, Filter } from 'lucide-react-native';
import { useJobSearch } from '@/contexts/JobSearchContext';

export const JobSearchFilters: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);

  const {
    inputSearchTerm,
    setInputSearchTerm,
    selectedCountry,
    selectedState,
    selectedCity,
    handleSearch,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
    isLoading,
    isFetching,
  } = useJobSearch();

  const [jobType, setJobType] = useState<string | number>('');
  const [experienceLevel, setExperienceLevel] = useState<string | number>('');
  const [salaryRange, setSalaryRange] = useState<string | number>('');
  const [remoteOnly, setRemoteOnly] = useState(false);

  const loading = isLoading || isFetching;

  const jobTypeOptions: SelectOption[] = [
    { label: 'Full-time', value: 'full-time' },
    { label: 'Part-time', value: 'part-time' },
    { label: 'Contract',  value: 'contract'  },
    { label: 'Internship', value: 'internship' },
  ];

  const experienceOptions: SelectOption[] = [
    { label: 'Entry Level',  value: 'entry'  },
    { label: 'Mid Level',    value: 'mid'    },
    { label: 'Senior Level', value: 'senior' },
    { label: 'Lead/Principal', value: 'lead' },
  ];

  const salaryOptions: SelectOption[] = [
    { label: '$50k - $75k',  value: '50-75'  },
    { label: '$75k - $100k', value: '75-100' },
    { label: '$100k - $125k',value: '100-125'},
    { label: '$125k+',       value: '125+'   },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Search + actions */}
        <View className="gap-4">
          <View className="relative">
            <View className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search size={16} color="#9CA3AF" />
            </View>
            <Input
              placeholder="Job title, keywords, or company"
              value={inputSearchTerm}
              onChangeText={setInputSearchTerm}
              onSubmitEditing={handleSearch}
              className="pl-9"
            />
          </View>

          <View className="flex-row gap-2">
            <Button
              onPress={handleSearch}
              disabled={loading}
              loading={loading}
              style={{ flex: 1 }}
              iconLeft={!loading ? <Search size={16} /> : undefined}
            >
              {loading ? 'Searching...' : 'Search Jobs'}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onPress={() => setShowFilters((v) => !v)}
              iconLeft={<Filter size={16} />}
            />
          </View>
        </View>

        {/* Location filters */}
        <View className="mt-4 gap-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Country</Text>
            <CountrySelect
              placeholder="Select country..."
              value={selectedCountry}
              onValueChange={handleCountryChange}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">State/Province</Text>
            <StateSelect
              countryId={selectedCountry}
              placeholder={selectedCountry ? 'Select state...' : 'Select country first'}
              value={selectedState}
              onValueChange={handleStateChange}
              disabled={!selectedCountry}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">City</Text>
            <CitySelect
              stateId={selectedState}
              placeholder={selectedState ? 'Select city...' : 'Select state first'}
              value={selectedCity}
              onValueChange={handleCityChange}
              disabled={!selectedState}
            />
          </View>
        </View>

        {/* Advanced filters */}
        {showFilters && (
          <View className="mt-6 pt-6 border-t gap-4">
            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Job Type</Text>
                <Select
                  data={jobTypeOptions}
                  value={jobType}
                  onChange={(item) => setJobType(item.value)}
                  placeholder="Select type"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Experience Level</Text>
                <Select
                  data={experienceOptions}
                  value={experienceLevel}
                  onChange={(item) => setExperienceLevel(item.value)}
                  placeholder="Select level"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Salary Range</Text>
                <Select
                  data={salaryOptions}
                  value={salaryRange}
                  onChange={(item) => setSalaryRange(item.value)}
                  placeholder="Select range"
                />
              </View>

              <View className="flex-row items-center gap-2">
                <Checkbox checked={remoteOnly} onChange={setRemoteOnly} />
                <Text className="text-sm font-medium text-gray-700">Remote only</Text>
              </View>
            </View>
          </View>
        )}
      </CardContent>
    </Card>
  );
};

export default JobSearchFilters;
