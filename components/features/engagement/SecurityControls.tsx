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
  Shield, 
  AlertTriangle, 
  Ban, 
  Eye,
  Flag,
  Plus,
  Settings
} from 'lucide-react';

const SecurityControls = () => {
  const [flaggedKeyword, setFlaggedKeyword] = useState<string>('');
  const [blockedIp, setBlockedIp] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [banReason, setBanReason] = useState<string>('');
  const [banDuration, setBanDuration] = useState<string>('7');
  const [banType, setBanType] = useState<string>('temporary');
  const [keywordPreview, setKeywordPreview] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock security settings (in a real app, these would be stored in the database)
  const [securitySettings, setSecuritySettings] = useState({
    autoModeration: true,
    ipLogging: true,
    keywordFiltering: true,
    reportNotifications: true,
    maxMessageLength: 500,
    maxAttachmentSize: 5, // MB
    allowedFileTypes: ['jpg', 'png', 'pdf', 'doc']
  });

  // Fetch user bans
  const { data: userBans } = useQuery({
    queryKey: ['user-bans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_bans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch IP blocks
  const { data: ipBlocks } = useQuery({
    queryKey: ['ip-blocks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ip_blocks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch keyword filters
  const { data: keywordFilters } = useQuery({
    queryKey: ['keyword-filters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('keyword_filters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch flagged content with context preview
  const { data: flaggedContent } = useQuery({
    queryKey: ['flagged-content'],
    queryFn: async () => {
      const { data: flaggedChats, error: chatError } = await supabase
        .from('chat_logs')
        .select('*')
        .eq('flagged', true)
        .order('created_at', { ascending: false });

      const { data: flaggedPosts, error: postError } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('status', 'hidden')
        .order('created_at', { ascending: false });

      if (chatError || postError) {
        throw new Error('Failed to fetch flagged content');
      }

      return {
        chats: flaggedChats || [],
        posts: flaggedPosts || []
      };
    }
  });

  // Fetch abuse reports
  const { data: abuseReports } = useQuery({
    queryKey: ['abuse-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Mock banned users and IPs (in a real app, these would be stored in the database)
  const [bannedUsers] = useState([
    { id: '1', user_id: 'user-123', reason: 'Spam posting', banned_at: '2024-01-15', banned_by: 'admin' },
    { id: '2', user_id: 'user-456', reason: 'Harassment', banned_at: '2024-01-10', banned_by: 'admin' }
  ]);

  const [blockedIPs] = useState([
    { id: '1', ip_address: '192.168.1.100', reason: 'Multiple violations', blocked_at: '2024-01-15' },
    { id: '2', ip_address: '10.0.0.50', reason: 'Spam attempts', blocked_at: '2024-01-12' }
  ]);

  const [flaggedKeywords] = useState([
    'spam', 'fake', 'scam', 'phishing', 'inappropriate', 'harassment'
  ]);

  // Ban user mutation with duration and type
  const banUserMutation = useMutation({
    mutationFn: async (banData: { 
      user_id: string; 
      reason: string; 
      ban_type: string; 
      duration?: number; 
    }) => {
      let expires_at = null;
      if (banData.ban_type === 'temporary' && banData.duration) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + banData.duration);
        expires_at = expiryDate.toISOString();
      }

      const { data, error } = await supabase
        .from('user_bans')
        .insert({
          user_id: banData.user_id,
          banned_by: 'admin', // Replace with actual admin ID
          reason: banData.reason,
          ban_type: banData.ban_type,
          expires_at
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "User Banned",
        description: "User has been banned from the platform."
      });
      setSelectedUserId('');
      setBanReason('');
      queryClient.invalidateQueries({ queryKey: ['user-bans'] });
    }
  });

  // Add keyword filter mutation
  const addKeywordMutation = useMutation({
    mutationFn: async (keywordData: { keyword: string; action: string }) => {
      const { data, error } = await supabase
        .from('keyword_filters')  
        .insert(keywordData);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Keyword Added",
        description: "Keyword has been added to the filter list."
      });
      setFlaggedKeyword('');
      queryClient.invalidateQueries({ queryKey: ['keyword-filters'] });
    }
  });

  // Block IP mutation
  const blockIpMutation = useMutation({
    mutationFn: async (ipData: { ip_address: string; reason: string }) => {
      const { data, error } = await supabase
        .from('ip_blocks')
        .insert({
          ...ipData,
          blocked_by: 'admin' // Replace with actual admin ID
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "IP Blocked",
        description: "IP address has been blocked."
      });
      setBlockedIp('');
      queryClient.invalidateQueries({ queryKey: ['ip-blocks'] });
    }
  });

  // Handle report resolution
  const resolveReport = async (reportId: string, action: string) => {
    const { error } = await supabase
      .from('chat_reports')
      .update({
        status: 'resolved',
        action_taken: action,
        reviewed_by: 'admin',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', reportId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to resolve report.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Report Resolved",
        description: `Report has been marked as ${action}.`
      });
      queryClient.invalidateQueries({ queryKey: ['abuse-reports'] });
    }
  };

  // Remove keyword filter
  const removeKeywordFilter = async (keywordId: string) => {
    const { error } = await supabase
      .from('keyword_filters')
      .delete()
      .eq('id', keywordId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove keyword filter.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Keyword Removed",
        description: "Keyword filter has been removed."
      });
      queryClient.invalidateQueries({ queryKey: ['keyword-filters'] });
    }
  };

  // Unban user
  const unbanUser = async (banId: string) => {
    const { error } = await supabase
      .from('user_bans')
      .delete()
      .eq('id', banId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to unban user.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "User Unbanned",
        description: "User has been unbanned."
      });
      queryClient.invalidateQueries({ queryKey: ['user-bans'] });
    }
  };

  // Check IP reputation (mock function)
  const checkIpReputation = async (ip: string) => {
    // In a real app, this would integrate with IP reputation services
    const mockReputations = ['good', 'suspicious', 'malicious'];
    const reputation = mockReputations[Math.floor(Math.random() * mockReputations.length)];
    
    toast({
      title: "IP Reputation Check",
      description: `IP ${ip} has ${reputation} reputation.`,
      variant: reputation === 'malicious' ? 'destructive' : 'default'
    });
  };

  const generateKeywordPreview = (keyword: string) => {
    if (!keyword) return;
    
    // Mock preview of content that would be flagged
    const mockContent = [
      `This is ${keyword} content that would be flagged...`,
      `User posted: "Check out this ${keyword} offer!"`,
      `Message contains: "${keyword}" and other suspicious terms`
    ];
    
    setKeywordPreview(mockContent[Math.floor(Math.random() * mockContent.length)]);
  };

  const updateSecuritySetting = (key: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Settings Updated",
      description: "Security settings have been updated."
    });
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {abuseReports?.filter(r => r.status === 'pending').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(flaggedContent?.chats.length || 0) + (flaggedContent?.posts.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Chats and posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bannedUsers.length}</div>
            <p className="text-xs text-muted-foreground">Active bans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockedIPs.length}</div>
            <p className="text-xs text-muted-foreground">IP addresses</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Abuse Reports</TabsTrigger>
          <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          <TabsTrigger value="bans">User Management</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abuse Reports Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {abuseReports?.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">Report: {report.report_reason}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Reported by: {report.reported_by}
                        </p>
                        {report.additional_details && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Details: {report.additional_details}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(report.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          report.status === 'pending' ? 'destructive' :
                          report.status === 'resolved' ? 'default' : 'secondary'
                        }>
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {report.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => resolveReport(report.id, 'warning_issued')}
                        >
                          Issue Warning
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveReport(report.id, 'content_removed')}
                        >
                          Remove Content
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => resolveReport(report.id, 'user_banned')}
                        >
                          Ban User
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveReport(report.id, 'dismissed')}
                        >
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={flaggedKeyword}
                      onChange={(e) => setFlaggedKeyword(e.target.value)}
                      placeholder="Add keyword to flag"
                    />
                    <Button
                      onClick={() => {
                        if (flaggedKeyword.trim()) {
                          setFlaggedKeyword('');
                          toast({
                            title: "Keyword Added",
                            description: "Keyword has been added to the flag list."
                          });
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {flaggedKeywords.map((keyword, index) => (
                      <Badge key={index} variant="destructive">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flagged Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Flagged Chat Messages</span>
                    <Badge variant="secondary">{flaggedContent?.chats.length || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Hidden Forum Posts</span>
                    <Badge variant="secondary">{flaggedContent?.posts.length || 0}</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Review All Flagged Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Bans</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
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
                          <Label htmlFor="user-id">User ID</Label>
                          <Input
                            id="user-id"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            placeholder="Enter user ID to ban"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ban-reason">Reason</Label>
                          <Textarea
                            id="ban-reason"
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            placeholder="Enter reason for ban"
                          />
                        </div>
                        <Button
                          onClick={() => banUserMutation.mutate({
                            user_id: selectedUserId,
                            reason: banReason,
                            ban_type: banType,
                            duration: parseInt(banDuration)
                          })}
                          disabled={!selectedUserId || !banReason || banUserMutation.isPending}
                          className="w-full"
                          variant="destructive"
                        >
                          Ban User
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bannedUsers.map((ban) => (
                    <div key={ban.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{ban.user_id}</p>
                        <p className="text-sm text-muted-foreground">{ban.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          Banned: {ban.banned_at}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Unban
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>IP Blocks</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Shield className="h-4 w-4 mr-2" />
                        Block IP
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Block IP Address</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="ip-address">IP Address</Label>
                          <Input
                            id="ip-address"
                            value={blockedIp}
                            onChange={(e) => setBlockedIp(e.target.value)}
                            placeholder="Enter IP address to block"
                          />
                        </div>
                        <Button
                          onClick={() => {
                            setBlockedIp('');
                            toast({
                              title: "IP Blocked",
                              description: "IP address has been blocked."
                            });
                          }}
                          disabled={!blockedIp}
                          className="w-full"
                          variant="destructive"
                        >
                          Block IP
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blockedIPs.map((block) => (
                    <div key={block.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{block.ip_address}</p>
                        <p className="text-sm text-muted-foreground">{block.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          Blocked: {block.blocked_at}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Security & Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Moderation</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically flag suspicious content
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.autoModeration}
                    onCheckedChange={(checked) => updateSecuritySetting('autoModeration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">IP Address Logging</h4>
                    <p className="text-sm text-muted-foreground">
                      Log IP addresses for security monitoring
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.ipLogging}
                    onCheckedChange={(checked) => updateSecuritySetting('ipLogging', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Keyword Filtering</h4>
                    <p className="text-sm text-muted-foreground">
                      Filter messages containing flagged keywords
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.keywordFiltering}
                    onCheckedChange={(checked) => updateSecuritySetting('keywordFiltering', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Report Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Send notifications for new abuse reports
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.reportNotifications}
                    onCheckedChange={(checked) => updateSecuritySetting('reportNotifications', checked)}
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Message Limits</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-length">Max Message Length</Label>
                      <Input
                        id="max-length"
                        type="number"
                        value={securitySettings.maxMessageLength}
                        onChange={(e) => updateSecuritySetting('maxMessageLength', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-attachment">Max Attachment Size (MB)</Label>
                      <Input
                        id="max-attachment"
                        type="number"
                        value={securitySettings.maxAttachmentSize}
                        onChange={(e) => updateSecuritySetting('maxAttachmentSize', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityControls;
