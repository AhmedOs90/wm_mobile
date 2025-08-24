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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Send,
  Plus,
  Edit,
  Eye,
  Clock
} from 'lucide-react-native';

const NotificationEngine = () => {
  const [templateName, setTemplateName] = useState<string>('');
  const [templateSubject, setTemplateSubject] = useState<string>('');
  const [templateContent, setTemplateContent] = useState<string>('');
  const [templateType, setTemplateType] = useState<string>('announcement');
  const [deliveryInApp, setDeliveryInApp] = useState<boolean>(true);
  const [deliveryEmail, setDeliveryEmail] = useState<boolean>(false);
  const [deliveryPush, setDeliveryPush] = useState<boolean>(false);
  const [targetAudience, setTargetAudience] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notification templates
  const { data: templates } = useQuery({
    queryKey: ['notification-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch broadcast messages
  const { data: broadcasts } = useQuery({
    queryKey: ['broadcast-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('broadcast_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: {
      name: string;
      subject: string;
      content: string;
      template_type: string;
      delivery_methods: string[];
      target_audience: string;
    }) => {
      const { data, error } = await supabase
        .from('notification_templates')
        .insert(templateData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Template Created",
        description: "Notification template has been created successfully."
      });
      setTemplateName('');
      setTemplateSubject('');
      setTemplateContent('');
      setDeliveryInApp(true);
      setDeliveryEmail(false);
      setDeliveryPush(false);
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
    }
  });

  // Send test notification
  const sendTestMutation = useMutation({
    mutationFn: async (templateId: string) => {
      // This would integrate with your notification service
      // For now, we'll just create a broadcast message
      const template = templates?.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      const { data, error } = await supabase
        .from('broadcast_messages')
        .insert({
          title: `[TEST] ${template.subject}`,
          content: template.content,
          target_audience: 'admin', // Send only to admin for testing
          delivery_methods: template.delivery_methods,
          status: 'sent',
          sent_at: new Date().toISOString(),
          created_by: 'admin',
          sent_count: 1
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Test Sent",
        description: "Test notification has been sent successfully."
      });
    }
  });

  // Toggle template status
  const toggleTemplate = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('notification_templates')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update template status.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Template Updated",
        description: `Template has been ${!currentStatus ? 'enabled' : 'disabled'}.`
      });
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
    }
  };

  const getDeliveryMethods = () => {
    const methods = [];
    if (deliveryInApp) methods.push('in_app');
    if (deliveryEmail) methods.push('email');
    if (deliveryPush) methods.push('push');
    return methods;
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ gap: 24, padding: 16 }}>
        {/* Overview Cards */}
        <View style={{ gap: 16 }}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Active Templates</CardTitle>
              <Bell size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
                {templates?.filter(t => t.is_active).length || 0}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                Total: {templates?.length || 0}
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Messages Sent</CardTitle>
              <Send size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{broadcasts?.length || 0}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Total broadcasts</Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Scheduled</CardTitle>
              <Clock size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
                {broadcasts?.filter(b => b.status === 'scheduled').length || 0}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Pending delivery</Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle style={{ fontSize: 14, fontWeight: '500' }}>Total Recipients</CardTitle>
              <MessageSquare size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
                {broadcasts?.reduce((sum, b) => sum + (b.sent_count || 0), 0) || 0}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Messages delivered</Text>
            </CardContent>
          </Card>
        </View>

        <Tabs
          tabs={['Notification Templates', 'Delivery History']}
          initialTab={0}
          tabContent={(activeIndex) => {
            if (activeIndex === 0) {
              // TEMPLATES
              return (
                <Card>
                  <CardHeader>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <CardTitle>Notification Templates</CardTitle>
                      <ModalDialog
                        title="Create Notification Template"
                        trigger={
                          <Button>
                            <Plus size={16} />
                            Create Template
                          </Button>
                        }
                      >
                        <View style={{ gap: 16 }}>
                          <View>
                            <Label>Template Name</Label>
                            <Input
                              value={templateName}
                              onChangeText={setTemplateName}
                              placeholder="Enter template name"
                            />
                          </View>
                          <View>
                            <Label>Subject</Label>
                            <Input
                              value={templateSubject}
                              onChangeText={setTemplateSubject}
                              placeholder="Enter notification subject"
                            />
                          </View>
                          <View>
                            <Label>Content</Label>
                            <Textarea
                              value={templateContent}
                              onChangeText={setTemplateContent}
                              placeholder="Enter notification content"
                              numberOfLines={6}
                            />
                          </View>
                          <View>
                            <Label>Template Type</Label>
                            <Select
                              value={templateType}
                              onValueChange={setTemplateType}
                              options={[
                                { label: 'New Message', value: 'new_message' },
                                { label: 'Forum Reply', value: 'forum_reply' },
                                { label: 'Poll Reminder', value: 'poll_reminder' },
                                { label: 'Announcement', value: 'announcement' },
                                { label: 'Event Reminder', value: 'event_reminder' }
                              ]}
                            />
                          </View>
                          <View>
                            <Label>Delivery Methods</Label>
                            <View style={{ gap: 8, marginTop: 8 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text>In-App Notification</Text>
                                <Switch value={deliveryInApp} onValueChange={setDeliveryInApp} />
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text>Email</Text>
                                <Switch value={deliveryEmail} onValueChange={setDeliveryEmail} />
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text>Push Notification</Text>
                                <Switch value={deliveryPush} onValueChange={setDeliveryPush} />
                              </View>
                            </View>
                          </View>
                          <View>
                            <Label>Target Audience</Label>
                            <Select
                              value={targetAudience}
                              onValueChange={setTargetAudience}
                              options={[
                                { label: 'All Users', value: 'all' },
                                { label: 'Only Candidates', value: 'candidates' },
                                { label: 'Only Employers', value: 'employers' }
                              ]}
                            />
                          </View>
                          <Button
                            onPress={() => createTemplateMutation.mutate({
                              name: templateName,
                              subject: templateSubject,
                              content: templateContent,
                              template_type: templateType,
                              delivery_methods: getDeliveryMethods(),
                              target_audience: targetAudience
                            })}
                            disabled={!templateName || !templateSubject || !templateContent || createTemplateMutation.isPending}
                          >
                            Create Template
                          </Button>
                        </View>
                      </ModalDialog>
                    </View>
                  </CardHeader>
                  <CardContent>
                    <View style={{ gap: 16 }}>
                      {templates?.map((template) => (
                        <View 
                          key={template.id} 
                          style={{ 
                            padding: 16, 
                            borderWidth: 1, 
                            borderColor: '#e5e7eb', 
                            borderRadius: 8 
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontWeight: '500' }}>{template.name}</Text>
                              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                                Subject: {template.subject}
                              </Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                <Badge variant="outline">{template.template_type}</Badge>
                                <Badge variant={template.is_active ? 'default' : 'secondary'}>
                                  {template.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge variant="outline">{template.target_audience}</Badge>
                              </View>
                              <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
                                {template.delivery_methods.map((method) => (
                                  <Badge key={method} variant="outline" style={{ fontSize: 12 }}>
                                    {method === 'in_app' ? 'In-App' : method === 'email' ? 'Email' : 'Push'}
                                  </Badge>
                                ))}
                              </View>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                              <Button
                                variant="outline"
                                onPress={() => sendTestMutation.mutate(template.id)}
                                disabled={sendTestMutation.isPending}
                                iconLeft={<Send size={16} color="#111827" />}
                              >
                                Test
                              </Button>
                              <Button
                                variant="outline"
                                onPress={() => toggleTemplate(template.id, template.is_active)}
                              >
                                {template.is_active ? 'Disable' : 'Enable'}
                              </Button>
                              <Button 
                                variant="outline"
                                iconLeft={<Edit size={16} color="#111827" />}
                              >
                                {/* Icon only */}
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

            if (activeIndex === 1) {
              // DELIVERY HISTORY
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={{ gap: 16 }}>
                      {broadcasts?.map((broadcast) => (
                        <View 
                          key={broadcast.id} 
                          style={{ 
                            padding: 16, 
                            borderWidth: 1, 
                            borderColor: '#e5e7eb', 
                            borderRadius: 8 
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontWeight: '500' }}>{broadcast.title}</Text>
                              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                                {broadcast.content.substring(0, 100)}...
                              </Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                <Badge variant={
                                  broadcast.status === 'sent' ? 'default' :
                                  broadcast.status === 'scheduled' ? 'secondary' : 'outline'
                                }>
                                  {broadcast.status}
                                </Badge>
                                <Badge variant="outline">{broadcast.target_audience}</Badge>
                                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                                  {broadcast.sent_count} recipients
                                </Text>
                              </View>
                              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                                {broadcast.sent_at ? 
                                  `Sent: ${new Date(broadcast.sent_at).toLocaleString()}` :
                                  `Created: ${new Date(broadcast.created_at).toLocaleString()}`
                                }
                              </Text>
                            </View>
                            <Button 
                              variant="outline"
                              iconLeft={<Eye size={16} color="#111827" />}
                            >
                              View Details
                            </Button>
                          </View>
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

export default NotificationEngine;
