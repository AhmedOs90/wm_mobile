// screens/employer/EmployerNotifications.native.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs'; // your RN Tabs(tabs, initialTab, tabContent)
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import Select from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Bell,
  Mail,
  MessageSquare,
  User,
  Briefcase,
  CheckCircle,
  X,
  Calendar as CalendarIcon,
} from 'lucide-react-native';

type Priority = 'high' | 'medium' | 'low';
type NType = 'application' | 'message' | 'job' | 'system';

const EmployerNotifications: React.FC = () => {
  const tabs = ['Inbox', 'Email Settings', 'Push Settings'];

  const notifications = useMemo(
    () => [
      { id: 1, type: 'application' as NType, title: 'New Application Received', message: 'Kareem A. has applied for Senior Frontend Developer position', timestamp: '5 min ago', read: false, priority: 'high' as Priority },
      { id: 2, type: 'message' as NType,    title: 'New Message',              message: 'Sarah M. sent you a message about the UX Designer role',     timestamp: '1 hour ago', read: false, priority: 'medium' as Priority },
      { id: 3, type: 'job' as NType,        title: 'Job Posting Expires Soon', message: 'Your Vue.js Developer posting expires in 3 days',            timestamp: '2 hours ago', read: true,  priority: 'medium' as Priority },
      { id: 4, type: 'system' as NType,     title: 'Profile View Alert',       message: '15 candidates viewed your company profile today',            timestamp: '1 day ago',   read: true,  priority: 'low' as Priority },
    ],
    []
  );

  const [emailSettings, setEmailSettings] = useState([
    { id: 'applications',  label: 'New Applications',   description: 'Get notified when candidates apply to your jobs',           enabled: true },
    { id: 'messages',      label: 'Direct Messages',    description: 'Receive notifications for new messages from candidates',    enabled: true },
    { id: 'job_expiry',    label: 'Job Expiry Alerts',  description: 'Get reminded when your job postings are about to expire',  enabled: true },
    { id: 'profile_views', label: 'Profile Views',      description: 'Daily summary of profile views and company page visits',    enabled: false },
    { id: 'weekly_digest', label: 'Weekly Digest',      description: 'Weekly summary of your hiring activity and metrics',        enabled: true },
  ]);

  const [pushSettings, setPushSettings] = useState([
    { id: 'urgent_applications', label: 'Urgent Applications', description: 'High-priority application notifications', enabled: true },
    { id: 'direct_messages',     label: 'Direct Messages',     description: 'Instant notifications for new messages',  enabled: true },
    { id: 'job_updates',         label: 'Job Updates',         description: 'Updates about your active job postings',  enabled: false },
    { id: 'system_alerts',       label: 'System Alerts',       description: 'Important system notifications and updates', enabled: true },
  ]);

  const [emailFrequency, setEmailFrequency] = useState<string | number>('');
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');

  const frequencyOptions = [
    { label: 'Instant',        value: 'instant' },
    { label: 'Hourly digest',  value: 'hourly' },
    { label: 'Daily digest',   value: 'daily' },
    { label: 'Weekly digest',  value: 'weekly' },
  ];

  const priorityPill = (p: Priority) => {
    switch (p) {
      case 'high':   return { bg: '#FEE2E2', fg: '#DC2626', border: '#FCA5A5' };
      case 'medium': return { bg: '#FEF3C7', fg: '#D97706', border: '#FCD34D' };
      default:       return { bg: '#DCFCE7', fg: '#16A34A', border: '#86EFAC' };
    }
  };

  const iconForType = (t: NType) => {
    switch (t) {
      case 'application': return User;
      case 'message':     return MessageSquare;
      case 'job':         return Briefcase;
      default:            return Bell;
    }
  };

  const InboxTab = () => (
    <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
      {/* Header row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>Notifications</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Badge><Text style={{ color: '#991B1B' }}>4 unread</Text></Badge>
          <Button variant="outline" size="sm">Mark all as read</Button>
        </View>
      </View>

      {/* Filters */}
      <Card style={{ overflow: 'hidden', borderColor: '#E5E7EB' }}>
        <LinearGradient colors={['#F9FAFB', '#F1F5F9']} style={{ padding: 12 }}>
          <CardContent className="p-0">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Input placeholder="Search notifications..." style={{ width: 240 }} />
              <Select
                data={[
                  { label: 'All', value: 'all' },
                  { label: 'Unread', value: 'unread' },
                  { label: 'Applications', value: 'applications' },
                  { label: 'Messages', value: 'messages' },
                ]}
                value={'all'}
                onChange={() => {}}
                placeholder="Filter"
              />
            </View>
          </CardContent>
        </LinearGradient>
      </Card>

      {/* List */}
      <View style={{ gap: 8 }}>
        {notifications.map((n) => {
          const Icon = iconForType(n.type);
          const pill = priorityPill(n.priority);
          const gradient = n.read ? ['#FFFFFF', '#FFFFFF'] : ['#EFF6FF', '#E0EAFF'];
          const borderColor = n.read ? '#E5E7EB' : '#BFDBFE';

          return (
            <Card key={n.id} style={{ overflow: 'hidden', borderColor }}>
              <LinearGradient colors={gradient} style={{ padding: 12 }}>
                <CardContent className="p-0">
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ padding: 8, borderRadius: 8, backgroundColor: pill.bg }}>
                      <Icon size={18} color={pill.fg} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '600', color: '#111827' }}>{n.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View
                            style={{
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 999,
                              borderWidth: 1,
                              borderColor: pill.border,
                              backgroundColor: pill.bg,
                            }}
                          >
                            <Text style={{ color: pill.fg, fontSize: 12 }}>{n.priority}</Text>
                          </View>
                          {!n.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6' }} />}
                        </View>
                      </View>

                      <Text style={{ color: '#4B5563', marginTop: 4 }}>{n.message}</Text>
                      <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 6 }}>{n.timestamp}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <Button variant="ghost" size="sm" iconLeft={<CheckCircle size={16} />} />
                      <Button variant="ghost" size="sm" iconLeft={<X size={16} />} />
                    </View>
                  </View>
                </CardContent>
              </LinearGradient>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );

  const EmailSettingsTab = () => (
    <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
      <Card style={{ overflow: 'hidden' }}>
        <LinearGradient colors={['#EFF6FF', '#E0EAFF']} style={{ paddingBottom: 8 }}>
          <CardHeader>
            <CardTitle>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Mail size={18} />
                <Text style={{ color: '#111827' }}>Email Notification Settings</Text>
              </View>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <View style={{ gap: 12 }}>
              {emailSettings.map((s, idx) => (
                <View
                  key={s.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 12,
                    backgroundColor: 'white',
                    borderRadius: 8,
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Label>{s.label}</Label>
                    <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 13 }}>{s.description}</Text>
                  </View>
                  <Switch
                    value={s.enabled}
                    onValueChange={(v) => {
                      setEmailSettings((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], enabled: v };
                        return next;
                      });
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 16, gap: 16 }}>
              <View>
                <Label>Email Frequency</Label>
                <View style={{ marginTop: 8 }}>
                  <Select
                    data={frequencyOptions}
                    value={emailFrequency}
                    onChange={(item) => setEmailFrequency(item.value)}
                    placeholder="Select frequency"
                  />
                </View>
              </View>

              <View>
                <Label>Quiet Hours</Label>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <Input placeholder="22:00" value={quietStart} onChangeText={setQuietStart} style={{ width: 100 }} />
                  <Text style={{ color: '#6B7280' }}>to</Text>
                  <Input placeholder="08:00" value={quietEnd} onChangeText={setQuietEnd} style={{ width: 100 }} />
                </View>
                <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 12 }}>
                  No emails will be sent during these hours
                </Text>
              </View>
            </View>
          </CardContent>
        </LinearGradient>
      </Card>
    </ScrollView>
  );

  const PushSettingsTab = () => (
    <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
      <Card style={{ overflow: 'hidden' }}>
        <LinearGradient colors={['#ECFDF5', '#DCFCE7']} style={{ paddingBottom: 8 }}>
          <CardHeader>
            <CardTitle>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Bell size={18} />
                <Text style={{ color: '#111827' }}>Push Notification Settings</Text>
              </View>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <View style={{ gap: 12 }}>
              {pushSettings.map((s, idx) => (
                <View
                  key={s.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 12,
                    backgroundColor: 'white',
                    borderRadius: 8,
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Label>{s.label}</Label>
                    <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 13 }}>{s.description}</Text>
                  </View>
                  <Switch
                    value={s.enabled}
                    onValueChange={(v) => {
                      setPushSettings((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], enabled: v };
                        return next;
                      });
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 16, gap: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Label>Browser Notifications</Label>
                  <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 13 }}>
                    Allow browser push notifications
                  </Text>
                </View>
                <Button variant="outline">Enable</Button>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Label>Sound Notifications</Label>
                  <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 13 }}>
                    Play sound for new notifications
                  </Text>
                </View>
                <Switch value={true} onValueChange={() => {}} />
              </View>
            </View>
          </CardContent>
        </LinearGradient>
      </Card>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>Notifications</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Badge><Text style={{ color: '#991B1B' }}>4 unread</Text></Badge>
          <Button variant="outline" size="sm">Mark all as read</Button>
        </View>
      </View>

      <Tabs
        tabs={tabs}
        initialTab={0}
        tabContent={(index) => {
          switch (index) {
            case 0: return <InboxTab />;
            case 1: return <EmailSettingsTab />;
            case 2: return <PushSettingsTab />;
            default: return null;
          }
        }}
      />
    </View>
  );
};

export default EmployerNotifications;
