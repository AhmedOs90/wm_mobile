// components/forum/ForumDiscussions.native.tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Avatar from '@/components/ui/avatar';
import {
  MessageSquare,
  Users,
  Star,
  Plus,
  Image as ImageIcon,
  BarChart3,
  Heart,
  MessageCircle,
  Flag,
  Headphones,
} from 'lucide-react-native';
import { toast } from '@/hooks/use-toast';

interface ForumCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  posts: number;
  color: string;  // kept for parity; used in inline style
  bgColor: string; // kept for parity; used via className where possible
}

interface Discussion {
  id: string;
  title: string;
  author: string;
  avatar: string;
  category: string;
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  isReported?: boolean;
}

const ForumDiscussions: React.FC = () => {
  const [isStartingDiscussion, setIsStartingDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });

  const categories: ForumCategory[] = [
    {
      id: 'general',
      title: 'General Discussion',
      description: 'Ask questions & share insights',
      icon: MessageSquare,
      posts: 245,
      color: '#2563EB', // blue-600
      bgColor: 'bg-blue-50',
    },
    {
      id: 'hiring',
      title: 'Hiring & Recruitment',
      description: 'Share job openings & tips',
      icon: Users,
      posts: 89,
      color: '#16A34A', // green-600
      bgColor: 'bg-green-50',
    },
    {
      id: 'insights',
      title: 'Industry Insights',
      description: 'Trends & market updates',
      icon: Star,
      posts: 156,
      color: '#9333EA', // purple-600
      bgColor: 'bg-purple-50',
    },
  ];

  const popularTags = ['#remote-jobs', '#cv-feedback', '#career-advice'];

  const recentDiscussions: Discussion[] = [
    {
      id: '1',
      title:
        'Looking for talented Vue.js developers to join our growing team! We offer competitive salaries and great benefits.',
      author: 'Infotech Global',
      avatar: '',
      category: 'Hiring',
      content:
        'Looking for talented Vue.js developers to join our growing team! We offer competitive salaries and great benefits.',
      timeAgo: '2 hours ago',
      likes: 24,
      comments: 8,
    },
    {
      id: '2',
      title:
        'Excited to announce our new office opening in Cairo! This means more opportunities for local talent.',
      author: 'TechCorp Solutions',
      avatar: '',
      category: 'Discussion',
      content:
        'Excited to announce our new office opening in Cairo! This means more opportunities for local talent.',
      timeAgo: '1 day ago',
      likes: 45,
      comments: 12,
    },
  ];

  const handleStartDiscussion = () => {
    if (!newDiscussion.title || !newDiscussion.content) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in the title and description to start a discussion.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate posting discussion
    toast({
      title: 'Discussion Started!',
      description: 'Your discussion has been posted successfully.',
      variant: 'default',
    });

    setNewDiscussion({ title: '', content: '', tags: [] });
    setIsStartingDiscussion(false);
  };

  const addTag = (tag: string) => {
    if (!newDiscussion.tags.includes(tag)) {
      setNewDiscussion((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tag: string) => {
    setNewDiscussion((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const initials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <View className="space-y-6">
      {/* Forum Categories */}
      <View className="gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.id} className={`${category.bgColor} border-0`}>
              <CardContent className="p-6">
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-row items-center gap-3">
                    <View className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
                      <Icon size={20} color={category.color} />
                    </View>
                    <View>
                      <Text className="font-semibold text-gray-900">{category.title}</Text>
                      <Text className="text-sm text-gray-600">{category.description}</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">{category.posts} posts</Text>
                  <Button size="sm" style={{ backgroundColor: '#111827' }}>
                    <Text style={{ color: '#fff' }}>Join Discussion</Text>
                  </Button>
                </View>
              </CardContent>
            </Card>
          );
        })}
      </View>

      {/* Start New Discussion */}
      <Card className="bg-gray-50 border-0">
        <CardContent className="p-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold flex-row items-center">
              {/* simple inline container look */}
              <Text>
                <Plus size={20} />
              </Text>{' '}
              Start a New Discussion
            </Text>
          </View>

          {!isStartingDiscussion ? (
            <Button onPress={() => setIsStartingDiscussion(true)} variant="outline">
              What would you like to discuss? Be specific and helpful...
            </Button>
          ) : (
            <View className="gap-4">
              <Input
                placeholder="Discussion title..."
                value={newDiscussion.title}
                onChangeText={(text) => setNewDiscussion((prev) => ({ ...prev, title: text }))}
              />

              <View className="flex-row flex-wrap items-center gap-2 mb-2">
                <Text className="text-sm text-gray-600"># Popular tags:</Text>
                {popularTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onPress={() => addTag(tag)}
                    style={{ height: 24, paddingHorizontal: 8 }}
                  >
                    <Text style={{ fontSize: 12 }}>{tag}</Text>
                  </Button>
                ))}
              </View>

              {newDiscussion.tags.length > 0 && (
                <View className="flex-row flex-wrap gap-2">
                  {newDiscussion.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      // allow removing tag on press
                      onTouchEnd={() => removeTag(tag)}
                    >
                      <Text>
                        {tag} ×
                      </Text>
                    </Badge>
                  ))}
                </View>
              )}

              <Textarea
                placeholder="What would you like to discuss? Be specific and helpful..."
                value={newDiscussion.content}
                onChangeText={(text) => setNewDiscussion((prev) => ({ ...prev, content: text }))}
                style={{ minHeight: 120 }}
              />

              <View className="flex-row items-center justify-between">
                <View className="flex-row gap-2">
                  <Button variant="outline" size="sm" iconLeft={<ImageIcon size={16} />}>
                    Add Image
                  </Button>
                  <Button variant="outline" size="sm" iconLeft={<BarChart3 size={16} />}>
                    Add Poll
                  </Button>
                </View>

                <View className="flex-row gap-2">
                  <Button variant="outline" onPress={() => setIsStartingDiscussion(false)}>
                    Cancel
                  </Button>
                  <Button onPress={handleStartDiscussion} iconLeft={<MessageSquare size={16} />}>
                    Start Discussion
                  </Button>
                </View>
              </View>
            </View>
          )}
        </CardContent>
      </Card>

      {/* Recent Discussions */}
      <View>
        <Text className="text-lg font-semibold mb-4">Recent Discussions</Text>

        <View className="gap-4">
          {recentDiscussions.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-6">
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-start gap-4 flex-1">
                    <Avatar uri={d.avatar} fallbackText={initials(d.author)} size={40} />

                    <View style={{ flex: 1 }}>
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="font-medium" style={{ color: '#2563EB' }}>
                          {d.author}
                        </Text>
                        <Badge variant="outline">
                          <Text style={{ fontSize: 12 }}>{d.category}</Text>
                        </Badge>
                        <Text className="text-sm text-gray-500">{d.timeAgo}</Text>
                      </View>

                      <Text className="text-gray-700 text-sm">{d.content}</Text>

                      <View className="flex-row items-center gap-3 mt-3">
                        <Button variant="ghost" size="sm" style={{ height: 32, paddingHorizontal: 8 }} iconLeft={<Heart size={12} />}>
                          {d.likes}
                        </Button>
                        <Button variant="ghost" size="sm" style={{ height: 32, paddingHorizontal: 8 }} iconLeft={<MessageCircle size={12} />}>
                          {d.comments}
                        </Button>
                        <Button variant="ghost" size="sm" style={{ height: 32, paddingHorizontal: 8 }} iconLeft={<MessageCircle size={12} />}>
                          React
                        </Button>
                        <Button variant="ghost" size="sm" style={{ height: 32, paddingHorizontal: 8 }} iconLeft={<Flag size={12} />}>
                          Report
                        </Button>
                      </View>
                    </View>
                  </View>

                  <Button variant="ghost" size="sm" iconLeft={<Headphones size={16} />}>
                    Request Support
                  </Button>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ForumDiscussions;
