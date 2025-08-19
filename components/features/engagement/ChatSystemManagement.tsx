import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/mockSupabase';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

import {
  MessageSquare,
  AlertTriangle,
  Send,
  Download,
  Flag,
  Users,
} from 'lucide-react-native';

type ChatLog = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_type: 'text' | 'image' | 'file' | string;
  message_content: string;
  created_at: string;
  flagged?: boolean;
  flag_reason?: string;
};

type ChatReport = {
  id: string;
  report_reason: string;
  additional_details?: string;
  reported_by?: string | null;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed' | 'banned';
  created_at: string;
};

const ChatSystemManagement: React.FC = () => {
  const [filterDateRange, setFilterDateRange] = useState<'all' | '1' | '7' | '30'>('all');
  const [filterUserType, setFilterUserType] = useState<'all' | 'flagged'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState<'all' | 'candidates' | 'employers' | 'inactive' | 'new'>('all');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // CHAT LOGS
  const { data: chatLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['chat-logs', filterDateRange, filterUserType, searchTerm],
    queryFn: async (): Promise<ChatLog[]> => {
      let query = supabase
        .from('chat_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filterDateRange !== 'all') {
        const days = parseInt(filterDateRange, 10);
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);
        query = query.gte('created_at', dateThreshold.toISOString());
      }

      if (filterUserType === 'flagged') {
        query = query.eq('flagged', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      // local search filter
      const rows: ChatLog[] = data ?? [];
      if (!searchTerm.trim()) return rows;
      const q = searchTerm.toLowerCase();
      return rows.filter(
        (r) =>
          r.sender_id?.toLowerCase().includes(q) ||
          r.receiver_id?.toLowerCase().includes(q) ||
          r.message_content?.toLowerCase().includes(q)
      );
    },
  });

  // REPORTS
  const { data: chatReports = [] } = useQuery({
    queryKey: ['chat-reports'],
    queryFn: async (): Promise<ChatReport[]> => {
      const { data, error } = await supabase
        .from('chat_reports')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // BROADCAST
  const sendBroadcastMutation = useMutation({
    mutationFn: async (messageData: {
      title: string;
      content: string;
      target_audience: string;
    }) => {
      const { data, error } = await supabase
        .from('broadcast_messages')
        .insert({
          title: messageData.title,
          content: messageData.content,
          target_audience: messageData.target_audience,
          delivery_methods: ['in_app'],
          status: 'sent',
          sent_at: new Date().toISOString(),
          created_by: 'admin',
          sent_count: 0,
        });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Broadcast Sent',
        description: 'Message has been sent to the selected audience.',
      });
      setBroadcastMessage('');
      setBroadcastTitle('');
      setBroadcastAudience('all');
    },
  });

  // FLAG MESSAGE
  const flagMessageMutation = useMutation({
    mutationFn: async ({ messageId, reason }: { messageId: string; reason: string }) => {
      const { error } = await supabase
        .from('chat_logs')
        .update({ flagged: true, flag_reason: reason })
        .eq('id', messageId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Message Flagged',
        description: 'Message has been flagged for review.',
      });
      queryClient.invalidateQueries({ queryKey: ['chat-logs'] });
    },
  });

  // REPORT ACTION
  const handleReportAction = async (reportId: string, action: 'resolved' | 'dismissed' | 'banned') => {
    const { error } = await supabase
      .from('chat_reports')
      .update({
        status: 'reviewed',
        action_taken: action,
        reviewed_by: 'admin',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update report status.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Report Updated',
        description: `Report has been marked as ${action}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['chat-reports'] });
    }
  };

  const exportChatHistory = () => {
    toast({
      title: 'Export Started',
      description: "Chat history export is being prepared. You'll receive a download link shortly.",
    });
  };

  // Derived counts
  const totalMessages = chatLogs.length;
  const flaggedCount = useMemo(() => chatLogs.filter((c) => c.flagged).length, [chatLogs]);
  const pendingReports = useMemo(
    () => chatReports.filter((r) => r.status === 'pending').length,
    [chatReports]
  );
  const activeUsers = useMemo(() => {
    const set = new Set<string>();
    chatLogs.forEach((l) => {
      if (l.sender_id) set.add(l.sender_id);
      if (l.receiver_id) set.add(l.receiver_id);
    });
    return set.size;
  }, [chatLogs]);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }} style={{ flex: 1 }}>
      <View style={{ gap: 24, paddingHorizontal: 12, paddingTop: 8 }}>
        {/* Overview Cards */}
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Card>
            <CardHeader>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <CardTitle style={{ fontSize: 13, fontWeight: '600' }}>Total Messages</CardTitle>
                <MessageSquare size={16} color="#6b7280" />
              </View>
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 22, fontWeight: '700' }}>{totalMessages}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Last 100 messages</Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <CardTitle style={{ fontSize: 13, fontWeight: '600' }}>Flagged Messages</CardTitle>
                <Flag size={16} color="#6b7280" />
              </View>
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 22, fontWeight: '700' }}>{flaggedCount}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Requiring attention</Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <CardTitle style={{ fontSize: 13, fontWeight: '600' }}>Pending Reports</CardTitle>
                <AlertTriangle size={16} color="#6b7280" />
              </View>
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 22, fontWeight: '700' }}>{pendingReports}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Need review</Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <CardTitle style={{ fontSize: 13, fontWeight: '600' }}>Active Users</CardTitle>
                <Users size={16} color="#6b7280" />
              </View>
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 22, fontWeight: '700' }}>{activeUsers}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>In recent chats</Text>
            </CardContent>
          </Card>
        </View>

        {/* Tabs */}
        <Tabs
          tabs={['Chat Logs & Monitoring', 'Abuse Reports', 'Broadcast Messaging']}
          tabContent={(activeIndex) => {
            if (activeIndex === 0) {
              // LOGS
              return (
                <View style={{ gap: 12 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Chat Logs & Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={{ gap: 12 }}>
                        {/* Filters */}
                        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                          <View style={{ width: 140 }}>
                            <Select
                              data={[
                                { label: 'All Time', value: 'all' },
                                { label: 'Last Day', value: '1' },
                                { label: 'Last Week', value: '7' },
                                { label: 'Last Month', value: '30' },
                              ]}
                              value={filterDateRange}
                              onChange={(item) => setFilterDateRange(item.value as any)}
                              placeholder="Date range"
                            />
                          </View>
                          <View style={{ width: 140 }}>
                            <Select
                              data={[
                                { label: 'All Messages', value: 'all' },
                                { label: 'Flagged Only', value: 'flagged' },
                              ]}
                              value={filterUserType}
                              onChange={(item) => setFilterUserType(item.value as any)}
                              placeholder="Filter"
                            />
                          </View>
                          <Button
                            variant="outline"
                            onPress={exportChatHistory}
                            iconLeft={<Download size={16} color="#111827" />}
                          >
                            Export
                          </Button>
                        </View>

                        {/* Search */}
                        <Input
                          placeholder="Search messages..."
                          value={searchTerm}
                          onChangeText={setSearchTerm}
                        />

                        {/* Logs */}
                        <View style={{ gap: 8 }}>
                          {logsLoading ? (
                            <Text style={{ color: '#6b7280' }}>Loading…</Text>
                          ) : (
                            chatLogs.map((log) => (
                              <View
                                key={log.id}
                                style={{
                                  borderWidth: 1,
                                  borderColor: '#e5e7eb',
                                  borderRadius: 8,
                                  padding: 12,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  gap: 8,
                                }}
                              >
                                <View style={{ flex: 1, paddingRight: 8 }}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                                    <Text style={{ fontWeight: '600' }}>From: {log.sender_id}</Text>
                                    <Text style={{ color: '#6b7280' }}>to</Text>
                                    <Text style={{ fontWeight: '600' }}>{log.receiver_id}</Text>
                                    <Badge variant={log.message_type === 'text' ? 'default' : 'secondary'}>
                                      {log.message_type}
                                    </Badge>
                                    {log.flagged ? <Badge variant="destructive">Flagged</Badge> : null}
                                  </View>

                                  <Text style={{ color: '#6b7280', marginBottom: 6 }}>
                                    {log.message_content}
                                  </Text>
                                  <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                                    {new Date(log.created_at).toLocaleString()}
                                  </Text>
                                </View>

                                <View style={{ justifyContent: 'center' }}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!!log.flagged}
                                    onPress={() =>
                                      flagMessageMutation.mutate({
                                        messageId: log.id,
                                        reason: 'Admin flagged for review',
                                      })
                                    }
                                    iconLeft={<Flag size={16} color="#111827" />}
                                  >
                                    {/* icon-only ok; Button allows children optional */}
                                  </Button>
                                </View>
                              </View>
                            ))
                          )}
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                </View>
              );
            }

            if (activeIndex === 1) {
              // REPORTS
              return (
                <View style={{ gap: 12 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Abuse Reports & Moderation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={{ gap: 12 }}>
                        {chatReports.map((report) => (
                          <View
                            key={report.id}
                            style={{
                              borderWidth: 1,
                              borderColor: '#e5e7eb',
                              borderRadius: 8,
                              padding: 12,
                            }}
                          >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                              <View>
                                <Text style={{ fontWeight: '600' }}>Report: {report.report_reason}</Text>
                                <Text style={{ color: '#6b7280' }}>
                                  Reported by: {report.reported_by || 'Unknown'}
                                </Text>
                              </View>
                              <Badge
                                variant={
                                  report.status === 'pending'
                                    ? 'destructive'
                                    : report.status === 'reviewed'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {report.status}
                              </Badge>
                            </View>

                            {!!report.additional_details && (
                              <Text style={{ marginBottom: 8 }}>{report.additional_details}</Text>
                            )}

                            <View style={{ flexDirection: 'row', gap: 8 }}>
                              <Button
                                size="sm"
                                disabled={report.status !== 'pending'}
                                onPress={() => handleReportAction(report.id, 'resolved')}
                              >
                                Resolve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={report.status !== 'pending'}
                                onPress={() => handleReportAction(report.id, 'dismissed')}
                              >
                                Dismiss
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={report.status !== 'pending'}
                                onPress={() => handleReportAction(report.id, 'banned')}
                              >
                                Ban User
                              </Button>
                            </View>
                          </View>
                        ))}
                      </View>
                    </CardContent>
                  </Card>
                </View>
              );
            }

            // BROADCAST
            return (
              <View style={{ gap: 12 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Broadcast Messaging</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={{ gap: 12 }}>
                      <View>
                        <Label>Message Title</Label>
                        <Input
                          value={broadcastTitle}
                          onChangeText={setBroadcastTitle}
                          placeholder="Enter message title"
                        />
                      </View>

                      <View>
                        <Label>Message Content</Label>
                        <Textarea
                          value={broadcastMessage}
                          onChangeText={setBroadcastMessage}
                          placeholder="Enter your broadcast message..."
                        />
                      </View>

                      <View>
                        <Label>Target Audience</Label>
                        <Select
                          data={[
                            { label: 'All Users', value: 'all' },
                            { label: 'Only Candidates', value: 'candidates' },
                            { label: 'Only Employers', value: 'employers' },
                            { label: 'Inactive Users (30+ days)', value: 'inactive' },
                            { label: 'New Users (This Week)', value: 'new' },
                          ]}
                          value={broadcastAudience}
                          onChange={(item) => setBroadcastAudience(item.value as any)}
                          placeholder="Choose audience"
                        />
                      </View>

                      <Button
                        onPress={() =>
                          sendBroadcastMutation.mutate({
                            title: broadcastTitle,
                            content: broadcastMessage,
                            target_audience: broadcastAudience,
                          })
                        }
                        disabled={
                          !broadcastTitle ||
                          !broadcastMessage ||
                          (sendBroadcastMutation as any).isPending
                        }
                        iconLeft={<Send size={16} color="#fff" />}
                      >
                        Send Broadcast Message
                      </Button>
                    </View>
                  </CardContent>
                </Card>
              </View>
            );
          }}
        />
      </View>
    </ScrollView>
  );
};

export default ChatSystemManagement;
