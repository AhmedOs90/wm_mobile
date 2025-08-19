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
  MessageCircle, 
  Users, 
  Eye, 
  ThumbsUp,
  Plus,
  Edit,
  Trash2,
  Pin,
  Tag
} from 'lucide-react';

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
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Forum categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Published: {posts?.filter(p => p.status === 'published').length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Posts</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts?.filter(p => p.status === 'pending').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Need review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Badges</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBadges?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Badges issued</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories & Control</TabsTrigger>
          <TabsTrigger value="moderation">Post Moderation</TabsTrigger>
          <TabsTrigger value="badges">User Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Forum Categories</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                          id="category-name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter category name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-desc">Description</Label>
                        <Textarea
                          id="category-desc"
                          value={newCategoryDesc}
                          onChange={(e) => setNewCategoryDesc(e.target.value)}
                          placeholder="Enter category description"
                        />
                      </div>
                      <Button
                        onClick={() => createCategoryMutation.mutate({
                          name: newCategoryName,
                          description: newCategoryDesc
                        })}
                        disabled={!newCategoryName || createCategoryMutation.isPending}
                        className="w-full"
                      >
                        Create Category
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories?.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {category.is_pinned && (
                        <Badge variant="default">Pinned</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Post Moderation Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts?.map((post) => (
                  <div key={post.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {post.content?.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{post.status}</Badge>
                          {post.is_pinned && (
                            <Badge variant="default">Pinned</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {post.views_count} views • {post.likes_count} likes
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePinPost(post.id, post.is_pinned)}
                        >
                          <Pin className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={post.status === 'published' ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => togglePostStatus(
                            post.id, 
                            post.status === 'published' ? 'hidden' : 'published'
                          )}
                        >
                          {post.status === 'published' ? 'Hide' : 'Publish'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Badge Assignment</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Badge
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign User Badge</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="user-id">User ID</Label>
                        <Input
                          id="user-id"
                          value={selectedUserId}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                          placeholder="Enter user ID"
                        />
                      </div>
                      <div>
                        <Label htmlFor="badge-type">Badge Type</Label>
                        <Select value={badgeType} onValueChange={setBadgeType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="verified_employer">Verified Employer</SelectItem>
                            <SelectItem value="top_contributor">Top Contributor</SelectItem>
                            <SelectItem value="mentor">Mentor</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                            <SelectItem value="helper">Helper</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="badge-name">Badge Name</Label>
                        <Input
                          id="badge-name"
                          value={badgeName}
                          onChange={(e) => setBadgeName(e.target.value)}
                          placeholder="Enter badge display name"
                        />
                      </div>
                      <Button
                        onClick={() => assignBadgeMutation.mutate({
                          user_id: selectedUserId,
                          badge_type: badgeType,
                          badge_name: badgeName,
                          badge_description: `${badgeType.replace('_', ' ')} badge`
                        })}
                        disabled={!selectedUserId || !badgeName || assignBadgeMutation.isPending}
                        className="w-full"
                      >
                        Assign Badge
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userBadges?.map((badge) => (
                  <div key={badge.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{badge.badge_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        User: {badge.user_id} • Type: {badge.badge_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Issued: {new Date(badge.issued_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">{badge.badge_type}</Badge>
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

export default ForumManagement;
