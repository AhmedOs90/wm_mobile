import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle,
  Calendar,
  Award,
  Eye,
  ThumbsUp
} from 'lucide-react';

const EngagementAnalytics = () => {
  // Fetch analytics data
  const { data: forumStats } = useQuery({
    queryKey: ['forum-analytics'],
    queryFn: async () => {
      // Mock forum data
      return {
        posts: [
          { id: '1', user_id: 'user1', title: 'Sample Post', category_id: '1', views_count: 45, likes_count: 12, created_at: '2024-01-01T00:00:00Z' },
          { id: '2', user_id: 'user2', title: 'Another Post', category_id: '2', views_count: 32, likes_count: 8, created_at: '2024-01-02T00:00:00Z' }
        ],
        replies: [
          { id: '1', post_id: '1', user_id: 'user3', created_at: '2024-01-01T01:00:00Z' },
          { id: '2', post_id: '1', user_id: 'user4', created_at: '2024-01-01T02:00:00Z' }
        ],
        categories: [
          { id: '1', name: 'General Discussion', description: 'General topics' },
          { id: '2', name: 'Job Tips', description: 'Career advice' }
        ]
      };
    }
  });

  const { data: chatStats } = useQuery({
    queryKey: ['chat-analytics'],
    queryFn: async () => {
      // Mock chat data
      return [
        { id: '1', sender_id: 'user1', receiver_id: 'user2', message: 'Hello', created_at: '2024-01-01T00:00:00Z' },
        { id: '2', sender_id: 'user2', receiver_id: 'user1', message: 'Hi there', created_at: '2024-01-01T01:00:00Z' }
      ];
    }
  });

  const { data: pollStats } = useQuery({
    queryKey: ['poll-analytics'],
    queryFn: async () => {
      // Mock poll data
      return {
        polls: [
          { id: '1', title: 'Sample Poll', status: 'active', target_audience: 'all', total_votes: 25, created_at: '2024-01-01T00:00:00Z' },
          { id: '2', title: 'Another Poll', status: 'closed', target_audience: 'employers', total_votes: 18, created_at: '2024-01-02T00:00:00Z' }
        ],
        votes: [
          { id: '1', poll_id: '1', user_id: 'user1', created_at: '2024-01-01T01:00:00Z' },
          { id: '2', poll_id: '1', user_id: 'user2', created_at: '2024-01-01T02:00:00Z' }
        ]
      };
    }
  });

  const { data: eventStats } = useQuery({
    queryKey: ['event-analytics'],
    queryFn: async () => {
      // Mock event data
      return {
        events: [
          { id: '1', title: 'Sample Event', status: 'active', target_audience: 'all', event_type: 'webinar', start_date: '2024-01-15T00:00:00Z', created_at: '2024-01-01T00:00:00Z' },
          { id: '2', title: 'Another Event', status: 'upcoming', target_audience: 'employers', event_type: 'workshop', start_date: '2024-01-20T00:00:00Z', created_at: '2024-01-02T00:00:00Z' }
        ],
        registrations: [
          { id: '1', event_id: '1', user_id: 'user1', created_at: '2024-01-01T01:00:00Z' },
          { id: '2', event_id: '1', user_id: 'user2', created_at: '2024-01-01T02:00:00Z' }
        ]
      };
    }
  });

  const { data: userEngagement } = useQuery({
    queryKey: ['user-engagement-analytics'],
    queryFn: async () => {
      // Mock user engagement data
      return [
        { id: '1', user_id: 'user1', total_points: 150, forum_posts: 5, forum_replies: 12, current_rank: 'Gold', created_at: '2024-01-01T00:00:00Z' },
        { id: '2', user_id: 'user2', total_points: 120, forum_posts: 3, forum_replies: 8, current_rank: 'Silver', created_at: '2024-01-02T00:00:00Z' }
      ];
    }
  });

  // Calculate KPIs
  const totalForumPosts = forumStats?.posts.length || 0;
  const totalForumReplies = forumStats?.replies.length || 0;
  const totalChatMessages = chatStats?.length || 0;
  const totalPollVotes = pollStats?.votes.length || 0;
  const totalEventRegistrations = eventStats?.registrations.length || 0;
  const activeUsers = new Set([
    ...(chatStats?.map(log => log.sender_id) || []),
    ...(chatStats?.map(log => log.receiver_id) || []),
    ...(forumStats?.posts.map(post => post.user_id) || [])
  ]).size;

  // Get top contributors
  const topContributors = userEngagement?.slice(0, 10) || [];

  // Calculate engagement trends (simplified)
  const getEngagementTrend = () => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const recentPosts = forumStats?.posts.filter(post => 
      new Date(post.created_at) > last7Days
    ).length || 0;
    
    const recentMessages = chatStats?.filter(log => 
      new Date(log.created_at) > last7Days
    ).length || 0;

    return recentPosts + recentMessages;
  };

  const weeklyEngagement = getEngagementTrend();

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              With recent activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChatMessages}</div>
            <p className="text-xs text-muted-foreground">
              Chat messages sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forum Activity</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalForumPosts + totalForumReplies}</div>
            <p className="text-xs text-muted-foreground">
              Posts and replies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyEngagement}</div>
            <p className="text-xs text-muted-foreground">
              Activities this week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forum">Forum Analytics</TabsTrigger>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="events">Events & Polls</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Forum Posts</span>
                    <Badge variant="secondary">{totalForumPosts}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Forum Replies</span>
                    <Badge variant="secondary">{totalForumReplies}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Chat Messages</span>
                    <Badge variant="secondary">{totalChatMessages}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Poll Votes</span>
                    <Badge variant="secondary">{totalPollVotes}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Event Registrations</span>
                    <Badge variant="secondary">{totalEventRegistrations}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Forum Categories</span>
                    <Badge variant="outline">{forumStats?.categories.length || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Polls</span>
                    <Badge variant="outline">
                      {pollStats?.polls.filter(p => p.status === 'active').length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Upcoming Events</span>
                    <Badge variant="outline">
                      {eventStats?.events.filter(e => new Date(e.start_date) > new Date()).length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Users Engaged</span>
                    <Badge variant="outline">{userEngagement?.length || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forum" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Active Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forumStats?.categories.slice(0, 5).map((category) => {
                    const categoryPosts = forumStats.posts.filter(p => p.category_id === category.id);
                    return (
                      <div key={category.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        <Badge variant="secondary">{categoryPosts.length} posts</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forum Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Total Views</p>
                      <p className="text-2xl font-bold">
                        {forumStats?.posts.reduce((sum, post) => sum + (post.views_count || 0), 0) || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Total Likes</p>
                      <p className="text-2xl font-bold">
                        {forumStats?.posts.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Avg Replies per Post</p>
                      <p className="text-2xl font-bold">
                        {totalForumPosts > 0 ? Math.round(totalForumReplies / totalForumPosts) : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topContributors.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        <span className="text-sm font-medium">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">User {user.user_id}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.forum_posts} posts • {user.forum_replies} replies
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{user.total_points} pts</div>
                      <Badge variant="outline" className="text-xs">
                        {user.current_rank}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Poll Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pollStats?.polls.slice(0, 5).map((poll) => (
                    <div key={poll.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{poll.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {poll.target_audience} • {poll.status}
                        </p>
                      </div>
                      <Badge variant="secondary">{poll.total_votes || 0} votes</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eventStats?.events.slice(0, 5).map((event) => {
                    const registrationCount = eventStats.registrations.filter(r => r.event_id === event.id).length;
                    return (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.event_type} • {event.status}
                          </p>
                        </div>
                        <Badge variant="secondary">{registrationCount} registered</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EngagementAnalytics;
