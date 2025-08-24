import Layout from '@/components/shared/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import NotificationSettings from '@/components/shared/notifications/NotificationSettings';
import { Bell, Briefcase, AlertCircle, CheckCircle, Clock, Filter, Settings, Search } from 'lucide-react';
import { useState } from 'react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const notifications = [
    { 
      id: 1, 
      type: 'job_offer', 
      title: '🎉 Job Offer Received!', 
      message: 'Congratulations! TechCorp has officially offered you the Senior Frontend Developer position with a salary of $95,000.', 
      company: 'TechCorp',
      read: false,
      created: '2025-01-15T10:30:00Z',
      priority: 'high',
      action: 'accept_decline_offer'
    },
    { 
      id: 2, 
      type: 'job_invite', 
      title: 'Job Invitation', 
      message: 'DesignStudio thinks you\'d be perfect for their UI/UX Designer position and would like to invite you to apply', 
      company: 'DesignStudio',
      read: false,
      created: '2025-01-15T09:15:00Z',
      priority: 'high',
      action: 'view_invitation'
    },
    { 
      id: 3, 
      type: 'shortlisted', 
      title: 'You\'ve Been Shortlisted!', 
      message: 'Great news! You\'ve been shortlisted for the Full Stack Developer position at StartupHub. They will contact you soon for next steps.', 
      company: 'StartupHub',
      read: false,
      created: '2025-01-14T14:20:00Z',
      priority: 'high',
      action: 'view_details'
    },
    { 
      id: 4, 
      type: 'interview_invite', 
      title: 'Interview Invitation', 
      message: 'CloudTech wants to schedule an interview with you for the DevOps Engineer position. Please select your preferred time slot.', 
      company: 'CloudTech',
      read: false,
      created: '2025-01-14T16:30:00Z',
      priority: 'high',
      action: 'schedule_interview'
    },
    { 
      id: 5, 
      type: 'interview_reminder', 
      title: 'Interview Reminder', 
      message: 'Your interview with InnovateCorp is tomorrow at 2:00 PM. A calendar reminder has been added.', 
      company: 'InnovateCorp',
      read: true,
      created: '2025-01-14T08:45:00Z',
      priority: 'high',
      action: 'view_details'
    },
    { 
      id: 6, 
      type: 'application_update', 
      title: 'Application Rejected', 
      message: 'Your application for Marketing Manager at BrandCo was not selected. Consider updating your profile for better matches.', 
      company: 'BrandCo',
      read: false,
      created: '2025-01-13T16:30:00Z',
      priority: 'medium',
      action: 'update_profile'
    },
    { 
      id: 7, 
      type: 'job_match', 
      title: 'New Job Matches', 
      message: 'We found 5 new jobs that match your profile with 85%+ compatibility', 
      read: false,
      created: '2025-01-13T12:15:00Z',
      priority: 'medium',
      action: 'view_matches'
    },
    { 
      id: 8, 
      type: 'message', 
      title: 'New Message', 
      message: 'You have a new message from GrowthCo recruiter about the Product Manager role', 
      company: 'GrowthCo',
      read: false,
      created: '2025-01-13T10:20:00Z',
      priority: 'medium',
      action: 'view_message'
    },
    { 
      id: 9, 
      type: 'profile_view', 
      title: 'Profile Viewed', 
      message: 'DataTech Solutions viewed your profile. Update your skills to increase your visibility.', 
      company: 'DataTech Solutions',
      read: true,
      created: '2025-01-12T16:00:00Z',
      priority: 'low',
      action: 'update_profile'
    }
  ];

  const jobAlerts = [
    { id: 1, title: 'Frontend Developer Jobs', keywords: 'React, JavaScript, TypeScript', location: 'Remote', active: true },
    { id: 2, title: 'Senior Developer Jobs', keywords: 'Node.js, Python, AWS', location: 'New York', active: true },
    { id: 3, title: 'UI/UX Designer Jobs', keywords: 'Figma, Adobe, Prototyping', location: 'San Francisco', active: false }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job_offer': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'job_invite': return <Briefcase className="h-4 w-4 text-primary" />;
      case 'shortlisted': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'interview_invite': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'interview_reminder': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'application_update': return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'message': return <AlertCircle className="h-4 w-4 text-purple-500" />;
      case 'job_match': return <Bell className="h-4 w-4 text-cyan-500" />;
      case 'profile_view': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionButton = (notification: any) => {
    switch (notification.action) {
      case 'accept_decline_offer':
        return (
          <div className="flex gap-2 mt-2">
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">Accept Offer</Button>
            <Button size="sm" variant="outline" className="flex-1">Decline</Button>
          </div>
        );
      case 'schedule_interview':
        return (
          <Button size="sm" className="mt-2">
            Schedule Interview
          </Button>
        );
      case 'view_invitation':
        return (
          <Button size="sm" className="mt-2">
            View Invitation
          </Button>
        );
      case 'view_details':
        return (
          <Button size="sm" variant="outline" className="mt-2">
            View Details
          </Button>
        );
      case 'update_profile':
        return (
          <Button size="sm" variant="outline" className="mt-2">
            Update Profile
          </Button>
        );
      case 'view_matches':
        return (
          <Button size="sm" className="mt-2">
            View Matches
          </Button>
        );
      case 'view_message':
        return (
          <Button size="sm" variant="outline" className="mt-2">
            View Message
          </Button>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return <Badge variant="outline" className={colors[priority]}>{priority}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab !== 'all' && notification.type !== activeTab) return false;
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your job applications and opportunities</p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Notification Settings
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                </div>
                <Bell className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Applications</p>
                  <p className="text-2xl font-bold">7</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Interviews</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Job Alerts</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <AlertCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="job_alerts">Job Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Notifications</CardTitle>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="Search notifications..." 
                        className="pl-10 w-64" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Mark All Read
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg transition-colors hover:bg-accent/50 ${
                        !notification.read ? 'bg-accent/20 border-primary/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getTypeIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(notification.priority)}
                              {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                          </div>
                           <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                           <div className="flex items-center justify-between mb-2">
                             <span className="text-xs text-muted-foreground">
                               {notification.company && `${notification.company} • `}
                               {formatDate(notification.created)}
                             </span>
                             {!notification.read && (
                               <Button variant="ghost" size="sm" className="text-xs">
                                 Mark as read
                               </Button>
                             )}
                           </div>
                           {getActionButton(notification)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job & Interview Invitations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.filter(n => n.type === 'job_invite' || n.type === 'job_offer' || n.type === 'interview_invite' || n.type === 'shortlisted').map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg ${!notification.read ? 'bg-accent/20 border-primary/20' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {getTypeIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">
                              {notification.company} • {formatDate(notification.created)}
                            </span>
                          </div>
                          {getActionButton(notification)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.filter(n => n.type === 'interview_reminder' || n.type === 'interview_invite').map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg ${!notification.read ? 'bg-accent/20 border-primary/20' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {getTypeIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">
                              {notification.company} • {formatDate(notification.created)}
                            </span>
                          </div>
                          {getActionButton(notification)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <p className="text-sm text-muted-foreground">Customize your notification preferences</p>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job_alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Job Alert Settings</CardTitle>
                  <Button>
                    <Bell className="h-4 w-4 mr-2" />
                    Create New Alert
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{alert.title}</h4>
                            <Switch checked={alert.active} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Keywords:</span> {alert.keywords}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Location:</span> {alert.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Delete</Button>
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
    </Layout>
  );
};

export default Notifications;
