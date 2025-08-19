import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/mockSupabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Plus,
  Eye,
  Clock,
  CheckCircle
} from 'lucide-react';

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
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {polls?.filter(p => p.status === 'active').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {polls?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events?.filter(e => new Date(e.start_date) > new Date()).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total events: {events?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {polls?.reduce((sum, poll) => sum + (poll.total_votes || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Across all polls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total registrations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="polls" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="polls">Polls & Surveys</TabsTrigger>
          <TabsTrigger value="events">Community Events</TabsTrigger>
        </TabsList>

        <TabsContent value="polls" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Poll Creation & Management</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Poll
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Poll</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="poll-title">Poll Title</Label>
                        <Input
                          id="poll-title"
                          value={pollTitle}
                          onChange={(e) => setPollTitle(e.target.value)}
                          placeholder="Enter poll title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="poll-description">Description</Label>
                        <Textarea
                          id="poll-description"
                          value={pollDescription}
                          onChange={(e) => setPollDescription(e.target.value)}
                          placeholder="Enter poll description"
                        />
                      </div>
                      <div>
                        <Label>Poll Options</Label>
                        <div className="space-y-2">
                          {pollOptions.map((option, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updatePollOption(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                              />
                              {pollOptions.length > 2 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removePollOption(index)}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addPollOption}
                          className="mt-2"
                        >
                          Add Option
                        </Button>
                      </div>
                      <div>
                        <Label htmlFor="poll-audience">Target Audience</Label>
                        <Select value={pollAudience} onValueChange={setPollAudience}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="candidates">Only Candidates</SelectItem>
                            <SelectItem value="employers">Only Employers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => createPollMutation.mutate({
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
                        className="w-full"
                      >
                        Create Poll
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {polls?.map((poll) => (
                  <div key={poll.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{poll.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {poll.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>
                            {poll.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {poll.total_votes || 0} votes • {poll.target_audience}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => endPoll(poll.id)}
                          disabled={poll.status !== 'active'}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          End Poll
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Community Events</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Community Event</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="event-title">Event Title</Label>
                        <Input
                          id="event-title"
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          placeholder="Enter event title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-description">Description</Label>
                        <Textarea
                          id="event-description"
                          value={eventDescription}
                          onChange={(e) => setEventDescription(e.target.value)}
                          placeholder="Enter event description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-type">Event Type</Label>
                        <Select value={eventType} onValueChange={setEventType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="job_fair">Virtual Job Fair</SelectItem>
                            <SelectItem value="webinar">Webinar</SelectItem>
                            <SelectItem value="ama">AMA Session</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="event-date">Start Date & Time</Label>
                        <Input
                          id="event-date"
                          type="datetime-local"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={() => createEventMutation.mutate({
                          title: eventTitle,
                          description: eventDescription,
                          event_type: eventType,
                          start_date: new Date(eventDate).toISOString()
                        })}
                        disabled={!eventTitle || !eventDate || createEventMutation.isPending}
                        className="w-full"
                      >
                        Create Event
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events?.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{event.event_type}</Badge>
                          <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {getEventRegistrationCount(event.id)} registered
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(event.start_date).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          View RSVPs
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PollsEventsManager;
