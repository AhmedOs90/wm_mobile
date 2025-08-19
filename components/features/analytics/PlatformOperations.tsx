import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Clock, AlertTriangle, Ban, Flag } from 'lucide-react';

const PlatformOperations = () => {
  // Mock data - would come from database
  const operationsData = [
    { date: '2025-01-03', approval_time: 2.4, reported_ads: 12, rejected_posts: 8, flagged_posts: 5 },
    { date: '2025-01-04', approval_time: 2.1, reported_ads: 15, rejected_posts: 11, flagged_posts: 7 },
    { date: '2025-01-05', approval_time: 2.8, reported_ads: 9, rejected_posts: 6, flagged_posts: 3 }
  ];

  const latestData = operationsData[operationsData.length - 1];

  const moderationStats = [
    { category: 'Inappropriate Content', count: 45, color: '#ff7c7c' },
    { category: 'Spam/Duplicate', count: 32, color: '#ffc658' },
    { category: 'Missing Information', count: 28, color: '#8884d8' },
    { category: 'Fake Job Posts', count: 15, color: '#82ca9d' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🛠️ Platform Operations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Approval Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.approval_time} hrs</div>
            <p className="text-xs text-muted-foreground">Job post approval time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reported Ads</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.reported_ads}</div>
            <p className="text-xs text-muted-foreground">Reported content today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Posts</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.rejected_posts}</div>
            <p className="text-xs text-muted-foreground">Posts rejected today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Posts</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.flagged_posts}</div>
            <p className="text-xs text-muted-foreground">Posts under review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Approval Time Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={operationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="approval_time" stroke="#8884d8" name="Approval Time (hrs)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={operationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reported_ads" fill="#ff7c7c" name="Reported" />
                <Bar dataKey="rejected_posts" fill="#ffc658" name="Rejected" />
                <Bar dataKey="flagged_posts" fill="#8884d8" name="Flagged" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moderation Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moderationStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Reports" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality Control Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-800">High Priority Issues</p>
                  <p className="text-sm text-red-600">Requires immediate attention</p>
                </div>
                <div className="text-2xl font-bold text-red-600">{latestData.reported_ads}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-800">Under Review</p>
                  <p className="text-sm text-yellow-600">Currently being processed</p>
                </div>
                <div className="text-2xl font-bold text-yellow-600">{latestData.flagged_posts}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Processing Time</p>
                  <p className="text-sm text-green-600">Average resolution time</p>
                </div>
                <div className="text-2xl font-bold text-green-600">{latestData.approval_time}h</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moderationStats.map((stat, index) => (
                <div key={stat.category} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{stat.category}</p>
                    <div 
                      className="w-20 h-2 rounded-full mt-2"
                      style={{ backgroundColor: stat.color }}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{stat.count}</p>
                    <p className="text-sm text-muted-foreground">cases</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformOperations;
