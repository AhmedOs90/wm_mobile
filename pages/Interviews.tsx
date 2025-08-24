import Layout from '@/components/shared/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InterviewScheduler from '@/components/features/interviews/InterviewScheduler';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

const Interviews = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const pendingInvitations = [
    {
      id: 1,
      company: 'TechCorp',
      position: 'Senior Frontend Developer',
      contact: 'Sarah Johnson',
      type: 'video' as const,
      duration: '45 minutes',
      description: 'Technical interview focusing on React, TypeScript, and system design. We will discuss your experience and walk through some coding challenges.',
      proposedSlots: [
        { date: '2025-01-18', time: '2:00 PM', timezone: 'EST' },
        { date: '2025-01-19', time: '10:00 AM', timezone: 'EST' },
        { date: '2025-01-20', time: '3:00 PM', timezone: 'EST' }
      ],
      deadline: '2025-01-17',
      status: 'pending' as const
    },
    {
      id: 2,
      company: 'DesignStudio',
      position: 'UI/UX Designer',
      contact: 'Mike Chen',
      type: 'in-person' as const,
      duration: '1 hour',
      description: 'Portfolio review and design challenge. Please bring examples of your recent work and be prepared to discuss your design process.',
      proposedSlots: [
        { date: '2025-01-22', time: '11:00 AM', timezone: 'PST' },
        { date: '2025-01-23', time: '2:00 PM', timezone: 'PST' }
      ],
      deadline: '2025-01-20',
      status: 'pending' as const
    }
  ];

  const confirmedInterviews = [
    {
      id: 3,
      company: 'StartupHub',
      position: 'Full Stack Developer',
      date: '2025-01-18',
      time: '2:00 PM',
      type: 'video',
      interviewer: 'Alex Rodriguez',
      meetingLink: 'https://zoom.us/j/123456789',
      status: 'confirmed'
    }
  ];

  const completedInterviews = [
    {
      id: 4,
      company: 'InnovateCorp',
      position: 'React Developer',
      date: '2025-01-10',
      time: '10:00 AM',
      type: 'video',
      result: 'waiting_feedback',
      interviewer: 'Emma Wilson'
    },
    {
      id: 5,
      company: 'GrowthCo',
      position: 'Product Manager',
      date: '2025-01-08',
      time: '3:00 PM',
      type: 'in-person',
      result: 'rejected',
      interviewer: 'John Davis',
      feedback: 'Great candidate, but looking for someone with more PM experience'
    }
  ];

  const handleAcceptInterview = (slotIndex: number, message?: string) => {
    console.log('Accepting interview slot:', slotIndex, message);
    // Handle accept logic
  };

  const handleDeclineInterview = (reason?: string) => {
    console.log('Declining interview:', reason);
    // Handle decline logic
  };

  const handleAddToCalendar = (interview: any) => {
    // Generate calendar event
    const event = {
      title: `Interview: ${interview.position} at ${interview.company}`,
      start: new Date(`${interview.date} ${interview.time}`),
      description: `Interview with ${interview.interviewer}${interview.meetingLink ? `\n\nMeeting Link: ${interview.meetingLink}` : ''}`
    };
    
    // Create calendar URL
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${event.start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(event.description)}`;
    
    window.open(calendarUrl, '_blank');
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'waiting_feedback':
        return <Badge variant="secondary">Waiting for Feedback</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Not Selected</Badge>;
      case 'passed':
        return <Badge variant="default">Passed</Badge>;
      default:
        return <Badge variant="outline">Completed</Badge>;
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Interviews</h1>
            <p className="text-muted-foreground">Manage your interview invitations and schedule</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Request Interview
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingInvitations.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold">{confirmedInterviews.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">75%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Invitations</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <div className="space-y-6">
              {pendingInvitations.map((invitation) => (
                <InterviewScheduler
                  key={invitation.id}
                  invitation={invitation}
                  onAccept={handleAcceptInterview}
                  onDecline={handleDeclineInterview}
                />
              ))}
              {pendingInvitations.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Pending Invitations</h3>
                    <p className="text-muted-foreground">You're all caught up! New interview invitations will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {confirmedInterviews.map((interview) => (
                  <Card key={interview.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{interview.position}</CardTitle>
                          <CardDescription>{interview.company}</CardDescription>
                        </div>
                        <Badge variant="default">Confirmed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(interview.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{interview.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {interview.type === 'video' ? 
                            <Video className="h-4 w-4 text-muted-foreground" /> : 
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                          }
                          <span className="text-sm">{interview.type === 'video' ? 'Video Interview' : 'In-Person Interview'}</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-accent/20 border rounded-lg">
                        <p className="text-sm font-medium mb-1">Interviewer: {interview.interviewer}</p>
                        {interview.meetingLink && (
                          <p className="text-xs text-muted-foreground">Meeting link will be available 15 minutes before the interview</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleAddToCalendar(interview)} 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Add to Calendar
                        </Button>
                        {interview.meetingLink && (
                          <Button size="sm" className="flex-1">
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Interview Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="space-y-4">
              {completedInterviews.map((interview) => (
                <Card key={interview.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{interview.position}</h3>
                        <p className="text-sm text-muted-foreground">{interview.company}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(interview.date).toLocaleDateString()} at {interview.time}
                        </p>
                      </div>
                      {getResultBadge(interview.result)}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      {interview.type === 'video' ? 
                        <Video className="h-4 w-4 text-muted-foreground" /> : 
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      }
                      <span className="text-sm">Interviewed by {interview.interviewer}</span>
                    </div>

                    {interview.feedback && (
                      <div className="p-3 bg-muted/50 border rounded-lg">
                        <p className="text-sm font-medium mb-1">Feedback:</p>
                        <p className="text-sm text-muted-foreground">{interview.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Interviews;
