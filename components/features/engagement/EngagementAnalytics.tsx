import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle,
  Calendar,
  Award,
  Eye,
  ThumbsUp
} from 'lucide-react-native';

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
    <ScrollView style={{ flex: 1 }}>
      <View style={{ gap: 24, padding: 16 }}>
        {/* KPI Overview */}
        <View style={{ gap: 16 }}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Active Users</CardTitle>
              <Users size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{activeUsers}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                With recent activity
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Total Messages</CardTitle>
              <MessageCircle size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{totalChatMessages}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                Chat messages sent
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Forum Activity</CardTitle>
              <BarChart3 size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{totalForumPosts + totalForumReplies}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                Posts and replies
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Weekly Trend</CardTitle>
              <TrendingUp size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{weeklyEngagement}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                Activities this week
              </Text>
            </CardContent>
          </Card>
        </View>

        <Tabs
          tabs={['Overview', 'Forum Analytics', 'User Engagement', 'Events & Polls']}
          initialTab={0}
          tabContent={(activeIndex) => {
            if (activeIndex === 0) {
              // OVERVIEW
              return (
                <View style={{ gap: 24 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Engagement Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={{ gap: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, fontWeight: '500' }}>Forum Posts</Text>
                          <Badge variant="secondary">{totalForumPosts}</Badge>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, fontWeight: '500' }}>Forum Replies</Text>
                          <Badge variant="secondary">{totalForumReplies}</Badge>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, fontWeight: '500' }}>Chat Messages</Text>
                          <Badge variant="secondary">{totalChatMessages}</Badge>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, fontWeight: '500' }}>Poll Votes</Text>
                          <Badge variant="secondary">{totalPollVotes}</Badge>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, fontWeight: '500' }}>Event Registrations</Text>
                          <Badge variant="secondary">{totalEventRegistrations}</Badge>
                        </View>
                      </View>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={{ gap: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, fontWeight: '500' }}>Forum Categories</Text>
                          <Badge variant="outline">{forumStats?.categories.length || 0}</Badge>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, fontWeight: '500' }}>Active Polls</Text>
                          <Badge variant="outline">
                            {pollStats?.polls.filter(p => p.status === 'active').length || 0}
                          </Badge>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, fontWeight: '500' }}>Upcoming Events</Text>
                          <Badge variant="outline">
                            {eventStats?.events.filter(e => new Date(e.start_date) > new Date()).length || 0}
                          </Badge>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, fontWeight: '500' }}>Total Users Engaged</Text>
                          <Badge variant="outline">{userEngagement?.length || 0}</Badge>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                </View>
              );
            }

            if (activeIndex === 1) {
              // FORUM ANALYTICS
              return (
                <View style={{ gap: 24 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Most Active Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={{ gap: 12 }}>
                        {forumStats?.categories.slice(0, 5).map((category) => {
                          const categoryPosts = forumStats.posts.filter(p => p.category_id === category.id);
                          return (
                            <View 
                              key={category.id} 
                              style={{ 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                padding: 12, 
                                borderWidth: 1, 
                                borderColor: '#e5e7eb', 
                                borderRadius: 8 
                              }}
                            >
                              <View>
                                <Text style={{ fontWeight: '500' }}>{category.name}</Text>
                                <Text style={{ fontSize: 14, color: '#6b7280' }}>{category.description}</Text>
                              </View>
                              <Badge variant="secondary">{categoryPosts.length} posts</Badge>
                            </View>
                          );
                        })}
                      </View>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Forum Engagement Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={{ gap: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <Eye size={16} color="#6b7280" />
                          <View>
                            <Text style={{ fontWeight: '500' }}>Total Views</Text>
                            <Text style={{ fontSize: 24, fontWeight: '700' }}>
                              {forumStats?.posts.reduce((sum, post) => sum + (post.views_count || 0), 0) || 0}
                            </Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <ThumbsUp size={16} color="#6b7280" />
                          <View>
                            <Text style={{ fontWeight: '500' }}>Total Likes</Text>
                            <Text style={{ fontSize: 24, fontWeight: '700' }}>
                              {forumStats?.posts.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0}
                            </Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <MessageCircle size={16} color="#6b7280" />
                          <View>
                            <Text style={{ fontWeight: '500' }}>Avg Replies per Post</Text>
                            <Text style={{ fontSize: 24, fontWeight: '700' }}>
                              {totalForumPosts > 0 ? Math.round(totalForumReplies / totalForumPosts) : 0}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                </View>
              );
            }

            if (activeIndex === 2) {
              // USER ENGAGEMENT
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Contributors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={{ gap: 12 }}>
                      {topContributors.map((user, index) => (
                        <View 
                          key={user.id} 
                          style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: 12, 
                            borderWidth: 1, 
                            borderColor: '#e5e7eb', 
                            borderRadius: 8 
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{ 
                              flexDirection: 'row', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              width: 32, 
                              height: 32, 
                              borderRadius: 16, 
                              backgroundColor: '#f3f4f6' 
                            }}>
                              <Text style={{ fontSize: 14, fontWeight: '500' }}>#{index + 1}</Text>
                            </View>
                            <View>
                              <Text style={{ fontWeight: '500' }}>User {user.user_id}</Text>
                              <Text style={{ fontSize: 14, color: '#6b7280' }}>
                                {user.forum_posts} posts • {user.forum_replies} replies
                              </Text>
                            </View>
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontWeight: '700' }}>{user.total_points} pts</Text>
                            <Badge variant="outline" style={{ fontSize: 12 }}>
                              {user.current_rank}
                            </Badge>
                          </View>
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              );
            }

            if (activeIndex === 3) {
              // EVENTS & POLLS
              return (
                <View style={{ gap: 24 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Poll Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={{ gap: 12 }}>
                        {pollStats?.polls.slice(0, 5).map((poll) => (
                          <View 
                            key={poll.id} 
                            style={{ 
                              flexDirection: 'row', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              padding: 12, 
                              borderWidth: 1, 
                              borderColor: '#e5e7eb', 
                              borderRadius: 8 
                            }}
                          >
                            <View>
                              <Text style={{ fontWeight: '500' }}>{poll.title}</Text>
                              <Text style={{ fontSize: 14, color: '#6b7280' }}>
                                {poll.target_audience} • {poll.status}
                              </Text>
                            </View>
                            <Badge variant="secondary">{poll.total_votes || 0} votes</Badge>
                          </View>
                        ))}
                      </View>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Event Participation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={{ gap: 12 }}>
                        {eventStats?.events.slice(0, 5).map((event) => {
                          const registrationCount = eventStats.registrations.filter(r => r.event_id === event.id).length;
                          return (
                            <View 
                              key={event.id} 
                              style={{ 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                padding: 12, 
                                borderWidth: 1, 
                                borderColor: '#e5e7eb', 
                                borderRadius: 8 
                              }}
                            >
                              <View>
                                <Text style={{ fontWeight: '500' }}>{event.title}</Text>
                                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                                  {event.event_type} • {event.status}
                                </Text>
                              </View>
                              <Badge variant="secondary">{registrationCount} registered</Badge>
                            </View>
                          );
                        })}
                      </View>
                    </CardContent>
                  </Card>
                </View>
              );
            }

            return null;
          }}
        />
      </View>
    </ScrollView>
  );
};

export default EngagementAnalytics;
