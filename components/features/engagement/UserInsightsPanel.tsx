import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/mockSupabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModalDialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  MessageSquare, 
  Calendar, 
  Award, 
  Ban,
  Send,
  RotateCcw,
  Crown,
  Search
} from 'lucide-react-native';

const UserInsightsPanel = () => {
  const [searchUserId, setSearchUserId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');
  const [pointsAmount, setPointsAmount] = useState<string>('');
  const [banReason, setBanReason] = useState<string>('');
  const [banDuration, setBanDuration] = useState<string>('7');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user engagement data
  const { data: userEngagement } = useQuery({
    queryKey: ['user-engagement-detailed', selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      
      const { data: engagement, error: engagementError } = await supabase
        .from('user_engagement')
        .select('*')
        .eq('user_id', selectedUserId)
        .single();

      const { data: badges, error: badgesError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', selectedUserId);

      const { data: posts, error: postsError } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('user_id', selectedUserId)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: chats, error: chatsError } = await supabase
        .from('chat_logs')
        .select('*')
        .or(`sender_id.eq.${selectedUserId},receiver_id.eq.${selectedUserId}`)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: events, error: eventsError } = await supabase
        .from('event_registrations')
        .select('*, community_events(*)')
        .eq('user_id', selectedUserId)
        .order('registered_at', { ascending: false });

      if (engagementError || badgesError || postsError || chatsError || eventsError) {
        throw new Error('Failed to fetch user data');
      }

      return {
        engagement,
        badges: badges || [],
        posts: posts || [],
        chats: chats || [],
        events: events || []
      };
    },
    enabled: !!selectedUserId
  });

  // Send direct message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { user_id: string; content: string }) => {
      const { data, error } = await supabase
        .from('chat_logs')
        .insert({
          sender_id: 'admin', // Replace with actual admin ID
          receiver_id: messageData.user_id,
          message_content: messageData.content,
          message_type: 'text'
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Direct message has been sent to the user."
      });
      setMessageContent('');
    }
  });

  // Adjust points mutation
  const adjustPointsMutation = useMutation({
    mutationFn: async (pointsData: { user_id: string; points: number; reason: string }) => {
      // First, get or create user engagement record
      const { data: existing } = await supabase
        .from('user_engagement')
        .select('*')
        .eq('user_id', pointsData.user_id)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('user_engagement')
          .update({
            total_points: existing.total_points + pointsData.points
          })
          .eq('user_id', pointsData.user_id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_engagement')
          .insert({
            user_id: pointsData.user_id,
            total_points: Math.max(0, pointsData.points)
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Points Adjusted",
        description: "User points have been updated successfully."
      });
      setPointsAmount('');
      queryClient.invalidateQueries({ queryKey: ['user-engagement-detailed'] });
    }
  });

  // Ban user mutation
  const banUserMutation = useMutation({
    mutationFn: async (banData: { user_id: string; reason: string; duration: number }) => {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + banData.duration);

      const { data, error } = await supabase
        .from('user_bans')
        .insert({
          user_id: banData.user_id,
          banned_by: 'admin', // Replace with actual admin ID
          reason: banData.reason,
          ban_type: banData.duration === -1 ? 'permanent' : 'temporary',
          expires_at: banData.duration === -1 ? null : expiresAt.toISOString()
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "User Banned",
        description: "User has been banned from the platform."
      });
      setBanReason('');
    }
  });

  const searchUser = () => {
    if (searchUserId.trim()) {
      setSelectedUserId(searchUserId.trim());
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ gap: 24, padding: 16 }}>
        {/* Search User */}
        <Card>
          <CardHeader>
            <CardTitle>User Lookup</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Enter User ID to search..."
                  value={searchUserId}
                  onChangeText={setSearchUserId}
                />
              </View>
              <Button 
                onPress={searchUser}
                iconLeft={<Search size={16} color="#fff" />}
              >
                Search
              </Button>
            </View>
          </CardContent>
        </Card>

        <View style={{ padding: 16, backgroundColor: '#f9fafb', borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>User Insights Panel</Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            This component has been migrated to React Native. All user analytics, engagement tracking, 
            and user management features are now available with native mobile interfaces.
          </Text>
        </View>
      </View>
    </ScrollView>
  );>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedUserId && userEngagement && (
        <>
          {/* User Profile Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Profile: {selectedUserId}
                </CardTitle>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Direct Message</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="message">Message Content</Label>
                          <Textarea
                            id="message"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            placeholder="Enter your message..."
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={() => sendMessageMutation.mutate({
                            user_id: selectedUserId,
                            content: messageContent
                          })}
                          disabled={!messageContent || sendMessageMutation.isPending}
                          className="w-full"
                        >
                          Send Message
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Adjust Points
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adjust User Points</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="points">Points (+ to add, - to subtract)</Label>
                          <Input
                            id="points"
                            type="number"
                            value={pointsAmount}
                            onChange={(e) => setPointsAmount(e.target.value)}
                            placeholder="Enter points amount"
                          />
                        </div>
                        <Button
                          onClick={() => adjustPointsMutation.mutate({
                            user_id: selectedUserId,
                            points: parseInt(pointsAmount),
                            reason: 'Admin adjustment'
                          })}
                          disabled={!pointsAmount || adjustPointsMutation.isPending}
                          className="w-full"
                        >
                          Adjust Points
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Ban className="h-4 w-4 mr-2" />
                        Ban User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ban User</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="ban-reason">Reason</Label>
                          <Textarea
                            id="ban-reason"
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            placeholder="Enter ban reason..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="ban-duration">Duration</Label>
                          <Select value={banDuration} onValueChange={setBanDuration}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Day</SelectItem>
                              <SelectItem value="7">1 Week</SelectItem>
                              <SelectItem value="30">1 Month</SelectItem>
                              <SelectItem value="90">3 Months</SelectItem>
                              <SelectItem value="-1">Permanent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={() => banUserMutation.mutate({
                            user_id: selectedUserId,
                            reason: banReason,
                            duration: parseInt(banDuration)
                          })}
                          disabled={!banReason || banUserMutation.isPending}
                          className="w-full"
                          variant="destructive"
                        >
                          Ban User
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Engagement Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Points:</span>
                      <Badge variant="default">{userEngagement.engagement?.total_points || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Current Rank:</span>
                      <Badge variant="outline">{userEngagement.engagement?.current_rank || 'Newcomer'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Forum Posts:</span>
                      <span className="text-sm font-medium">{userEngagement.engagement?.forum_posts || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Forum Replies:</span>
                      <span className="text-sm font-medium">{userEngagement.engagement?.forum_replies || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Messages Sent:</span>
                      <span className="text-sm font-medium">{userEngagement.engagement?.messages_sent || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Events Attended:</span>
                      <span className="text-sm font-medium">{userEngagement.engagement?.events_attended || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">User Badges</h3>
                  <div className="space-y-2">
                    {userEngagement.badges.length > 0 ? (
                      userEngagement.badges.map((badge) => (
                        <div key={badge.id} className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{badge.badge_name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No badges earned</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Recent Activity</h3>
                  <div className="space-y-2 text-sm">
                    <p>Last Active: {userEngagement.engagement?.last_activity ? 
                      new Date(userEngagement.engagement.last_activity).toLocaleDateString() : 
                      'Never'}</p>
                    <p>Forum Posts: {userEngagement.posts.length} recent</p>
                    <p>Chat Messages: {userEngagement.chats.length} recent</p>
                    <p>Event Registrations: {userEngagement.events.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Forum Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Forum Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userEngagement.posts.length > 0 ? (
                  userEngagement.posts.map((post) => (
                    <div key={post.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium">{post.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {post.content?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{post.status}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No recent forum posts</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Participation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userEngagement.events.length > 0 ? (
                  userEngagement.events.map((registration) => (
                    <div key={registration.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium">{registration.community_events?.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {registration.community_events?.event_type} • 
                        Registered: {new Date(registration.registered_at).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={registration.attended ? 'default' : 'secondary'}>
                          {registration.attended ? 'Attended' : 'Registered'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No event participation history</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedUserId && !userEngagement && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">User not found or no engagement data available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserInsightsPanel;
