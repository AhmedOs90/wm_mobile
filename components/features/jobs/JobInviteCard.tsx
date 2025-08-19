// components/jobs/JobInviteCard.native.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import {
  MapPin,
  DollarSign,
  Clock,
  Building,
  Star,
  Heart,
  Send,
} from 'lucide-react-native';

interface JobInvite {
  id: number;
  company: string;
  companyLogo: string;
  position: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
  matchScore: number;
  postedDate: string;
  recruiterName: string;
  recruiterTitle: string;
  isInvite: boolean;
  urgency: 'low' | 'medium' | 'high';
}

interface JobInviteCardProps {
  job: JobInvite;
  onApply: (jobId: number) => void;
  onSave: (jobId: number) => void;
  onMessage: (jobId: number) => void;
}

const urgencyStyles = {
  high:  { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },   // red-100/800/200
  medium:{ bg: '#fef3c7', text: '#92400e', border: '#fde68a' },   // amber-100/800/200
  low:   { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },   // green-100/800/200
  default:{ bg: '#f3f4f6', text: '#1f2937', border: '#e5e7eb' },  // gray-100/800/200
} as const;

const matchStylesFor = (score: number) => {
  if (score >= 90) return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' }; // green-50/600/200
  if (score >= 80) return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' }; // blue-50/600/200
  if (score >= 70) return { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' }; // orange-50/600/200
  return { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb' };                   // gray-50/600/200
};

export const JobInviteCard: React.FC<JobInviteCardProps> = ({
  job,
  onApply,
  onSave,
  onMessage,
}) => {
  const u = urgencyStyles[job.urgency] ?? urgencyStyles.default;
  const m = matchStylesFor(job.matchScore);

  const initials =
    job.recruiterName?.trim()
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '?';

  return (
    <Card className="relative overflow-hidden border-l-4">
      {/* Left border "primary" accent via className; if you want exact color, add style={{borderLeftColor: '#2563eb'}} */}
      {job.isInvite && (
        <View className="absolute top-2 right-2">
          <Badge variant="secondary" style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}>
            <View className="flex-row items-center">
              <Star size={12} style={{ marginRight: 4 }} />
              <Text style={{ color: '#fff', fontWeight: '600' }}>Invited</Text>
            </View>
          </Badge>
        </View>
      )}

      <CardHeader className="pb-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-3">
            <Avatar uri={job.companyLogo} fallbackText={<Building size={20} /> as any} size={48} />
            <View>
              <CardTitle className="text-lg">{job.position}</CardTitle>
              <CardDescription className="font-medium">{job.company}</CardDescription>
            </View>
          </View>

          <View className="items-end gap-2">
            <Badge
              variant="outline"
              style={{ backgroundColor: m.bg, borderColor: m.border }}
            >
              <Text style={{ color: m.text, fontWeight: '600' }}>{job.matchScore}% match</Text>
            </Badge>
            <Badge
              variant="outline"
              style={{ backgroundColor: u.bg, borderColor: u.border }}
            >
              <Text style={{ color: u.text, fontWeight: '600' }}>{job.urgency} priority</Text>
            </Badge>
          </View>
        </View>
      </CardHeader>

      <CardContent className="gap-4">
        {/* Top facts */}
        <View className="flex-row flex-wrap gap-4">
          <View className="flex-row items-center gap-2">
            <MapPin size={16} />
            <Text>{job.location}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <DollarSign size={16} />
            <Text style={{ fontWeight: '600', color: '#16a34a' }}>{job.salary}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Building size={16} />
            <Text>{job.type}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Clock size={16} />
            <Text>{job.postedDate}</Text>
          </View>
        </View>

        {/* Description */}
        <View className="gap-2">
          <Text className="font-medium text-sm">Job Description</Text>
          <Text
            className="text-sm text-muted-foreground"
            numberOfLines={3} // line-clamp-3 equivalent
          >
            {job.description}
          </Text>
        </View>

        {/* Requirements */}
        <View className="gap-2">
          <Text className="font-medium text-sm">Key Requirements</Text>
          <View className="flex-row flex-wrap gap-2">
            {job.requirements.slice(0, 4).map((req, idx) => (
              <Badge key={idx} variant="secondary" style={{ paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ fontSize: 12, fontWeight: '600' }}>{req}</Text>
              </Badge>
            ))}
            {job.requirements.length > 4 && (
              <Badge variant="secondary" style={{ paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ fontSize: 12, fontWeight: '600' }}>
                  +{job.requirements.length - 4} more
                </Text>
              </Badge>
            )}
          </View>
        </View>

        {/* Benefits */}
        <View className="gap-2">
          <Text className="font-medium text-sm">Benefits</Text>
          <View className="flex-row flex-wrap gap-2">
            {job.benefits.slice(0, 3).map((b, idx) => (
              <Badge key={idx} variant="outline" style={{ paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ fontSize: 12, fontWeight: '600' }}>{b}</Text>
              </Badge>
            ))}
            {job.benefits.length > 3 && (
              <Badge variant="outline" style={{ paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ fontSize: 12, fontWeight: '600' }}>
                  +{job.benefits.length - 3} more
                </Text>
              </Badge>
            )}
          </View>
        </View>

        {/* Invite blurb */}
        {job.isInvite && (
          <View className="p-3 border rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
            <View className="flex-row items-center gap-2 mb-2">
              <Avatar size={24} fallbackText={initials} />
              <View>
                <Text className="text-xs font-medium">{job.recruiterName}</Text>
                <Text className="text-xs text-muted-foreground">{job.recruiterTitle}</Text>
              </View>
            </View>
            <Text className="text-xs text-muted-foreground">
              "We think you'd be a great fit for this role. Would you like to discuss this opportunity?"
            </Text>
          </View>
        )}

        {/* Actions */}
        <View className="flex-row gap-2 pt-2">
          <Button onPress={() => onApply(job.id)} style={{ flex: 1 }}>
            {job.isInvite ? 'Accept Invitation' : 'Apply Now'}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onPress={() => onSave(job.id)}
            iconLeft={<Heart size={16} />}
          />

          {job.isInvite && (
            <Button
              variant="outline"
              size="icon"
              onPress={() => onMessage(job.id)}
              iconLeft={<Send size={16} />}
            />
          )}
        </View>
      </CardContent>
    </Card>
  );
};

export default JobInviteCard;
