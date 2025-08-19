// screens/JobDetailsView.native.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import JobHeader from './job-details/JobHeader';            // RN version
import JobDescription from './job-details/JobDescription';  // RN version you shared
import JobRequirements from './job-details/JobRequirements';// RN version
import JobSkills from './job-details/JobSkills';            // RN version
import JobSidebar from './job-details/JobSidebar';          // RN version
import { candidateJobsControllerGetJobDetails } from '@/wm-api/sdk.gen';
import { useApplyToJob } from '@/hooks/useApplyToJob';

interface JobDetailsViewProps {
  jobId: string;
}

export const JobDetailsView: React.FC<JobDetailsViewProps> = ({ jobId }) => {
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const { mutate: applyToJob } = useApplyToJob();

  const navigation = useNavigation();
  const { toast } = useToast();

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { width } = useWindowDimensions();
  const isWide = width >= 1024; // crude "lg" breakpoint to mimic grid layout

  const handleApply = useCallback(
    (id: string) => {
      setApplyingJobId(id);
      applyToJob(id, {
        onSettled: () => setApplyingJobId(null),
      });
    },
    [applyToJob]
  );

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['job-details', jobId],
    queryFn: async () => {
      const res = await candidateJobsControllerGetJobDetails({ path: { jobId } });
      return res.data?.data ?? null;
    },
    enabled: !!jobId,
  });

  const handleSave = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      const next = !isSaved;
      setIsSaved(next);
      toast({
        title: next ? 'Job saved successfully!' : 'Job removed from favorites',
        description: next
          ? 'You can view your saved jobs in your profile.'
          : 'Job has been removed from your favorites',
        variant: next ? 'default' : 'destructive',
      });
      setIsSaving(false);
    }, 500);
  }, [isSaved, toast]);

  // Loading State
  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="small" />
        <Text className="mt-3 text-lg text-gray-600">Loading job details...</Text>
      </View>
    );
    }

  // Error State
  if (isError) {
    return (
      <View className="py-20 items-center">
        <Text className="text-lg font-semibold text-red-600">Failed to load job details</Text>
        <Text className="text-gray-600 mt-2">{(error as Error)?.message ?? 'Unknown error'}</Text>
        <Button
          variant="outline"
          style={{ marginTop: 16 }}
          onPress={() => {
            // go back to Jobs (or simply goBack if that’s safer)
            // @ts-ignore
            navigation.goBack();
          }}
          iconLeft={<ArrowLeft size={16} />}
        >
          Back to Job Search
        </Button>
      </View>
    );
  }

  return (
    <View className="py-6 h-full flex-1">
      {/* Back button section */}
      <View className="px-3">
        <View className="flex-row items-center gap-4 mb-4 max-w-screen-lg self-center w-full">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              // @ts-ignore
              navigation.goBack();
            }}
            iconLeft={<ArrowLeft size={16} />}
          >
            Back to Jobs
          </Button>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ alignItems: 'center' }}>
        <View
          className="w-full"
          style={{
            maxWidth: 1024, // mimic max-w-6xl
            flexDirection: isWide ? 'row' : 'column',
            gap: 24,
          }}
        >
          {/* Main content */}
          <View style={{ flex: isWide ? 2 : 0, width: isWide ? undefined : '100%' }}>
            <View className="gap-6">
              <JobHeader
                isSaved={isSaved}
                handleSave={async () => handleSave()}
                isSaving={isSaving}
                job={job}
              />
              {job && <JobDescription job={job} />}
              {job && <JobRequirements job={job} />}
              {job && <JobSkills job={job} />}
            </View>
          </View>

          {/* Sidebar */}
          <View style={{ flex: isWide ? 1 : 0, width: isWide ? undefined : '100%' }}>
            <JobSidebar
              job={job}
              onApply={handleApply}
              isApplying={applyingJobId === jobId}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default JobDetailsView;
