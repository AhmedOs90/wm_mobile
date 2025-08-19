// components/jobs/JobHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import Button from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Bookmark,
} from 'lucide-react-native';

interface JobHeaderProps {
  isSaved: boolean;
  handleSave: () => Promise<void>;
  isSaving: boolean;
  job: any; // replace with your Job type if available
}

const JobHeader: React.FC<JobHeaderProps> = ({
  isSaved,
  handleSave,
  isSaving,
  job,
}) => {
  const hasLocation =
    !!job?.city?.city && !!job?.state?.state && !!job?.country?.country;

  const hasSalary =
    job?.salaryFrom != null &&
    job?.salaryTo != null &&
    !!job?.salaryCurrency?.name;

  return (
    <Card>
      <CardContent className="p-6">
        {/* Top Section */}
        <View className="flex flex-col gap-4 mb-4">
          <View className="flex-row justify-between gap-4">
            {/* Title + meta */}
            <View style={{ flex: 1 }}>
              <Text className="text-2xl font-bold text-foreground mb-2">
                {job?.title ?? ''}
              </Text>

              {/* Meta Info */}
              <View className="flex flex-row flex-wrap items-center gap-4">
                {!!job?.companyName && (
                  <View className="flex-row items-center gap-1">
                    <Building2 size={16} />
                    <Text>{job.companyName}</Text>
                  </View>
                )}

                {hasLocation && (
                  <View className="flex-row items-center gap-1">
                    <MapPin size={16} />
                    <Text>
                      {job.city.city}, {job.state.state}, {job.country.country}
                    </Text>
                  </View>
                )}

                {!!job?.createdAt && (
                  <View className="flex-row items-center gap-1">
                    <Calendar size={16} />
                    <Text>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Save Button */}
            <View className="flex-row items-start">
              <Button
                variant={isSaved ? 'default' : 'outline'}
                size="sm"
                onPress={handleSave}
                disabled={isSaving}
                loading={isSaving}
                iconLeft={
                  <Bookmark
                    size={16}
                    // Fill the bookmark when saved
                    // lucide uses stroke by default; fill only shows on shapes that support it
                    // this still gives the "filled" look with stroke width
                    // If you want a true fill, wrap with a container circle or swap icon
                    // but this matches your web intent closely.
                    // @ts-ignore - allow fill prop
                    fill={isSaved ? 'currentColor' : 'transparent'}
                  />
                }
              >
                {isSaved ? 'Saved' : 'Save Job'}
              </Button>
            </View>
          </View>
        </View>

        {/* Job Tags */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          {!!job?.jobType?.jobType && (
            <Badge variant="secondary">{job.jobType.jobType}</Badge>
          )}
          {!!job?.jobWorkplace && (
            <Badge variant="outline">{job.jobWorkplace}</Badge>
          )}
          {!!job?.careerLevel?.careerLevel && (
            <Badge variant="outline">{job.careerLevel.careerLevel}</Badge>
          )}
        </View>

        {/* Job Stats */}
        <View className="flex-row flex-wrap items-center gap-6">
          {hasSalary && (
            <View className="flex-row items-center gap-1">
              <DollarSign size={16} />
              <Text>
                {Number(job.salaryFrom).toLocaleString()} -{' '}
                {Number(job.salaryTo).toLocaleString()} {job.salaryCurrency.name}
              </Text>
            </View>
          )}

          <View className="flex-row items-center gap-1">
            <Users size={16} />
            <Text>{Math.floor(Math.random() * 50) + 10} applicants</Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default JobHeader;
