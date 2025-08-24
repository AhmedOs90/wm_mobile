import Layout from '@/components/shared/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageCircle,
  Search,
  Filter,
  Send,
  Paperclip,
  Building,
  Clock,
  MoreVertical,
  Star
} from 'lucide-react';
import { useState } from 'react';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      company: 'TechCorp',
      companyLogo: '/placeholder.svg',
      lastMessage: 'We would like to schedule an interview for next week',
      lastMessageTime: '2 hours ago',
      unreadCount: 2,
      status: 'active',
      contact: 'Sarah Johnson',
      position: 'Senior Frontend Developer'
    },
    {
      id: 2,
      company: 'StartupHub',
      companyLogo: '/placeholder.svg',
      lastMessage: 'Thank you for your application. We will review it shortly.',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
      status: 'pending',
      contact: 'Mike Chen',
      position: 'Full Stack Developer'
    },
    {
      id: 3,
      company: 'Innovation Ltd',
      companyLogo: '/placeholder.svg',
      lastMessage: 'Your portfolio looks impressive! Can we set up a call?',
      lastMessageTime: '3 days ago',
      unreadCount: 1,
      status: 'active',
      contact: 'Emily Davis',
      position: 'UI/UX Designer'
    }
  ];

  const messages = [
    {
      id: 1,
      conversationId: 1,
      sender: 'employer',
      senderName: 'Sarah Johnson',
      content: 'Hi Alex! We were impressed with your application for the Senior Frontend Developer position.',
      timestamp: '2025-01-15T10:30:00Z',
      isRead: true
    },
    {
      id: 2,
      conversationId: 1,
      sender: 'candidate',
      senderName: 'Alex Thompson',
      content: 'Thank you! I\'m very excited about this opportunity and would love to learn more about the role.',
      timestamp: '2025-01-15T10:45:00Z',
      isRead: true
    },
    {
      id: 3,
      conversationId: 1,
      sender: 'employer',
      senderName: 'Sarah Johnson',
      content: 'Great! We would like to schedule an interview for next week. Are you available on Wednesday or Thursday afternoon?',
      timestamp: '2025-01-15T14:20:00Z',
      isRead: false
    },
    {
      id: 4,
      conversationId: 1,
      sender: 'employer',
      senderName: 'Sarah Johnson',
      content: 'Please let me know your preferred time and we can send you the meeting details.',
      timestamp: '2025-01-15T14:22:00Z',
      isRead: false
    }
  ];

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages.filter(m => m.conversationId === selectedConversation);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Handle sending message
    setNewMessage('');
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Communicate with employers about your applications</p>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                {/* <Badge variant="secondary">{conversations.length}</Badge> */}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {/* {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-accent/50 border-b ${
                      selectedConversation === conversation.id ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversation.companyLogo} />
                        <AvatarFallback>
                          <Building className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{conversation.company}</h4>
                          <div className="flex items-center gap-1">
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs h-5">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {conversation.lastMessageTime}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{conversation.position}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))} */}
              </div>
            </CardContent>
          </Card>

          {/* Message Thread */}
          <Card className="lg:col-span-2 flex flex-col">
            {/* {currentConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={currentConversation.companyLogo} />
                        <AvatarFallback>
                          <Building className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{currentConversation.company}</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentConversation.position} • {currentConversation.contact}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'candidate'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span>
                            {!message.isRead && message.sender === 'employer' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[80px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation to start messaging</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
