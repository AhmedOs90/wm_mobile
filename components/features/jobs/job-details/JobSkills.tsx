// components/jobs/JobSkills.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Job, JobSkill } from '@/wm-api/types.gen.ts';

const JobSkills = ({ job }: { job: Job }) => {
  const skills = job?.jobSkills ?? [];
  if (!skills.length) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Text className="text-lg font-semibold mb-4">Required Skills</Text>
        <View className="flex-row flex-wrap gap-2">
          {skills.map((skill: JobSkill, index: number) => (
            <Badge key={index} variant="outline">
              {skill.skill?.jobSkill}
            </Badge>
          ))}
        </View>
      </CardContent>
    </Card>
  );
};

export default JobSkills;
