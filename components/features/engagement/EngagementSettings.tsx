import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  MessageSquare, 
  Users, 
  Bell,
  Shield,
  Save
} from 'lucide-react-native';

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
    <ScrollView style={{ flex: 1 }}>
      <View style={{ gap: 24, padding: 16 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '700' }}>Engagement Settings</Text>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>Configure platform features and limits</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button variant="outline" onPress={resetToDefaults}>
              Reset to Defaults
            </Button>
            <Button 
              onPress={saveSettings}
              iconLeft={<Save size={16} color="#fff" />}
            >
              Save All Settings
            </Button>
          </View>
        </View>

        {/* Feature Toggles */}
        <Card>
          <CardHeader>
            <CardTitle style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Settings size={20} color="#111827" />
              <Text>Platform Features</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Forum System</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Enable community forums and discussions
                  </Text>
                </View>
                <Switch
                  value={platformSettings.forumEnabled}
                  onValueChange={(checked) => 
                    setPlatformSettings(prev => ({ ...prev, forumEnabled: checked }))
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Real-time Chat</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Allow direct messaging between users
                  </Text>
                </View>
                <Switch
                  value={platformSettings.chatEnabled}
                  onValueChange={(checked) => 
                    setPlatformSettings(prev => ({ ...prev, chatEnabled: checked }))
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Polls & Surveys</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Enable community polls and surveys
                  </Text>
                </View>
                <Switch
                  value={platformSettings.pollsEnabled}
                  onValueChange={(checked) => 
                    setPlatformSettings(prev => ({ ...prev, pollsEnabled: checked }))
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Community Events</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Allow event creation and management
                  </Text>
                </View>
                <Switch
                  value={platformSettings.eventsEnabled}
                  onValueChange={(checked) => 
                    setPlatformSettings(prev => ({ ...prev, eventsEnabled: checked }))
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Gamification</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Enable points, badges, and leaderboards
                  </Text>
                </View>
                <Switch
                  value={platformSettings.gamificationEnabled}
                  onValueChange={(checked) => 
                    setPlatformSettings(prev => ({ ...prev, gamificationEnabled: checked }))
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Notifications</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Enable notification system
                  </Text>
                </View>
                <Switch
                  value={platformSettings.notificationsEnabled}
                  onValueChange={(checked) => 
                    setPlatformSettings(prev => ({ ...prev, notificationsEnabled: checked }))
                  }
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Chat Settings */}
        <Card>
          <CardHeader>
            <CardTitle style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MessageSquare size={20} color="#111827" />
              <Text>Chat System Configuration</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 16 }}>
              <View>
                <Label>Max Message Length</Label>
                <Input
                  keyboardType="numeric"
                  value={chatSettings.maxMessageLength.toString()}
                  onChangeText={(text) => 
                    setChatSettings(prev => ({ ...prev, maxMessageLength: parseInt(text) || 0 }))
                  }
                />
              </View>

              <View>
                <Label>Max File Size (MB)</Label>
                <Input
                  keyboardType="numeric"
                  value={chatSettings.maxFileSize.toString()}
                  onChangeText={(text) => 
                    setChatSettings(prev => ({ ...prev, maxFileSize: parseInt(text) || 0 }))
                  }
                />
              </View>

              <View>
                <Label>Rate Limit (Messages)</Label>
                <Input
                  keyboardType="numeric"
                  value={chatSettings.rateLimitMessages.toString()}
                  onChangeText={(text) => 
                    setChatSettings(prev => ({ ...prev, rateLimitMessages: parseInt(text) || 0 }))
                  }
                />
              </View>

              <View>
                <Label>Rate Limit Window (Seconds)</Label>
                <Input
                  keyboardType="numeric"
                  value={chatSettings.rateLimitWindow.toString()}
                  onChangeText={(text) => 
                    setChatSettings(prev => ({ ...prev, rateLimitWindow: parseInt(text) || 0 }))
                  }
                />
              </View>

              <View>
                <Label>Allowed File Types</Label>
                <Textarea
                  value={chatSettings.allowedFileTypes}
                  onChangeText={(text) => 
                    setChatSettings(prev => ({ ...prev, allowedFileTypes: text }))
                  }
                  placeholder="Comma-separated list: jpg,png,pdf,doc"
                  numberOfLines={2}
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Allow File Attachments</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Users can attach files to messages
                  </Text>
                </View>
                <Switch
                  value={chatSettings.allowAttachments}
                  onValueChange={(checked) => 
                    setChatSettings(prev => ({ ...prev, allowAttachments: checked }))
                  }
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Forum Settings */}
        <Card>
          <CardHeader>
            <CardTitle style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Users size={20} color="#111827" />
              <Text>Forum Configuration</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 16 }}>
              <View>
                <Label>Max Post Length</Label>
                <Input
                  keyboardType="numeric"
                  value={forumSettings.maxPostLength.toString()}
                  onChangeText={(text) => 
                    setForumSettings(prev => ({ ...prev, maxPostLength: parseInt(text) || 0 }))
                  }
                />
              </View>

              <View>
                <Label>Max Title Length</Label>
                <Input
                  keyboardType="numeric"
                  value={forumSettings.maxTitleLength.toString()}
                  onChangeText={(text) => 
                    setForumSettings(prev => ({ ...prev, maxTitleLength: parseInt(text) || 0 }))
                  }
                />
              </View>

              <View>
                <Label>Max Tags per Post</Label>
                <Input
                  keyboardType="numeric"
                  value={forumSettings.maxTagsPerPost.toString()}
                  onChangeText={(text) => 
                    setForumSettings(prev => ({ ...prev, maxTagsPerPost: parseInt(text) || 0 }))
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Require Post Approval</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Posts need admin approval before publishing
                  </Text>
                </View>
                <Switch
                  value={forumSettings.requireApproval}
                  onValueChange={(checked) => 
                    setForumSettings(prev => ({ ...prev, requireApproval: checked }))
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Allow Anonymous Posts</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Users can post without showing their name
                  </Text>
                </View>
                <Switch
                  value={forumSettings.allowAnonymousPosts}
                  onValueChange={(checked) => 
                    setForumSettings(prev => ({ ...prev, allowAnonymousPosts: checked }))
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Allow Tags</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Users can add tags to their posts
                  </Text>
                </View>
                <Switch
                  value={forumSettings.allowTags}
                  onValueChange={(checked) => 
                    setForumSettings(prev => ({ ...prev, allowTags: checked }))
                  }
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Bell size={20} color="#111827" />
              <Text>Notification Configuration</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Email Notifications</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Send notifications via email
                  </Text>
                </View>
                <Switch
                  value={notificationSettings.emailNotifications}
                  onValueChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>Push Notifications</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Send browser/mobile push notifications
                  </Text>
                </View>
                <Switch
                  value={notificationSettings.pushNotifications}
                  onValueChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '500' }}>In-App Notifications</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Show notifications within the platform
                  </Text>
                </View>
                <Switch
                  value={notificationSettings.inAppNotifications}
                  onValueChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, inAppNotifications: checked }))
                  }
                />
              </View>

              <View>
                <Label>Email Digest Frequency</Label>
                <Select 
                  value={notificationSettings.digestFrequency} 
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({ ...prev, digestFrequency: value }))
                  }
                  options={[
                    { label: 'Immediate', value: 'immediate' },
                    { label: 'Hourly', value: 'hourly' },
                    { label: 'Daily', value: 'daily' },
                    { label: 'Weekly', value: 'weekly' },
                    { label: 'Never', value: 'never' }
                  ]}
                />
              </View>

              <View>
                <Label>Quiet Hours Start</Label>
                <Input
                  value={notificationSettings.quietHoursStart}
                  onChangeText={(text) => 
                    setNotificationSettings(prev => ({ ...prev, quietHoursStart: text }))
                  }
                />
              </View>

              <View>
                <Label>Quiet Hours End</Label>
                <Input
                  value={notificationSettings.quietHoursEnd}
                  onChangeText={(text) => 
                    setNotificationSettings(prev => ({ ...prev, quietHoursEnd: text }))
                  }
                />
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
};

export default EngagementSettings;
