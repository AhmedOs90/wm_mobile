import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Mail, Bell, Eye, Bookmark } from 'lucide-react';

const EngagementMetrics = () => {
  // Mock data - would come from database
  const engagementData = [
    { date: '2025-01-03', alerts_sent: 1234, email_opens: 567, email_clicks: 123, profile_views: 890 },
    { date: '2025-01-04', alerts_sent: 1456, email_opens: 634, email_clicks: 145, profile_views: 945 },
    { date: '2025-01-05', alerts_sent: 1598, email_opens: 723, email_clicks: 167, profile_views: 1012 }
  ];

  const latestData = engagementData[engagementData.length - 1];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📬 Engagement Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts Sent</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.alerts_sent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Job alerts sent today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Opens</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.email_opens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Email engagement rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.profile_views.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Candidate profiles viewed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Clicks</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.email_clicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Click-through rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="email_opens" stroke="#8884d8" name="Opens" />
                <Line type="monotone" dataKey="email_clicks" stroke="#82ca9d" name="Clicks" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="alerts_sent" fill="#8884d8" name="Alerts Sent" />
                <Bar dataKey="profile_views" fill="#82ca9d" name="Profile Views" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EngagementMetrics;
