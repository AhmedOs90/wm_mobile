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
import { Checkbox } from '@/components/ui/checkbox';
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
} from 'lucide-react';

const NotificationEngine = () => {
  const [templateName, setTemplateName] = useState<string>('');
  const [templateSubject, setTemplateSubject] = useState<string>('');
  const [templateContent, setTemplateContent] = useState<string>('');
  const [templateType, setTemplateType] = useState<string>('announcement');
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>(['in_app']);
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
      setDeliveryMethods(['in_app']);
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

  const handleDeliveryMethodChange = (method: string, checked: boolean) => {
    if (checked) {
      setDeliveryMethods([...deliveryMethods, method]);
    } else {
      setDeliveryMethods(deliveryMethods.filter(m => m !== method));
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates?.filter(t => t.is_active).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {templates?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{broadcasts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total broadcasts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {broadcasts?.filter(b => b.status === 'scheduled').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Pending delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {broadcasts?.reduce((sum, b) => sum + (b.sent_count || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Messages delivered</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Notification Templates</TabsTrigger>
          <TabsTrigger value="history">Delivery History</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notification Templates</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Notification Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          placeholder="Enter template name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-subject">Subject</Label>
                        <Input
                          id="template-subject"
                          value={templateSubject}
                          onChange={(e) => setTemplateSubject(e.target.value)}
                          placeholder="Enter notification subject"
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-content">Content</Label>
                        <Textarea
                          id="template-content"
                          value={templateContent}
                          onChange={(e) => setTemplateContent(e.target.value)}
                          placeholder="Enter notification content"
                          rows={6}
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-type">Template Type</Label>
                        <Select value={templateType} onValueChange={setTemplateType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new_message">New Message</SelectItem>
                            <SelectItem value="forum_reply">Forum Reply</SelectItem>
                            <SelectItem value="poll_reminder">Poll Reminder</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="event_reminder">Event Reminder</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Delivery Methods</Label>
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="in-app"
                              checked={deliveryMethods.includes('in_app')}
                              onCheckedChange={(checked) => 
                                handleDeliveryMethodChange('in_app', checked as boolean)
                              }
                            />
                            <Label htmlFor="in-app">In-App Notification</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="email"
                              checked={deliveryMethods.includes('email')}
                              onCheckedChange={(checked) => 
                                handleDeliveryMethodChange('email', checked as boolean)
                              }
                            />
                            <Label htmlFor="email">Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="push"
                              checked={deliveryMethods.includes('push')}
                              onCheckedChange={(checked) => 
                                handleDeliveryMethodChange('push', checked as boolean)
                              }
                            />
                            <Label htmlFor="push">Push Notification</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="target-audience">Target Audience</Label>
                        <Select value={targetAudience} onValueChange={setTargetAudience}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="candidates">Only Candidates</SelectItem>
                            <SelectItem value="employers">Only Employers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => createTemplateMutation.mutate({
                          name: templateName,
                          subject: templateSubject,
                          content: templateContent,
                          template_type: templateType,
                          delivery_methods: deliveryMethods,
                          target_audience: targetAudience
                        })}
                        disabled={!templateName || !templateSubject || !templateContent || createTemplateMutation.isPending}
                        className="w-full"
                      >
                        Create Template
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates?.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Subject: {template.subject}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{template.template_type}</Badge>
                          <Badge variant={template.is_active ? 'default' : 'secondary'}>
                            {template.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">{template.target_audience}</Badge>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {template.delivery_methods.map((method) => (
                            <Badge key={method} variant="outline" className="text-xs">
                              {method === 'in_app' ? 'In-App' : method === 'email' ? 'Email' : 'Push'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendTestMutation.mutate(template.id)}
                          disabled={sendTestMutation.isPending}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleTemplate(template.id, template.is_active)}
                        >
                          {template.is_active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {broadcasts?.map((broadcast) => (
                  <div key={broadcast.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{broadcast.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {broadcast.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={
                            broadcast.status === 'sent' ? 'default' :
                            broadcast.status === 'scheduled' ? 'secondary' : 'outline'
                          }>
                            {broadcast.status}
                          </Badge>
                          <Badge variant="outline">{broadcast.target_audience}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {broadcast.sent_count} recipients
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {broadcast.sent_at ? 
                            `Sent: ${new Date(broadcast.sent_at).toLocaleString()}` :
                            `Created: ${new Date(broadcast.created_at).toLocaleString()}`
                          }
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
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

export default NotificationEngine;
