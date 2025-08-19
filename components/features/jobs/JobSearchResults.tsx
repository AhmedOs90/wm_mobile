// screens/JobSearchResults.native.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/ui/button';
import Select, { type SelectOption } from '@/components/ui/select';
import JobCard from '@/components/JobCard'; // <-- use your RN JobCard from earlier
import { useJobSearch } from '@/contexts/JobSearchContext';
import { useApplyToJob } from '@/hooks/useApplyToJob';

export const JobSearchResults: React.FC = () => {
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const navigation = useNavigation();
  const {
    jobs,
    totalJobs,
    savedJobIds,
    isLoading,
    isFetching,
    hasMore,
    handleSave,
    loadMore,
    searchTerm,
    selectedCountry,
    selectedState,
    selectedCity,
    isPublic,
  } = useJobSearch();

  const { mutate: applyToJob } = useApplyToJob();

  const handleApply = useCallback(
    (jobId: string) => {
      setApplyingJobId(jobId);
      applyToJob(jobId, {
        onSettled: () => setApplyingJobId(null),
      });
    },
    [applyToJob]
  );

  const handleViewDetails = useCallback(
    (jobId: string) => {
      // Adjust the route name to your navigator (e.g., 'JobDetails')
      // @ts-ignore
      navigation.navigate('JobDetails', { jobId });
    },
    [navigation]
  );

  const handleSignUpClick = useCallback(() => {
    // @ts-ignore
    navigation.navigate('Signup');
  }, [navigation]);

  // --- Optional sort (local only; plug into context/API later if desired)
  const [sortValue, setSortValue] = useState<string | number>('newest');
  const sortOptions: SelectOption[] = useMemo(
    () => [
      { label: 'Newest first', value: 'newest' },
      { label: 'Most relevant', value: 'relevant' },
      { label: 'Salary: High to Low', value: 'salary-high' },
      { label: 'Salary: Low to High', value: 'salary-low' },
    ],
    []
  );

  // Keep parity with web: show spinner block if first load has no items
  const firstLoad = (isLoading || isFetching) && jobs.length === 0;

  const renderHeader = () => (
    <View className="flex-row items-center justify-between mb-6">
      {!isPublic && (
        <View>
          <Text className="text-xl font-semibold text-gray-900">{totalJobs} jobs found</Text>
          <Text className="text-gray-600">
            Showing {jobs.length} of {totalJobs} jobs
          </Text>
        </View>
      )}

      <View style={{ marginLeft: 'auto', width: 192 /* w-48 */ }}>
        <Select
          data={sortOptions}
          value={sortValue}
          onChange={(item) => setSortValue(item.value)}
          placeholder="Sort"
        />
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (firstLoad) {
      return (
        <View className="py-8 items-center justify-center">
          <ActivityIndicator size="small" />
          <Text className="mt-3 text-gray-600">
            {isLoading ? 'Loading jobs...' : 'Updating results...'}
          </Text>
        </View>
      );
    }

    const hasAnyFilter = !!(searchTerm || selectedCountry || selectedState || selectedCity);

    if (!isLoading && jobs.length === 0 && hasAnyFilter) {
      return (
        <View className="py-8 items-center">
          <Text className="text-gray-600">No jobs found matching your criteria.</Text>
          <Text className="text-gray-500 text-sm mt-2">
            Try adjusting your search terms or filters.
          </Text>
        </View>
      );
    }

    if (!isLoading && jobs.length === 0) {
      return (
        <View className="py-8 items-center">
          <Text className="text-gray-600">Welcome to Job Search!</Text>
          <Text className="text-gray-500 text-sm mt-2">
            Enter keywords, location, or use filters to find your dream job.
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="mb-4">
      <JobCard
        job={item}
        savedJobIds={savedJobIds}
        onApply={handleApply}
        isApplying={applyingJobId === item.id}
        onSave={handleSave}
        onViewDetails={handleViewDetails}
        isPublic={isPublic}
      />
    </View>
  );

  const listFooter = () => {
    if (isPublic) {
      return (
        <View className="items-center">
          <Button variant="default" size="lg" onPress={handleSignUpClick}>
            Sign Up
          </Button>
        </View>
      );
    }

    return (
      <View className="mt-8 items-center">
        {!isLoading && hasMore ? (
          <Button
            variant="outline"
            size="lg"
            onPress={loadMore}
            disabled={isFetching}
            loading={isFetching}
          >
            {isFetching ? 'Loading...' : 'Load More Jobs'}
          </Button>
        ) : (
          !isLoading &&
          !hasMore &&
          jobs.length > 0 && (
            <Text className="text-sm text-gray-500">No more jobs to load</Text>
          )
        )}
      </View>
    );
  };

  return (
    <View>
      {renderHeader()}

      {/* List */}
      {firstLoad ? (
        renderEmpty()
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={listFooter}
          // Keep manual "Load More" button behavior; disable infinite scroll
          // If you prefer infinite scroll, uncomment:
          // onEndReachedThreshold={0.6}
          // onEndReached={() => {
          //   if (!isPublic && hasMore && !isFetching) loadMore();
          // }}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
};

export default JobSearchResults;
