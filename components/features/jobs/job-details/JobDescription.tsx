// JobDescription.native.tsx
import React from 'react';
import { Text, useWindowDimensions } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import RenderHTML from 'react-native-render-html';
import type { Job } from '@/wm-api/types.gen';

const sanitizeHtml = (html: string) =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');

const JobDescription = ({ job }: { job: Job }) => {
  const description = job?.description?.trim();
  const { width } = useWindowDimensions();

  if (!description) return null;

  return (
    <Card>
      <CardContent>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
          Job Description
        </Text>

        <RenderHTML
          contentWidth={width}
          source={{ html: sanitizeHtml(description) }}
          defaultTextProps={{ selectable: true }}
          baseStyle={{ fontSize: 14, lineHeight: 20, color: '#111827' }}
          tagsStyles={{
            h1: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
            h2: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 6 },
            h3: { fontSize: 16, fontWeight: '700', marginTop: 10, marginBottom: 4 },
            p: { marginBottom: 8 },
            li: { marginBottom: 4 },
            a: { color: '#2563eb' },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default JobDescription;
