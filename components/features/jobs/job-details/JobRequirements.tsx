// components/jobs/JobRequirements.tsx
import React from 'react';
import { Text, useWindowDimensions } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import RenderHTML from 'react-native-render-html';

interface JobRequirementsProps {
  job: {
    requirements?: string | null;
  };
}

const JobRequirements: React.FC<JobRequirementsProps> = ({ job }) => {
  const requirements = job?.requirements?.trim();
  const { width } = useWindowDimensions();

  if (!requirements) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <Text className="text-lg font-semibold mb-4">Requirements</Text>

        {/* Render HTML safely */}
        <RenderHTML
          contentWidth={width}
          source={{ html: requirements }}
          tagsStyles={{
            p: { fontSize: 14, lineHeight: 20, color: '#374151' },
            li: { fontSize: 14, lineHeight: 20, color: '#374151' },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default JobRequirements;
