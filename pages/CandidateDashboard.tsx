import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/shared/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import JobInviteCard from '@/components/features/jobs/JobInviteCard';
import ProfileUpdatePrompt from '@/components/features/candidates/ProfileUpdatePrompt';
import { candidateApi } from '@/services/candidateApi';
import {
  transformDashboardData,
  transformJobData,
  getFallbackDashboardData,
  getFallbackJobs,
} from '@/lib/candidateUtils';
import { useAuth } from '@/hooks/useAuth';
import {
  Search,
  Briefcase,
  Heart,
  TrendingUp,
  Users,
  MapPin,
  Star,
  Calendar,
  MessageSquare
} from 'lucide-react';

const CandidateDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Use React Query for better caching and state management
  const {
    data: dashboardData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['dashboard-summary', user?.id],
    queryFn: async () => {
      try {
        const rawData = await candidateApi.getDashboardSummary();
        return {
          metrics: transformDashboardData(rawData).metrics,
          recommendedJobs: transformJobData(rawData.jobRecommendations || [])
        };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Return fallback data on error
        return {
          metrics: getFallbackDashboardData().metrics,
          recommendedJobs: getFallbackJobs()
        };
      }
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const metrics = dashboardData?.metrics;
  const recommendedJobs = dashboardData?.recommendedJobs || [];

  const recentApplications = [];

  const jobInvites = [];

  const upcomingInterviews = [
    // Todo Im
  ];

  const stats = [
    { label: 'Job Invites', value: metrics?.jobInvites?.toString() || '0', icon: Star, color: 'text-primary' },
    { label: 'Applications', value: metrics?.applications?.toString() || '0', icon: Briefcase, color: 'text-blue-600' },
    { label: 'Interviews', value: metrics?.interviews?.toString() || '0', icon: Users, color: 'text-green-600' },
    { label: 'Profile Views', value: metrics?.profileViews?.toString() || '0', icon: TrendingUp, color: 'text-purple-600' },
  ];

  const handleApplyToJob = (jobId: number) => {
    // Handle application logic
    console.log('Applying to job:', jobId);
  };

  const handleSaveJob = (jobId: number) => {
    // Handle save job logic
    console.log('Saving job:', jobId);
  };

  const handleMessageEmployer = (jobId: number) => {
    // Handle messaging logic
    console.log('Messaging employer for job:', jobId);
  };

  const handleUpdateProfile = () => {
    // Navigate to profile update
    console.log('Updating profile');
  };

  const handleDismissPrompt = () => {
    // Handle dismissing profile prompt
    console.log('Dismissing prompt');
  };



  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Fixed header section */}
        <div className="flex-shrink-0 p-6 pb-0">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName || 'Candidate'}!
            </h1>
            <p className="text-gray-600">Ready to find your next opportunity? Let's get started.</p>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 pt-4 space-y-6">

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => navigate('/jobs')}
          >
            <Search className="mr-2 h-4 w-4" />
            Search Jobs
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/applications')}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            View Applications
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/settings')}
          >
            <Users className="mr-2 h-4 w-4" />
            Update Profile
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '...' : stat.value}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Update Prompt */}
        <ProfileUpdatePrompt
          trigger="rejection"
          rejectionCount={2}
          onUpdateProfile={handleUpdateProfile}
          onDismiss={handleDismissPrompt}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Interviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Interviews
              </CardTitle>
              <CardDescription>Your scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingInterviews.length > 0 ? (
                upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{interview.position}</h4>
                      <p className="text-sm text-muted-foreground">{interview.company}</p>
                      <p className="text-xs text-muted-foreground">{interview.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{interview.type}</Badge>
                      <Button size="sm" variant="outline">Details</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming interviews
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Messages
              </CardTitle>
              <CardDescription>Latest conversations with employers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentApplications.slice(0, 2).map((app) => (
                <div key={app.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-accent/50">
                  <div className="text-2xl">{app.logo}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{app.company}</h4>
                    <p className="text-sm text-muted-foreground">Interview scheduling discussion</p>
                    <p className="text-xs text-muted-foreground">{app.date}</p>
                  </div>
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
              ))}
              {recentApplications.length > 0 ? (
                <Button variant="outline" className="w-full">View All Messages</Button>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent messages
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Job Invitations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Job Invitations
            </CardTitle>
            <CardDescription>Companies that want to interview you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobInvites.map((job) => (
                <JobInviteCard
                  key={job.id}
                  job={job}
                  onApply={handleApplyToJob}
                  onSave={handleSaveJob}
                  onMessage={handleMessageEmployer}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Jobs</CardTitle>
            <CardDescription>Jobs that match your skills and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="border rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : recommendedJobs.length > 0 ? (
                recommendedJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                      <Badge variant="secondary">{job.matchScore}% match</Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <p className="text-sm font-medium text-green-600">{job.salary}</p>
                      <p className="text-xs text-gray-500">{job.type} • {job.postedDate}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">Apply Now</Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No recommended jobs available at the moment.
                </div>
              )}
            </div>
            {recommendedJobs.length > 0 && (
              <div className="mt-6 text-center">
                <Button variant="outline">View More Jobs</Button>
              </div>
            )}
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CandidateDashboard;
