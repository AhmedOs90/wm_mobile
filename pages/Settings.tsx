import { useState } from 'react';
import Layout from '@/components/shared/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Shield, 
  Lock,
  Settings as SettingsIcon
} from 'lucide-react';
import {
  NotificationSettings,
  PrivacySettings,
  AccountSettings,
  AccountManagement
} from '@/components/features/settings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <Layout>
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </TabsTrigger>
            <TabsTrigger value="management">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="management">
            <AccountManagement />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
