// components/jobs/JobSidebar.tsx
import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Button from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import RenderHTML from 'react-native-render-html';

interface JobSidebarProps {
  onApply: (jobId: string) => void;
  isApplying: boolean;
  job: any; // TODO: replace with your Job type
}

const JobSidebar: React.FC<JobSidebarProps> = ({ onApply, isApplying, job }) => {
  const companyProfile = job?.employer?.employer_profile;
  const { width } = useWindowDimensions();

  return (
    <View className="gap-6">
      {/* Company Info */}
      {!!companyProfile && (
        <Card>
          <CardContent className="p-6">
            <Text className="font-semibold mb-4">About the Company</Text>

            <View className="gap-3">
              {!!companyProfile.companyName && (
                <View>
                  <Text className="font-medium">{companyProfile.companyName}</Text>

                  {!!companyProfile.description && (
                    <View className="mt-1">
                      <RenderHTML
                        contentWidth={width}
                        source={{ html: companyProfile.description }}
                        tagsStyles={{
                          p: { fontSize: 14, lineHeight: 20, color: '#6b7280' }, // text-muted-foreground-ish
                          li: { fontSize: 14, lineHeight: 20, color: '#6b7280' },
                        }}
                      />
                    </View>
                  )}
                </View>
              )}

              <Separator />

              <View className="gap-2">
                {!!job?.category?.categoryName && (
                  <Row label="Industry" value={job.category.categoryName} />
                )}

                {!!companyProfile.noOfEmployees && (
                  <Row
                    label="Company Size:"
                    value={`${companyProfile.noOfEmployees} employees`}
                  />
                )}

                {!!companyProfile.year && (
                  <Row label="Founded:" value={companyProfile.year} />
                )}
              </View>
            </View>
          </CardContent>
        </Card>
      )}

      {/* Job Summary */}
      <Card>
        <CardContent className="p-6">
          <Text className="font-semibold mb-4">Job Summary</Text>

          <View className="gap-3">
            {!!job?.jobType?.jobType && (
              <Row label="Job Type:" value={job.jobType.jobType} />
            )}
            {!!job?.jobExperience?.jobExperience && (
              <Row label="Experience:" value={job.jobExperience.jobExperience} />
            )}
            {!!job?.location && <Row label="Location:" value={job.location} />}
            {!!job?.jobWorkplace && <Row label="Work Type:" value={job.jobWorkplace} />}
            {!!job?.functionalAreas?.[0]?.functionalArea?.functionalArea && (
              <Row
                label="Department:"
                value={job.functionalAreas[0].functionalArea.functionalArea}
              />
            )}
          </View>
        </CardContent>
      </Card>

      {/* Action Button */}
      {/* Note: "sticky" isn't supported in RN. If you need a persistent CTA,
         render a fixed footer in the parent screen. */}
      <Card>
        <CardContent className="p-6">
          <Button
            size="lg"
            style={{ width: '100%' }}
            onPress={() => onApply(job.id)}
            disabled={isApplying}
            loading={isApplying}
          >
            {isApplying ? 'Applying...' : 'Apply for this Position'}
          </Button>
        </CardContent>
      </Card>
    </View>
  );
};

export default JobSidebar;

/** Helper row component */
const Row = ({ label, value }: { label: string; value: string | number }) => (
  <View className="flex-row justify-between">
    <Text className="text-muted-foreground">{label}</Text>
    <Text>{String(value)}</Text>
  </View>
);
