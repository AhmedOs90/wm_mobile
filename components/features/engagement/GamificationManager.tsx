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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Award, 
  Target, 
  TrendingUp,
  Edit,
  Plus,
  Crown,
  Star
} from 'lucide-react';

const GamificationManager = () => {
  const [newActionType, setNewActionType] = useState<string>('');
  const [newPoints, setNewPoints] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch gamification settings
  const { data: gamificationSettings } = useQuery({
    queryKey: ['gamification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gamification_settings')
        .select('*')
        .order('action_type');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch user engagement data
  const { data: userEngagement } = useQuery({
    queryKey: ['user-engagement'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_engagement')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  // Create/update gamification setting
  const updateSettingMutation = useMutation({
    mutationFn: async (settingData: {
      action_type: string;
      points_awarded: number;
      description: string;
      is_active: boolean;
    }) => {
      const { data, error } = await supabase
        .from('gamification_settings')
        .upsert(settingData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Gamification settings have been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['gamification-settings'] });
    }
  });

  // Create new setting
  const createSettingMutation = useMutation({
    mutationFn: async (settingData: {
      action_type: string;
      points_awarded: number;
      description: string;
    }) => {
      const { data, error } = await supabase
        .from('gamification_settings')
        .insert({
          ...settingData,
          is_active: true
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Setting Created",
        description: "New gamification setting has been created."
      });
      setNewActionType('');
      setNewPoints('');
      setNewDescription('');
      queryClient.invalidateQueries({ queryKey: ['gamification-settings'] });
    }
  });

  // Toggle setting status
  const toggleSetting = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('gamification_settings')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update setting status.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Setting Updated",
        description: `Setting has been ${!currentStatus ? 'enabled' : 'disabled'}.`
      });
      queryClient.invalidateQueries({ queryKey: ['gamification-settings'] });
    }
  };

  // Get rank based on points
  const getRank = (points: number) => {
    if (points >= 1000) return { name: 'Expert', color: 'bg-yellow-500' };
    if (points >= 500) return { name: 'Professional', color: 'bg-blue-500' };
    if (points >= 200) return { name: 'Contributor', color: 'bg-green-500' };
    if (points >= 50) return { name: 'Active', color: 'bg-orange-500' };
    return { name: 'Newcomer', color: 'bg-gray-500' };
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gamificationSettings?.filter(s => s.is_active).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {gamificationSettings?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userEngagement?.length || 0}</div>
            <p className="text-xs text-muted-foreground">With engagement scores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userEngagement?.reduce((sum, user) => sum + user.total_points, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Distributed to users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top User Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userEngagement?.[0]?.total_points || 0}
            </div>
            <p className="text-xs text-muted-foreground">Highest scoring user</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Points Configuration</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard Management</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Points System Configuration</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Points Rule</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="action-type">Action Type</Label>
                        <Input
                          id="action-type"
                          value={newActionType}
                          onChange={(e) => setNewActionType(e.target.value)}
                          placeholder="e.g., comment_post, share_job"
                        />
                      </div>
                      <div>
                        <Label htmlFor="points">Points Awarded</Label>
                        <Input
                          id="points"
                          type="number"
                          value={newPoints}
                          onChange={(e) => setNewPoints(e.target.value)}
                          placeholder="Enter points value"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          placeholder="Describe when this rule applies"
                        />
                      </div>
                      <Button
                        onClick={() => createSettingMutation.mutate({
                          action_type: newActionType,
                          points_awarded: parseInt(newPoints),
                          description: newDescription
                        })}
                        disabled={!newActionType || !newPoints || createSettingMutation.isPending}
                        className="w-full"
                      >
                        Create Rule
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gamificationSettings?.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium capitalize">
                          {setting.action_type.replace('_', ' ')}
                        </h4>
                        <Badge variant="secondary">
                          {setting.points_awarded} pts
                        </Badge>
                        <Badge variant={setting.is_active ? 'default' : 'outline'}>
                          {setting.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {setting.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={setting.is_active}
                        onCheckedChange={() => toggleSetting(setting.id, setting.is_active)}
                      />
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

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                User Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userEngagement?.map((user, index) => {
                  const rank = getRank(user.total_points);
                  
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                          {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                          {index === 1 && <Trophy className="h-4 w-4 text-gray-400" />}
                          {index === 2 && <Award className="h-4 w-4 text-orange-500" />}
                          {index > 2 && <span className="text-sm font-medium">#{index + 1}</span>}
                        </div>
                        <div>
                          <h4 className="font-medium">User {user.user_id}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`h-2 w-2 rounded-full ${rank.color}`}></div>
                            <span className="text-sm text-muted-foreground">{rank.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{user.total_points} pts</div>
                        <div className="text-sm text-muted-foreground">
                          {user.forum_posts} posts • {user.forum_replies} replies
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {userEngagement?.reduce((sum, user) => sum + user.forum_posts, 0) || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {userEngagement?.reduce((sum, user) => sum + user.forum_replies, 0) || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Replies</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {userEngagement?.reduce((sum, user) => sum + user.messages_sent, 0) || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Messages Sent</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {userEngagement?.reduce((sum, user) => sum + user.events_attended, 0) || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Events Attended</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationManager;
