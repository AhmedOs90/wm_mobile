// components/interviews/InterviewScheduler.native.tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Check,
  X,
  Building,
  User,
} from 'lucide-react-native';

interface InterviewInvitation {
  id: number;
  company: string;
  position: string;
  contact: string;
  type: 'video' | 'in-person';
  duration: string;
  description: string;
  proposedSlots: Array<{
    date: string;     // ISO date string
    time: string;     // "10:00 AM" etc.
    timezone: string; // "GMT+2", "PST", etc.
  }>;
  deadline: string;   // ISO date string
  status: 'pending' | 'accepted' | 'declined';
}

interface InterviewSchedulerProps {
  invitation: InterviewInvitation;
  onAccept: (slotIndex: number, message?: string) => void;
  onDecline: (reason?: string) => void;
}

const formatLongDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const statusVariant = (s: InterviewInvitation['status']) =>
  s === 'pending' ? 'secondary' : s === 'accepted' ? 'default' : 'destructive';

export const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({
  invitation,
  onAccept,
  onDecline,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null); // store as string index (RadioGroup API)
  const [response, setResponse] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineForm, setShowDeclineForm] = useState(false);

  const handleAccept = () => {
    if (selectedSlot !== null) {
      onAccept(parseInt(selectedSlot, 10), response);
    }
  };

  const handleDecline = () => {
    onDecline(declineReason);
    setShowDeclineForm(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <View className="flex-row items-start justify-between">
          <View className="gap-2">
            <CardTitle>
              <View className="flex-row items-center gap-2">
                <Building size={20} />
                <Text>Interview Invitation</Text>
              </View>
            </CardTitle>
            <CardDescription>
              {invitation.company} • {invitation.position}
            </CardDescription>
          </View>

          <Badge variant={statusVariant(invitation.status)}>
            {invitation.status}
          </Badge>
        </View>
      </CardHeader>

      <CardContent className="gap-6">
        {/* Meta */}
        <View className="gap-4">
          <View className="flex-row items-center gap-3">
            <User size={16} />
            <Text className="text-sm">Contact: {invitation.contact}</Text>
          </View>

          <View className="flex-row items-center gap-3">
            {invitation.type === 'video' ? (
              <Video size={16} />
            ) : (
              <MapPin size={16} />
            )}
            <Text className="text-sm">
              {invitation.type === 'video' ? 'Video Interview' : 'In-Person Interview'}
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <Clock size={16} />
            <Text className="text-sm">Duration: {invitation.duration}</Text>
          </View>
        </View>

        {/* Details */}
        <View className="gap-2">
          <Text className="font-medium">Interview Details</Text>
          <Text className="text-sm text-gray-600">{invitation.description}</Text>
        </View>

        {/* Pending actions */}
        {invitation.status === 'pending' && (
          <>
            {/* Slots */}
            <View className="gap-4">
              <Text className="font-medium">Available Time Slots</Text>

              <RadioGroup
                value={selectedSlot ?? ''}
                onValueChange={setSelectedSlot}
                options={invitation.proposedSlots.map((slot, index) => ({
                  value: String(index),
                  label: (
                    <View className="flex-1 p-3 border rounded-lg flex-row items-center justify-between">
                      <View>
                        <Text className="font-medium">
                          {formatLongDate(slot.date)}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {slot.time} ({slot.timezone})
                        </Text>
                      </View>
                      <CalendarIcon size={16} />
                    </View>
                  ),
                }))}
                style={{ gap: 12 }}
                itemStyle={{ paddingVertical: 4 }}
              />
            </View>

            {/* Message to employer */}
            <View className="gap-2">
              <Label>Message to Employer (Optional)</Label>
              <Textarea
                placeholder="Add any questions or additional information..."
                value={response}
                onChangeText={setResponse}
                style={{ minHeight: 80 }}
              />
            </View>

            {/* Accept / Decline */}
            {!showDeclineForm ? (
              <View className="flex-row gap-4">
                <Button
                  onPress={handleAccept}
                  disabled={selectedSlot === null || selectedSlot === ''}
                  style={{ flex: 1 }}
                  iconLeft={<Check size={16} />}
                >
                  Accept Interview
                </Button>

                <Button
                  variant="outline"
                  onPress={() => setShowDeclineForm(true)}
                  style={{ flex: 1 }}
                  iconLeft={<X size={16} />}
                >
                  Decline
                </Button>
              </View>
            ) : (
              <View className="gap-4 p-4 border rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                <Text className="font-medium" style={{ color: '#DC2626' }}>
                  Decline Interview
                </Text>

                <View className="gap-2">
                  <Label>Reason (Optional)</Label>
                  <Textarea
                    placeholder="Let the employer know why you're declining..."
                    value={declineReason}
                    onChangeText={setDeclineReason}
                    style={{ minHeight: 60 }}
                  />
                </View>

                <View className="flex-row gap-2">
                  <Button variant="destructive" onPress={handleDecline} size="sm">
                    Confirm Decline
                  </Button>
                  <Button variant="outline" onPress={() => setShowDeclineForm(false)} size="sm">
                    Cancel
                  </Button>
                </View>
              </View>
            )}

            <Text className="text-xs text-gray-500 text-center">
              Please respond by {new Date(invitation.deadline).toLocaleDateString()}
            </Text>
          </>
        )}

        {/* Accepted */}
        {invitation.status === 'accepted' && (
          <View className="p-4 border rounded-lg" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
            <View className="flex-row items-center gap-2">
              <Check size={16} />
              <Text className="font-medium">Interview Confirmed</Text>
            </View>
            <Text className="text-sm" style={{ marginTop: 4 }}>
              Calendar invitation has been sent to your email.
            </Text>
          </View>
        )}

        {/* Declined */}
        {invitation.status === 'declined' && (
          <View className="p-4 border rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
            <View className="flex-row items-center gap-2">
              <X size={16} />
              <Text className="font-medium">Interview Declined</Text>
            </View>
            <Text className="text-sm" style={{ marginTop: 4 }}>
              The employer has been notified of your decision.
            </Text>
          </View>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewScheduler;
