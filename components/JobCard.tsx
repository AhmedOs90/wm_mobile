// components/jobs/JobCard.native.tsx
import React, { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  MapPin,
  Briefcase,
  Clock,
  Heart,
  Building2,
  DollarSign,
} from 'lucide-react-native';
import type { JobsControllerGetJobsResponse } from '@/wm-api/types.gen';
import { useAuth } from '@/hooks/useAuth';
import { candidateJobsControllerFindAll } from '@/wm-api/sdk.gen';
import { useQuery } from '@tanstack/react-query';

interface JobCardProps {
  job: NonNullable<JobsControllerGetJobsResponse['data']>[0];
  onApply: (jobId: string) => void;
  isApplying: boolean;
  onSave: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
  savedJobIds: string[];
  isPublic: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

const stripHtml = (html: string) => html?.replace(/<[^>]+>/g, '') || '';

const JobCard = memo(
  ({
    job,
    onApply,
    isApplying,
    onSave,
    onViewDetails,
    savedJobIds,
    isPublic,
  }: JobCardProps) => {
    const isSaved = useMemo(
      () => savedJobIds.includes(job.id),
      [savedJobIds, job.id]
    );

    const { toast } = useToast();
    const { user } = useAuth();

    const { data: appliedJobs } = useQuery({
      queryKey: ['appliedJobs'],
      queryFn: async () => {
        const response = await candidateJobsControllerFindAll({
          query: { page: 1, limit: 100 },
        });
        return response.data?.data ?? [];
      },
    });

    const isApplied =
      !!appliedJobs?.filter(
        (app: any) => app.jobId === job.id && app.candidateId === user?.id
      )?.length;

    const companyName =
      job?.employer?.employer_profile?.companyName ?? 'Company';
    const companyLogo = job?.employer?.employer_profile?.companyLogo;

    const getCompanyInitials = (name: string) =>
      name
        .split(' ')
        .map((word) => word.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleSaveJob = (jobId: string) => {
      onSave(jobId);
    };

    return (
      <Card className="transition-shadow">
        <CardContent className="p-6">
          {/* Top Row */}
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-row items-start gap-4 flex-1">
              {/* Avatar */}
              <Avatar
                uri={companyLogo}
                fallbackText={getCompanyInitials(companyName)}
                size={64} // 16 * 4
              />

              {/* Title + meta */}
              <View style={{ flex: 1 }}>
                <Text className="text-xl font-semibold text-gray-900 mb-1">
                  {job?.title}
                </Text>

                <View className="flex-row flex-wrap items-center gap-4 text-gray-600 mb-2">
                  <View className="flex-row items-center">
                    <Building2 size={16} />
                    <Text className="ml-1">{companyName}</Text>
                  </View>

                  <View className="flex-row items-center">
                    <MapPin size={16} />
                    <Text className="ml-1">{job?.location}</Text>
                  </View>

                  <View className="flex-row items-center">
                    <Briefcase size={16} />
                    <Text className="ml-1">{job?.jobType?.jobType}</Text>
                  </View>

                  <View className="flex-row items-center">
                    <Clock size={16} />
                    <Text className="ml-1">
                      {job?.createdAt ? formatDate(job.createdAt) : 'Recently posted'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2 mb-3">
                  <View className="flex-row items-center">
                    <DollarSign size={16} />
                    <Text className="ml-1" style={{ color: '#16a34a', fontWeight: '600' }}>
                      {job?.salary}
                    </Text>
                  </View>

                  {!!job?.location && (
                    <Badge variant="secondary">
                      <Text>{job?.location ?? 'remote'}</Text>
                    </Badge>
                  )}
                </View>
              </View>
            </View>

            {/* Save */}
            {!isPublic && (
              <Button
                variant="ghost"
                size="sm"
                onPress={() => handleSaveJob(job.id)}
                iconLeft={
                  <Heart
                    size={16}
                    // @ts-ignore allow fill
                    fill={isSaved ? 'red' : 'transparent'}
                  />
                }
              >
                {/* no label needed, icon-only */}
              </Button>
            )}
          </View>

          {/* Description (truncated) */}
          <Text
            className="text-gray-600 mb-4"
            numberOfLines={3} // "truncate" equivalent—adjust as needed
          >
            {stripHtml(job?.description ?? '')}
          </Text>

          {/* Skills */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {job?.jobSkills?.map((skill: any) => (
              <Badge
                key={skill?.skill?.jobSkill}
                variant="secondary"
                style={{ paddingHorizontal: 12, paddingVertical: 4 }}
              >
                <Text className="text-sm font-normal">
                  {skill?.skill?.jobSkill}
                </Text>
              </Badge>
            ))}
          </View>

          {/* Actions */}
          <View className="flex-row gap-3">
            <Button
              variant="secondary"
              style={{ width: 128 }}
              onPress={() => onApply(job.id)}
              disabled={isApplying || isApplied}
            >
              {isApplying ? 'Applying...' : isApplied ? 'Applied' : 'Apply'}
            </Button>

            <Button
              variant="outline"
              style={{ width: 128 }}
              onPress={() => onViewDetails(job.id)}
            >
              View Details
            </Button>
          </View>
        </CardContent>
      </Card>
    );
  }
);

JobCard.displayName = 'JobCard';

export default JobCard;
