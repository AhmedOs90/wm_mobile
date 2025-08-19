// screens/employer/EmployerEngagement.native.tsx
import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs'; // your RN Tabs(tabs, initialTab, tabContent)
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  Users,
  Calendar as CalendarIcon,
  Star,
  Send,
  Heart,
  Share,
  Eye,
  ThumbsUp,
  MessageCircle,
  Plus,
} from 'lucide-react-native';
import { toast } from '@/hooks/use-toast';

// Small helper to render a gradient "stat" card that still uses your Card shell
const GradientStatCard = ({
  colors,
  borderColor,
  icon,
  value,
  label,
}: {
  colors: string[];
  borderColor: string;
  icon: React.ReactNode;
  value: string;
  label: string;
}) => {
  return (
    <Card className="" style={{ borderColor }}>
      <LinearGradient
        colors={colors}
        style={{ borderRadius: 12, overflow: 'hidden' }}
      >
        <CardContent className="p-4">
          <View style={{ alignItems: 'center' }}>
            <View style={{ marginBottom: 8 }}>{icon}</View>
            <Text style={{ fontSize: 22, fontWeight: '700' }}>{value}</Text>
            <Text style={{ color: '#4b5563', marginTop: 2 }}>{label}</Text>
          </View>
        </CardContent>
      </LinearGradient>
    </Card>
  );
};

