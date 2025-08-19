import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  MessageSquare, 
  Users, 
  Bell,
  Shield,
  Save
} from 'lucide-react';

const EngagementSettings = () => {
  const { toast } = useToast();

  // Platform settings state
  const [platformSettings, setPlatformSettings] = useState({
    forumEnabled: true,
    chatEnabled: true,
    pollsEnabled: true,
    eventsEnabled: true,
    gamificationEnabled: true,
    notificationsEnabled: true
  });

  // Chat settings
  const [chatSettings, setChatSettings] = useState({
    maxMessageLength: 500,
    allowAttachments: true,
    allowedFileTypes: 'jpg,png,pdf,doc',
    maxFileSize: 5,
    rateLimitMessages: 10,
    rateLimitWindow: 60
  });

  // Forum settings
  const [forumSettings, setForumSettings] = useState({
    requireApproval: false,
    allowAnonymousPosts: false,
    maxPostLength: 2000,
    maxTitleLength: 200,
    allowTags: true,
    maxTagsPerPost: 5
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    digestFrequency: 'daily',
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });

  const saveSettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "Settings Saved",
      description: "All engagement settings have been updated successfully."
    });
  };

  const resetToDefaults = () => {
    setPlatformSettings({
      forumEnabled: true,
      chatEnabled: true,
      pollsEnabled: true,
      eventsEnabled: true,
      gamificationEnabled: true,
      notificationsEnabled: true
    });

    setChatSettings({
      maxMessageLength: 500,
      allowAttachments: true,
      allowedFileTypes: 'jpg,png,pdf,doc',
      maxFileSize: 5,
      rateLimitMessages: 10,
      rateLimitWindow: 60
    });

    setForumSettings({
      requireApproval: false,
      allowAnonymousPosts: false,
      maxPostLength: 2000,
      maxTitleLength: 200,
      allowTags: true,
      maxTagsPerPost: 5
    });

    setNotificationSettings({
      emailNotifications: true,
      pushNotifications: true,
      inAppNotifications: true,
      digestFrequency: 'daily',
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00'
    });

    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Engagement Settings</h2>
          <p className="text-muted-foreground">Configure platform features and limits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Platform Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Forum System</h4>
                <p className="text-sm text-muted-foreground">
                  Enable community forums and discussions
                </p>
              </div>
              <Switch
                checked={platformSettings.forumEnabled}
                onCheckedChange={(checked) => 
                  setPlatformSettings(prev => ({ ...prev, forumEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Real-time Chat</h4>
                <p className="text-sm text-muted-foreground">
                  Allow direct messaging between users
                </p>
              </div>
              <Switch
                checked={platformSettings.chatEnabled}
                onCheckedChange={(checked) => 
                  setPlatformSettings(prev => ({ ...prev, chatEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Polls & Surveys</h4>
                <p className="text-sm text-muted-foreground">
                  Enable community polls and surveys
                </p>
              </div>
              <Switch
                checked={platformSettings.pollsEnabled}
                onCheckedChange={(checked) => 
                  setPlatformSettings(prev => ({ ...prev, pollsEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Community Events</h4>
                <p className="text-sm text-muted-foreground">
                  Allow event creation and management
                </p>
              </div>
              <Switch
                checked={platformSettings.eventsEnabled}
                onCheckedChange={(checked) => 
                  setPlatformSettings(prev => ({ ...prev, eventsEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Gamification</h4>
                <p className="text-sm text-muted-foreground">
                  Enable points, badges, and leaderboards
                </p>
              </div>
              <Switch
                checked={platformSettings.gamificationEnabled}
                onCheckedChange={(checked) => 
                  setPlatformSettings(prev => ({ ...prev, gamificationEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Enable notification system
                </p>
              </div>
              <Switch
                checked={platformSettings.notificationsEnabled}
                onCheckedChange={(checked) => 
                  setPlatformSettings(prev => ({ ...prev, notificationsEnabled: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="max-message-length">Max Message Length</Label>
              <Input
                id="max-message-length"
                type="number"
                value={chatSettings.maxMessageLength}
                onChange={(e) => 
                  setChatSettings(prev => ({ ...prev, maxMessageLength: parseInt(e.target.value) }))
                }
              />
            </div>

            <div>
              <Label htmlFor="max-file-size">Max File Size (MB)</Label>
              <Input
                id="max-file-size"
                type="number"
                value={chatSettings.maxFileSize}
                onChange={(e) => 
                  setChatSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))
                }
              />
            </div>

            <div>
              <Label htmlFor="rate-limit-messages">Rate Limit (Messages)</Label>
              <Input
                id="rate-limit-messages"
                type="number"
                value={chatSettings.rateLimitMessages}
                onChange={(e) => 
                  setChatSettings(prev => ({ ...prev, rateLimitMessages: parseInt(e.target.value) }))
                }
              />
            </div>

            <div>
              <Label htmlFor="rate-limit-window">Rate Limit Window (Seconds)</Label>
              <Input
                id="rate-limit-window"
                type="number"
                value={chatSettings.rateLimitWindow}
                onChange={(e) => 
                  setChatSettings(prev => ({ ...prev, rateLimitWindow: parseInt(e.target.value) }))
                }
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="allowed-file-types">Allowed File Types</Label>
              <Textarea
                id="allowed-file-types"
                value={chatSettings.allowedFileTypes}
                onChange={(e) => 
                  setChatSettings(prev => ({ ...prev, allowedFileTypes: e.target.value }))
                }
                placeholder="Comma-separated list: jpg,png,pdf,doc"
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Allow File Attachments</h4>
                  <p className="text-sm text-muted-foreground">
                    Users can attach files to messages
                  </p>
                </div>
                <Switch
                  checked={chatSettings.allowAttachments}
                  onCheckedChange={(checked) => 
                    setChatSettings(prev => ({ ...prev, allowAttachments: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forum Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Forum Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="max-post-length">Max Post Length</Label>
              <Input
                id="max-post-length"
                type="number"
                value={forumSettings.maxPostLength}
                onChange={(e) => 
                  setForumSettings(prev => ({ ...prev, maxPostLength: parseInt(e.target.value) }))
                }
              />
            </div>

            <div>
              <Label htmlFor="max-title-length">Max Title Length</Label>
              <Input
                id="max-title-length"
                type="number"
                value={forumSettings.maxTitleLength}
                onChange={(e) => 
                  setForumSettings(prev => ({ ...prev, maxTitleLength: parseInt(e.target.value) }))
                }
              />
            </div>

            <div>
              <Label htmlFor="max-tags">Max Tags per Post</Label>
              <Input
                id="max-tags"
                type="number"
                value={forumSettings.maxTagsPerPost}
                onChange={(e) => 
                  setForumSettings(prev => ({ ...prev, maxTagsPerPost: parseInt(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Require Post Approval</h4>
                  <p className="text-sm text-muted-foreground">
                    Posts need admin approval before publishing
                  </p>
                </div>
                <Switch
                  checked={forumSettings.requireApproval}
                  onCheckedChange={(checked) => 
                    setForumSettings(prev => ({ ...prev, requireApproval: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Allow Anonymous Posts</h4>
                  <p className="text-sm text-muted-foreground">
                    Users can post without showing their name
                  </p>
                </div>
                <Switch
                  checked={forumSettings.allowAnonymousPosts}
                  onCheckedChange={(checked) => 
                    setForumSettings(prev => ({ ...prev, allowAnonymousPosts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Allow Tags</h4>
                  <p className="text-sm text-muted-foreground">
                    Users can add tags to their posts
                  </p>
                </div>
                <Switch
                  checked={forumSettings.allowTags}
                  onCheckedChange={(checked) => 
                    setForumSettings(prev => ({ ...prev, allowTags: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Send browser/mobile push notifications
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">In-App Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Show notifications within the platform
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.inAppNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, inAppNotifications: checked }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="digest-frequency">Email Digest Frequency</Label>
                <Select 
                  value={notificationSettings.digestFrequency} 
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({ ...prev, digestFrequency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quiet-hours-start">Quiet Hours Start</Label>
                <Input
                  id="quiet-hours-start"
                  type="time"
                  value={notificationSettings.quietHoursStart}
                  onChange={(e) => 
                    setNotificationSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="quiet-hours-end">Quiet Hours End</Label>
                <Input
                  id="quiet-hours-end"
                  type="time"
                  value={notificationSettings.quietHoursEnd}
                  onChange={(e) => 
                    setNotificationSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementSettings;
