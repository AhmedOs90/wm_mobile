import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/mockSupabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { ModalDialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Plus,
  Eye,
  Clock,
  CheckCircle
} from 'lucide-react-native';

const PollsEventsManager = () => {
  const [pollTitle, setPollTitle] = useState<string>('');
  const [pollDescription, setPollDescription] = useState<string>('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [pollAudience, setPollAudience] = useState<string>('all');
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventType, setEventType] = useState<string>('webinar');
  const [eventDate, setEventDate] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch polls
  const { data: polls } = useQuery({
    queryKey: ['polls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch events
  const { data: events } = useQuery({
    queryKey: ['community-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_events')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch event registrations
  const { data: registrations } = useQuery({
    queryKey: ['event-registrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  // Create poll mutation
  const createPollMutation = useMutation({
    mutationFn: async (pollData: {
      title: string;
      description: string;
      options: any[];
      target_audience: string;
    }) => {
      const { data, error } = await supabase
        .from('polls')
        .insert({
          ...pollData,
          created_by: 'admin', // Replace with actual admin ID
          ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Poll Created",
        description: "Poll has been created successfully."
      });
      setPollTitle('');
      setPollDescription('');
      setPollOptions(['', '']);
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    }
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: {
      title: string;
      description: string;
      event_type: string;
      start_date: string;
    }) => {
      const { data, error } = await supabase
        .from('community_events')
        .insert({
          ...eventData,
          created_by: 'admin', // Replace with actual admin ID
          location: 'virtual'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Event Created",
        description: "Community event has been created successfully."
      });
      setEventTitle('');
      setEventDescription('');
      setEventDate('');
      queryClient.invalidateQueries({ queryKey: ['community-events'] });
    }
  });

  // End poll
  const endPoll = async (pollId: string) => {
    const { error } = await supabase
      .from('polls')
      .update({ status: 'ended' })
      .eq('id', pollId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to end poll.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Poll Ended",
        description: "Poll has been ended successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    }
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const updatePollOption = (index: number, value: string) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const updatedOptions = pollOptions.filter((_, i) => i !== index);
      setPollOptions(updatedOptions);
    }
  };

  const getEventRegistrationCount = (eventId: string) => {
    return registrations?.filter(r => r.event_id === eventId).length || 0;
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ gap: 24, padding: 16 }}>
        {/* Overview Cards */}
        <View style={{ gap: 16 }}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Active Polls</CardTitle>
              <BarChart3 size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
                {polls?.filter(p => p.status === 'active').length || 0}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                Total: {polls?.length || 0}
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Upcoming Events</CardTitle>
              <Calendar size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
                {events?.filter(e => new Date(e.start_date) > new Date()).length || 0}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                Total events: {events?.length || 0}
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Total Votes</CardTitle>
              <CheckCircle size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
                {polls?.reduce((sum, poll) => sum + (poll.total_votes || 0), 0) || 0}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Across all polls</Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Event Registrations</CardTitle>
              <Users size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{registrations?.length || 0}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Total registrations</Text>
            </CardContent>
          </Card>
        </View>

        <Tabs
          tabs={['Polls & Surveys', 'Community Events']}
          initialTab={0}
          tabContent={(activeIndex) => {
            if (activeIndex === 0) {
              // POLLS & SURVEYS
              return (
                <Card>
                  <CardHeader>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <CardTitle>Poll Creation & Management</CardTitle>
                      <ModalDialog
                        title="Create New Poll"
                        trigger={
                          <Button>
                            <Plus size={16} />
                            Create Poll
                          </Button>
                        }
                      >
                        <View style={{ gap: 16 }}>
                          <View>
                            <Label>Poll Title</Label>
                            <Input
                              value={pollTitle}
                              onChangeText={setPollTitle}
                              placeholder="Enter poll title"
                            />
                          </View>
                          <View>
                            <Label>Description</Label>
                            <Textarea
                              value={pollDescription}
                              onChangeText={setPollDescription}
                              placeholder="Enter poll description"
                            />
                          </View>
                          <View>
                            <Label>Poll Options</Label>
                            <View style={{ gap: 8 }}>
                              {pollOptions.map((option, index) => (
                                <View key={index} style={{ flexDirection: 'row', gap: 8 }}>
                                  <View style={{ flex: 1 }}>
                                    <Input
                                      value={option}
                                      onChangeText={(text) => updatePollOption(index, text)}
                                      placeholder={`Option ${index + 1}`}
                                    />
                                  </View>
                                  {pollOptions.length > 2 && (
                                    <Button
                                      variant="outline"
                                      onPress={() => removePollOption(index)}
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </View>
                              ))}
                            </View>
                            <Button
                              variant="outline"
                              onPress={addPollOption}
                              style={{ marginTop: 8 }}
                            >
                              Add Option
                            </Button>
                          </View>
                          <View>
                            <Label>Target Audience</Label>
                            <Select 
                              value={pollAudience} 
                              onValueChange={setPollAudience}
                              options={[
                                { label: 'All Users', value: 'all' },
                                { label: 'Only Candidates', value: 'candidates' },
                                { label: 'Only Employers', value: 'employers' }
                              ]}
                            />
                          </View>
                          <Button
                            onPress={() => createPollMutation.mutate({
                              title: pollTitle,
                              description: pollDescription,
                              options: pollOptions.filter(opt => opt.trim()).map((option, index) => ({
                                option,
                                votes: 0,
                                index
                              })),
                              target_audience: pollAudience
                            })}
                            disabled={!pollTitle || pollOptions.filter(opt => opt.trim()).length < 2 || createPollMutation.isPending}
                          >
                            Create Poll
                          </Button>
                        </View>
                      </ModalDialog>
                    </View>
                  </CardHeader>
                  <CardContent>
                    <View style={{ gap: 16 }}>
                      {polls?.map((poll) => (
                        <View 
                          key={poll.id} 
                          style={{ 
                            padding: 16, 
                            borderWidth: 1, 
                            borderColor: '#e5e7eb', 
                            borderRadius: 8 
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontWeight: '500' }}>{poll.title}</Text>
                              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                                {poll.description}
                              </Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>
                                  {poll.status}
                                </Badge>
                                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                                  {poll.total_votes || 0} votes • {poll.target_audience}
                                </Text>
                              </View>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                              <Button
                                variant="outline"
                                onPress={() => endPoll(poll.id)}
                                disabled={poll.status !== 'active'}
                                iconLeft={<Clock size={16} color="#111827" />}
                              >
                                End Poll
                              </Button>
                              <Button 
                                variant="outline"
                                iconLeft={<Eye size={16} color="#111827" />}
                              >
                                View Results
                              </Button>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              );
            }

            if (activeIndex === 1) {
              // COMMUNITY EVENTS
              return (
                <Card>
                  <CardHeader>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <CardTitle>Community Events</CardTitle>
                      <ModalDialog
                        title="Create Community Event"
                        trigger={
                          <Button>
                            <Plus size={16} />
                            Create Event
                          </Button>
                        }
                      >
                        <View style={{ gap: 16 }}>
                          <View>
                            <Label>Event Title</Label>
                            <Input
                              value={eventTitle}
                              onChangeText={setEventTitle}
                              placeholder="Enter event title"
                            />
                          </View>
                          <View>
                            <Label>Description</Label>
                            <Textarea
                              value={eventDescription}
                              onChangeText={setEventDescription}
                              placeholder="Enter event description"
                            />
                          </View>
                          <View>
                            <Label>Event Type</Label>
                            <Select 
                              value={eventType} 
                              onValueChange={setEventType}
                              options={[
                                { label: 'Virtual Job Fair', value: 'job_fair' },
                                { label: 'Webinar', value: 'webinar' },
                                { label: 'AMA Session', value: 'ama' },
                                { label: 'Workshop', value: 'workshop' }
                              ]}
                            />
                          </View>
                          <View>
                            <Label>Start Date & Time</Label>
                            <Input
                              value={eventDate}
                              onChangeText={setEventDate}
                              placeholder="YYYY-MM-DDTHH:MM"
                            />
                          </View>
                          <Button
                            onPress={() => createEventMutation.mutate({
                              title: eventTitle,
                              description: eventDescription,
                              event_type: eventType,
                              start_date: new Date(eventDate).toISOString()
                            })}
                            disabled={!eventTitle || !eventDate || createEventMutation.isPending}
                          >
                            Create Event
                          </Button>
                        </View>
                      </ModalDialog>
                    </View>
                  </CardHeader>
                  <CardContent>
                    <View style={{ gap: 16 }}>
                      {events?.map((event) => (
                        <View 
                          key={event.id} 
                          style={{ 
                            padding: 16, 
                            borderWidth: 1, 
                            borderColor: '#e5e7eb', 
                            borderRadius: 8 
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontWeight: '500' }}>{event.title}</Text>
                              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                                {event.description}
                              </Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                <Badge variant="outline">{event.event_type}</Badge>
                                <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                                  {event.status}
                                </Badge>
                                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                                  {getEventRegistrationCount(event.id)} registered
                                </Text>
                              </View>
                              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                                {new Date(event.start_date).toLocaleString()}
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                              <Button 
                                variant="outline"
                                iconLeft={<Users size={16} color="#111827" />}
                              >
                                View RSVPs
                              </Button>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              );
            }

            return null;
          }}
        />
      </View>
    </ScrollView>
  );
};

export default PollsEventsManager;