const EmployerEngagement: React.FC = () => {
  // ---- Mock data (same structure you shared)
  const communityPosts = useMemo(
    () => [
      {
        id: 1,
        author: 'Infotech Global',
        avatar: 'IT',
        content:
          'Looking for talented Vue.js developers to join our growing team! We offer competitive salaries and great benefits.',
        timestamp: '2 hours ago',
        likes: 24,
        comments: 8,
        shares: 3,
        type: 'hiring',
      },
      {
        id: 2,
        author: 'TechCorp Solutions',
        avatar: 'TC',
        content:
          'Excited to announce our new office opening in Cairo! This means more opportunities for local talent.',
        timestamp: '1 day ago',
        likes: 45,
        comments: 12,
        shares: 7,
        type: 'announcement',
      },
    ],
    []
  );

  const messages = useMemo(
    () => [
      {
        id: 1,
        from: 'Kareem A.',
        avatar: 'KA',
        message:
          "Hi, I'm interested in the Vue.js position. Could you share more details about the role?",
        timestamp: '10 min ago',
        unread: true,
      },
      {
        id: 2,
        from: 'Sarah M.',
        avatar: 'SM',
        message:
          'Thank you for considering my application. Looking forward to hearing from you.',
        timestamp: '1 hour ago',
        unread: true,
      },
      {
        id: 3,
        from: 'Ahmed R.',
        avatar: 'AR',
        message: 'The interview was great! When can I expect to hear back?',
        timestamp: '2 days ago',
        unread: false,
      },
    ],
    []
  );

  const events = useMemo(
    () => [
      {
        id: 1,
        title: 'Tech Meetup Cairo',
        date: '2025-01-20',
        time: '6:00 PM',
        attendees: 45,
        type: 'networking',
        status: 'upcoming',
      },
      {
        id: 2,
        title: 'Hiring Workshop',
        date: '2025-01-25',
        time: '2:00 PM',
        attendees: 23,
        type: 'workshop',
        status: 'upcoming',
      },
      {
        id: 3,
        title: 'Company Showcase',
        date: '2025-01-15',
        time: '4:00 PM',
        attendees: 67,
        type: 'showcase',
        status: 'completed',
      },
    ],
    []
  );

  // ---- Local state
  const [postText, setPostText] = useState('');
  const [chatInput, setChatInput] = useState('');

  const handlePost = () => {
    if (!postText.trim()) {
      toast({
        title: 'Nothing to post',
        description: 'Write something before posting.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Posted!',
      description: 'Your update has been shared.',
    });
    setPostText('');
  };

  // ---- Tabs setup (your RN Tabs API)
  const tabs = ['Community', 'Messages', 'Events', 'Analytics'];

  const CommunityTab = () => (
    <ScrollView contentContainerStyle={{ gap: 16 }}>
      {/* Header row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Engagement</Text>
        <Button iconLeft={<Plus size={16} />}>Create Post</Button>
      </View>

      {/* Stats grid */}
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <GradientStatCard
            colors={['#EFF6FF', '#E0EAFF']}
            borderColor="#BFDBFE"
            icon={<Users size={32} color="#3B82F6" />}
            value="142"
            label="Followers"
          />
          <GradientStatCard
            colors={['#ECFDF5', '#DEF7EC']}
            borderColor="#A7F3D0"
            icon={<Heart size={32} color="#10B981" />}
            value="1.2K"
            label="Total Likes"
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <GradientStatCard
            colors={['#F5F3FF', '#EDE9FE']}
            borderColor="#DDD6FE"
            icon={<Share size={32} color="#8B5CF6" />}
            value="87"
            label="Shares"
          />
          <GradientStatCard
            colors={['#FFF7ED', '#FFEDD5']}
            borderColor="#FED7AA"
            icon={<Eye size={32} color="#F97316" />}
            value="3.4K"
            label="Profile Views"
          />
        </View>
      </View>

      {/* Create Post */}
      <Card>
        <LinearGradient colors={['#ECFEFF', '#DBEAFE']} style={{ borderRadius: 12 }}>
          <CardContent className="p-6">
            <View style={{ gap: 12 }}>
              <Textarea
                placeholder="Share an update, job opening, or company news..."
                value={postText}
                onChangeText={setPostText}
                style={{ minHeight: 80 }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button variant="outline" size="sm">
                    Add Image
                  </Button>
                  <Button variant="outline" size="sm">
                    Add Poll
                  </Button>
                </View>
                <Button iconLeft={<Send size={16} />} onPress={handlePost}>
                  Post
                </Button>
              </View>
            </View>
          </CardContent>
        </LinearGradient>
      </Card>

      {/* Community Posts */}
      <View style={{ gap: 12 }}>
        {communityPosts.map((post) => (
          <Card key={post.id}>
            <LinearGradient colors={['#F9FAFB', '#F1F5F9']} style={{ borderRadius: 12 }}>
              <CardContent className="p-6">
                <View style={{ gap: 12 }}>
                  {/* Author */}
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#3B82F6',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: '700' }}>{post.avatar}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontWeight: '600' }}>{post.author}</Text>
                        <Badge variant="outline">
                          <Text style={{ fontSize: 12 }}>
                            {post.type === 'hiring' ? 'Hiring' : 'Announcement'}
                          </Text>
                        </Badge>
                      </View>
                      <Text style={{ color: '#6b7280', fontSize: 12 }}>{post.timestamp}</Text>
                    </View>
                  </View>

                  {/* Content */}
                  <Text style={{ color: '#374151' }}>{post.content}</Text>

                  {/* Actions */}
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: '#E5E7EB',
                      paddingTop: 12,
                      flexDirection: 'row',
                      gap: 24,
                    }}
                  >
                    <TouchableOpacity style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <ThumbsUp size={16} color="#6b7280" />
                      <Text style={{ color: '#6b7280', fontSize: 12 }}>{post.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <MessageCircle size={16} color="#6b7280" />
                      <Text style={{ color: '#6b7280', fontSize: 12 }}>{post.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <Share size={16} color="#6b7280" />
                      <Text style={{ color: '#6b7280', fontSize: 12 }}>{post.shares}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </CardContent>
            </LinearGradient>
          </Card>
        ))}
      </View>
    </ScrollView>
  );

  const MessagesTab = () => (
    <ScrollView contentContainerStyle={{ gap: 16 }}>
      <View style={{ gap: 16 }}>
        {/* Messages list */}
        <Card>
          <CardHeader>
            <CardTitle>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Messages</Text>
                <Badge variant="destructive">
                  <Text>3 unread</Text>
                </Badge>
              </View>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <View>
              {messages.map((m, idx) => (
                <View
                  key={m.id}
                  style={{
                    padding: 16,
                    borderTopWidth: idx === 0 ? 0 : 1,
                    borderColor: '#E5E7EB',
                    backgroundColor: m.unread ? '#EFF6FF' : 'white',
                  }}
                >
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Avatar fallbackText={m.avatar} size={32} />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: '600' }}>{m.from}</Text>
                        {m.unread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6' }} />}
                      </View>
                      <Text numberOfLines={1} style={{ color: '#4b5563', marginTop: 2 }}>
                        {m.message}
                      </Text>
                      <Text style={{ color: '#9ca3af', fontSize: 12 }}>{m.timestamp}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Chat area */}
        <Card>
          <CardHeader>
            <CardTitle>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Avatar fallbackText="KA" size={32} />
                <Text>Kareem A.</Text>
              </View>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ height: 280, gap: 12 }}>
              <View style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12 }}>
                {/* bubble */}
                <View style={{ alignItems: 'flex-start' }}>
                  <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 8, maxWidth: 280 }}>
                    <Text style={{ fontSize: 14 }}>
                      Hi, I'm interested in the Vue.js position. Could you share more details about the role?
                    </Text>
                    <Text style={{ color: '#9ca3af', fontSize: 11, marginTop: 4 }}>10 min ago</Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Input
                  placeholder="Type your message..."
                  value={chatInput}
                  onChangeText={setChatInput}
                  style={{ flex: 1 }}
                />
                <Button size="sm" iconLeft={<Send size={16} />} onPress={() => setChatInput('')} />
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );

  const EventsTab = () => (
    <ScrollView contentContainerStyle={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Upcoming Events</Text>
        <Button>Create Event</Button>
      </View>

      <View style={{ gap: 12 }}>
        {events.map((event) => {
          const isCompleted = event.status === 'completed';
          const gradient = isCompleted ? ['#F9FAFB', '#F3F4F6'] : ['#EFF6FF', '#E0EAFF'];
          const borderColor = isCompleted ? '#E5E7EB' : '#BFDBFE';

          return (
            <Card key={event.id} style={{ borderColor }}>
              <LinearGradient colors={gradient} style={{ borderRadius: 12 }}>
                <CardContent className="p-6">
                  <View style={{ gap: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Badge variant={isCompleted ? 'secondary' : 'default'}>
                        <Text style={{ fontSize: 12 }}>{event.type}</Text>
                      </Badge>
                      <CalendarIcon size={18} color="#6b7280" />
                    </View>

                    <View>
                      <Text style={{ fontWeight: '700' }}>{event.title}</Text>
                      <View style={{ marginTop: 4 }}>
                        <Text style={{ color: '#4b5563', fontSize: 13 }}>
                          {event.date} at {event.time}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                          <Users size={14} color="#6b7280" />
                          <Text style={{ marginLeft: 6, color: '#4b5563', fontSize: 13 }}>
                            {event.attendees} attendees
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Button
                      variant={isCompleted ? 'secondary' : 'default'}
                      disabled={isCompleted}
                    >
                      {isCompleted ? 'Completed' : 'View Details'}
                    </Button>
                  </View>
                </CardContent>
              </LinearGradient>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );

  const AnalyticsTab = () => (
    <ScrollView contentContainerStyle={{ gap: 16 }}>
      <View style={{ gap: 12 }}>
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>Post Engagement Rate</Text>
              <Text style={{ fontWeight: '700', color: '#059669' }}>8.4%</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>Profile Views</Text>
              <Text style={{ fontWeight: '700', color: '#2563EB' }}>3,421</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>Follower Growth</Text>
              <Text style={{ fontWeight: '700', color: '#7C3AED' }}>+12%</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>Message Response Rate</Text>
              <Text style={{ fontWeight: '700', color: '#EA580C' }}>94%</Text>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Performing Content</CardTitle>
          </CardHeader>
          <CardContent style={{ gap: 8 }}>
            {[
              { t: 'Vue.js Developer Opening', m: '45 likes • 12 comments' },
              { t: 'New Office Announcement', m: '32 likes • 8 comments' },
              { t: 'Company Culture Video', m: '28 likes • 6 comments' },
            ].map((x, i) => (
              <View key={i} style={{ backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8 }}>
                <Text style={{ fontWeight: '600', fontSize: 13 }}>{x.t}</Text>
                <Text style={{ color: '#6b7280', fontSize: 13 }}>{x.m}</Text>
              </View>
            ))}
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabs={tabs}
        initialTab={0}
        tabContent={(index) => {
          switch (index) {
            case 0:
              return <CommunityTab />;
            case 1:
              return <MessagesTab />;
            case 2:
              return <EventsTab />;
            case 3:
              return <AnalyticsTab />;
            default:
              return null;
          }
        }}
      />
    </View>
  );
};

export default EmployerEngagement;
