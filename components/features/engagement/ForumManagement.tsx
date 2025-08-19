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
  MessageCircle, 
  Users, 
  Eye, 
  ThumbsUp,
  Plus,
  Edit,
  Trash2,
  Pin,
  Tag
} from 'lucide-react-native';

const ForumManagement = () => {
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryDesc, setNewCategoryDesc] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [badgeType, setBadgeType] = useState<string>('verified_employer');
  const [badgeName, setBadgeName] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch forum categories
  const { data: categories } = useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch forum posts
  const { data: posts } = useQuery({
    queryKey: ['forum-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch user badges
  const { data: userBadges } = useQuery({
    queryKey: ['user-badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .order('issued_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: { name: string; description: string }) => {
      const { data, error } = await supabase
        .from('forum_categories')
        .insert(categoryData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Category Created",
        description: "New forum category has been created successfully."
      });
      setNewCategoryName('');
      setNewCategoryDesc('');
      queryClient.invalidateQueries({ queryKey: ['forum-categories'] });
    }
  });

  // Assign badge mutation
  const assignBadgeMutation = useMutation({
    mutationFn: async (badgeData: {
      user_id: string;
      badge_type: string;
      badge_name: string;
      badge_description: string;
    }) => {
      const { data, error } = await supabase
        .from('user_badges')
        .insert({
          ...badgeData,
          issued_by: 'admin' // Replace with actual admin ID
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Badge Assigned",
        description: "User badge has been assigned successfully."
      });
      setSelectedUserId('');
      setBadgeName('');
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
    }
  });

  // Toggle post status
  const togglePostStatus = async (postId: string, newStatus: string) => {
    const { error } = await supabase
      .from('forum_posts')
      .update({ status: newStatus })
      .eq('id', postId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update post status.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Post Updated",
        description: `Post has been ${newStatus}.`
      });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    }
  };

  // Pin/unpin post
  const togglePinPost = async (postId: string, isPinned: boolean) => {
    const { error } = await supabase
      .from('forum_posts')
      .update({ is_pinned: !isPinned })
      .eq('id', postId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update post pin status.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Post Updated",
        description: `Post has been ${!isPinned ? 'pinned' : 'unpinned'}.`
      });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ gap: 24, padding: 16 }}>
        {/* Overview Cards */}
        <View style={{ gap: 16 }}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Total Categories</CardTitle>
              <Tag size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{categories?.length || 0}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Forum categories</Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Total Posts</CardTitle>
              <MessageCircle size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{posts?.length || 0}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                Published: {posts?.filter(p => p.status === 'published').length || 0}
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Pending Posts</CardTitle>
              <Eye size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
                {posts?.filter(p => p.status === 'pending').length || 0}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Need review</Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>User Badges</CardTitle>
              <Users size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{userBadges?.length || 0}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Badges issued</Text>
            </CardContent>
          </Card>
        </View>

        <Tabs
          tabs={['Categories & Control', 'Post Moderation', 'User Badges']}
          initialTab={0}
          tabContent={(activeIndex) => {
            if (activeIndex === 0) {
              // CATEGORIES
              return (
                <Card>
                  <CardHeader>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <CardTitle>Forum Categories</CardTitle>
                      <ModalDialog
                        title="Create New Category"
                        trigger={
                          <Button>
                            <Plus size={16} />
                            Add Category
                          </Button>
                        }
                      >
                        <View style={{ gap: 16 }}>
                          <View>
                            <Label>Category Name</Label>
                            <Input
                              value={newCategoryName}
                              onChangeText={setNewCategoryName}
                              placeholder="Enter category name"
                            />
                          </View>
                          <View>
                            <Label>Description</Label>
                            <Textarea
                              value={newCategoryDesc}
                              onChangeText={setNewCategoryDesc}
                              placeholder="Enter category description"
                            />
                          </View>
                          <Button
                            onPress={() => createCategoryMutation.mutate({
                              name: newCategoryName,
                              description: newCategoryDesc
                            })}
                            disabled={!newCategoryName || createCategoryMutation.isPending}
                          >
                            Create Category
                          </Button>
                        </View>
                      </ModalDialog>
                    </View>
                  </CardHeader>
                  <CardContent>
                    <View style={{ gap: 12 }}>
                      {categories?.map((category) => (
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
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            {category.is_pinned && (
                              <Badge variant="default">Pinned</Badge>
                            )}
                            <Button 
                              variant="outline"
                              iconLeft={<Edit size={16} color="#111827" />}
                            >
                              {/* Icon only */}
                            </Button>
                          </View>
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              );
            }

            if (activeIndex === 1) {
              // POST MODERATION
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>Post Moderation Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={{ gap: 16 }}>
                      {posts?.map((post) => (
                        <View 
                          key={post.id} 
                          style={{ 
                            padding: 16, 
                            borderWidth: 1, 
                            borderColor: '#e5e7eb', 
                            borderRadius: 8 
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontWeight: '500' }}>{post.title}</Text>
                              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                                {post.content?.substring(0, 100)}...
                              </Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                <Badge variant="outline">{post.status}</Badge>
                                {post.is_pinned && (
                                  <Badge variant="default">Pinned</Badge>
                                )}
                                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                                  {post.views_count} views • {post.likes_count} likes
                                </Text>
                              </View>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                              <Button
                                variant="outline"
                                onPress={() => togglePinPost(post.id, post.is_pinned)}
                                iconLeft={<Pin size={16} color="#111827" />}
                              >
                                {/* Icon only */}
                              </Button>
                              <Button
                                variant={post.status === 'published' ? 'destructive' : 'default'}
                                onPress={() => togglePostStatus(
                                  post.id, 
                                  post.status === 'published' ? 'hidden' : 'published'
                                )}
                              >
                                {post.status === 'published' ? 'Hide' : 'Publish'}
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

            if (activeIndex === 2) {
              // USER BADGES
              return (
                <Card>
                  <CardHeader>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <CardTitle>User Badge Assignment</CardTitle>
                      <ModalDialog
                        title="Assign User Badge"
                        trigger={
                          <Button>
                            <Plus size={16} />
                            Assign Badge
                          </Button>
                        }
                      >
                        <View style={{ gap: 16 }}>
                          <View>
                            <Label>User ID</Label>
                            <Input
                              value={selectedUserId}
                              onChangeText={setSelectedUserId}
                              placeholder="Enter user ID"
                            />
                          </View>
                          <View>
                            <Label>Badge Type</Label>
                            <Select 
                              value={badgeType} 
                              onValueChange={setBadgeType}
                              options={[
                                { label: 'Verified Employer', value: 'verified_employer' },
                                { label: 'Top Contributor', value: 'top_contributor' },
                                { label: 'Mentor', value: 'mentor' },
                                { label: 'Expert', value: 'expert' },
                                { label: 'Helper', value: 'helper' }
                              ]}
                            />
                          </View>
                          <View>
                            <Label>Badge Name</Label>
                            <Input
                              value={badgeName}
                              onChangeText={setBadgeName}
                              placeholder="Enter badge display name"
                            />
                          </View>
                          <Button
                            onPress={() => assignBadgeMutation.mutate({
                              user_id: selectedUserId,
                              badge_type: badgeType,
                              badge_name: badgeName,
                              badge_description: `${badgeType.replace('_', ' ')} badge`
                            })}
                            disabled={!selectedUserId || !badgeName || assignBadgeMutation.isPending}
                          >
                            Assign Badge
                          </Button>
                        </View>
                      </ModalDialog>
                    </View>
                  </CardHeader>
                  <CardContent>
                    <View style={{ gap: 12 }}>
                      {userBadges?.map((badge) => (
                        <View 
                          key={badge.id} 
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
                            <Text style={{ fontWeight: '500' }}>{badge.badge_name}</Text>
                            <Text style={{ fontSize: 14, color: '#6b7280' }}>
                              User: {badge.user_id} • Type: {badge.badge_type}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>
                              Issued: {new Date(badge.issued_at).toLocaleDateString()}
                            </Text>
                          </View>
                          <Badge variant="secondary">{badge.badge_type}</Badge>
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

export default ForumManagement;
