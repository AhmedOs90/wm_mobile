import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatSystemManagement from './ChatSystemManagement';
import ForumManagement from './ForumManagement';
import PollsEventsManager from './PollsEventsManager';
import GamificationManager from './GamificationManager';
import NotificationEngine from './NotificationEngine';
import EngagementAnalytics from './EngagementAnalytics';
import SecurityControls from './SecurityControls';
import EngagementSettings from './EngagementSettings';
import UserInsightsPanel from './UserInsightsPanel';
import BetaExperiments from './BetaExperiments';

const EngagementTabs = () => {
  return (
    <Tabs defaultValue="chat" className="w-full">
      <TabsList className="grid w-full grid-cols-10">
        <TabsTrigger value="chat">Chat System</TabsTrigger>
        <TabsTrigger value="forum">Forum</TabsTrigger>
        <TabsTrigger value="polls">Polls & Events</TabsTrigger>
        <TabsTrigger value="gamification">Gamification</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="user-insights">User Insights</TabsTrigger>
        <TabsTrigger value="experiments">Beta Tests</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="space-y-4">
        <ChatSystemManagement />
      </TabsContent>

      <TabsContent value="forum" className="space-y-4">
        <ForumManagement />
      </TabsContent>

      <TabsContent value="polls" className="space-y-4">
        <PollsEventsManager />
      </TabsContent>

      <TabsContent value="gamification" className="space-y-4">
        <GamificationManager />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <NotificationEngine />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <EngagementAnalytics />
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <SecurityControls />
      </TabsContent>

      <TabsContent value="user-insights" className="space-y-4">
        <UserInsightsPanel />
      </TabsContent>

      <TabsContent value="experiments" className="space-y-4">
        <BetaExperiments />
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <EngagementSettings />
      </TabsContent>
    </Tabs>
  );
};

export default EngagementTabs;
