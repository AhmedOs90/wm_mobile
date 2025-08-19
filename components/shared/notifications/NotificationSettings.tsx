import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TextInput, TouchableOpacity } from 'react-native';
import { Bell, Briefcase, Calendar, Users, Star, CheckCircle, MessageSquare, TrendingUp, Volume2, VolumeX, Smartphone, Mail } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast'; // Optional if using toast system
import ForumDiscussions from '@/components/features/forum/ForumDiscussions';

interface NotificationPreferences {
  [key: string]: {
    enabled: boolean;
    browser: boolean;
    email: boolean;
    sound: boolean;
  };
}

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    jobInvites: { enabled: true, browser: true, email: true, sound: true },
    jobOffers: { enabled: true, browser: true, email: true, sound: true },
    shortlisted: { enabled: true, browser: true, email: true, sound: false },
    interviewInvites: { enabled: true, browser: true, email: true, sound: true },
    interviewReminders: { enabled: true, browser: true, email: false, sound: true },
    applicationUpdates: { enabled: true, browser: true, email: true, sound: false },
    jobMatches: { enabled: true, browser: false, email: true, sound: false },
    profileViews: { enabled: true, browser: false, email: false, sound: false },
    messages: { enabled: true, browser: true, email: false, sound: true },
  });

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    start: '22:00',
    end: '08:00'
  });

  const [frequency, setFrequency] = useState<'instant' | 'hourly' | 'daily'>('instant');
  const [tab, setTab] = useState<'notifications' | 'forum'>('notifications');
  const toast = useToast();

  const notificationTypes = [
    { key: 'jobOffers', icon: CheckCircle, title: 'Job Offers', desc: 'Employer offers you a job' },
    { key: 'jobInvites', icon: Star, title: 'Job Invitations', desc: 'Employer invites you to apply' },
    { key: 'shortlisted', icon: Users, title: 'Shortlisted', desc: 'You are shortlisted' },
    { key: 'interviewInvites', icon: Calendar, title: 'Interview Invitations', desc: 'Employer schedules an interview' },
    { key: 'interviewReminders', icon: Bell, title: 'Interview Reminders', desc: 'Before scheduled interviews' },
    { key: 'applicationUpdates', icon: Briefcase, title: 'Application Updates', desc: 'Status of your application' },
    { key: 'messages', icon: MessageSquare, title: 'Messages', desc: 'New messages' },
    { key: 'jobMatches', icon: TrendingUp, title: 'Job Matches', desc: 'Matching jobs' },
    { key: 'profileViews', icon: Users, title: 'Profile Views', desc: 'Employer viewed your profile' }
  ];

  const updatePref = (type: string, field: keyof NotificationPreferences[string], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Persist to asyncStorage or API if needed
toast.toast({
  title: 'Notification settings saved!',
  description: 'Your preferences have been updated successfully.',
  variant: 'default', // maps to your `toastConfig` in `ToastLib`
});
  };

  return (
    <ScrollView className="p-4">
      <View className="flex-row mb-4">
        <TouchableOpacity onPress={() => setTab('notifications')} className={`flex-1 py-2 ${tab === 'notifications' ? 'bg-blue-600' : 'bg-gray-200'} rounded-l-lg`}>
          <Text className={`text-center ${tab === 'notifications' ? 'text-white' : 'text-black'}`}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('forum')} className={`flex-1 py-2 ${tab === 'forum' ? 'bg-blue-600' : 'bg-gray-200'} rounded-r-lg`}>
          <Text className={`text-center ${tab === 'forum' ? 'text-white' : 'text-black'}`}>Forum</Text>
        </TouchableOpacity>
      </View>

      {tab === 'notifications' ? (
        <>
          {notificationTypes.map(({ key, icon: Icon, title, desc }) => (
            <View key={key} className="mb-6 border p-4 rounded-lg bg-white">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center space-x-2">
                  <Icon size={20} />
                  <View>
                    <Text className="font-medium">{title}</Text>
                    <Text className="text-xs text-gray-500">{desc}</Text>
                  </View>
                </View>
                <Switch
                  value={preferences[key].enabled}
                  onValueChange={(val) => updatePref(key, 'enabled', val)}
                />
              </View>

              {preferences[key].enabled && (
                <View className="mt-4 pl-6">
                  {['browser', 'email', 'sound'].map((field) => (
                    <View key={field} className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center space-x-2">
                        {field === 'sound' ? preferences[key].sound ? <Volume2 size={16} /> : <VolumeX size={16} /> : null}
                        {field === 'email' && <Mail size={16} />}
                        {field === 'browser' && <Smartphone size={16} />}
                        <Text className="capitalize">{field}</Text>
                      </View>
                      <Switch
                        value={preferences[key as string][field as keyof NotificationPreferences[string]]}
                        onValueChange={(val) => updatePref(key as string, field as keyof NotificationPreferences[string], val)}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          <View className="my-6 space-y-4">
            <Text className="font-semibold">Notification Frequency</Text>
            {['instant', 'hourly', 'daily'].map((option) => (
              <TouchableOpacity key={option} onPress={() => setFrequency(option as any)}>
                <Text className={`py-1 ${frequency === option ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="my-6 space-y-4">
            <View className="flex-row justify-between items-center">
              <Text className="font-semibold">Quiet Hours</Text>
              <Switch
                value={quietHours.enabled}
                onValueChange={(val) => setQuietHours(prev => ({ ...prev, enabled: val }))}
              />
            </View>

            {quietHours.enabled && (
              <View className="flex-row justify-between">
                <TextInput
                  value={quietHours.start}
                  onChangeText={(val) => setQuietHours(prev => ({ ...prev, start: val }))}
                  placeholder="Start"
                  className="border rounded px-3 py-2 flex-1 mr-2"
                />
                <TextInput
                  value={quietHours.end}
                  onChangeText={(val) => setQuietHours(prev => ({ ...prev, end: val }))}
                  placeholder="End"
                  className="border rounded px-3 py-2 flex-1 ml-2"
                />
              </View>
            )}
          </View>

          <TouchableOpacity onPress={handleSave} className="bg-blue-600 py-3 rounded-lg">
            <Text className="text-center text-white font-medium">Save Settings</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ForumDiscussions />
      )}
    </ScrollView>
  );
};

export default NotificationSettings;
