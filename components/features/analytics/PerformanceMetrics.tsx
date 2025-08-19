import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Zap, Users, Clock, AlertCircle } from 'lucide-react';

const PerformanceMetrics = () => {
  // Mock data - would come from database
  const performanceData = [
    { date: '2025-01-03', load_time: 1.2, response_time: 0.8, active_users: 12450, session_duration: 8.5, bounce_rate: 24.3, errors: 12 },
    { date: '2025-01-04', load_time: 1.1, response_time: 0.7, active_users: 13200, session_duration: 9.2, bounce_rate: 22.1, errors: 8 },
    { date: '2025-01-05', load_time: 1.3, response_time: 0.9, active_users: 14100, session_duration: 8.8, bounce_rate: 25.7, errors: 15 }
  ];

  const latestData = performanceData[performanceData.length - 1];

  const apiEndpoints = [
    { endpoint: '/api/jobs', avg_response: 0.45, requests: 15420 },
    { endpoint: '/api/candidates', avg_response: 0.62, requests: 12340 },
    { endpoint: '/api/applications', avg_response: 0.38, requests: 8950 },
    { endpoint: '/api/search', avg_response: 0.71, requests: 7620 }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📈 General Performance Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Load Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.load_time}s</div>
            <p className="text-xs text-muted-foreground">Site load time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.active_users.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Daily active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.session_duration} min</div>
            <p className="text-xs text-muted-foreground">Average session time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.bounce_rate}%</div>
            <p className="text-xs text-muted-foreground">Bounce rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="load_time" stroke="#8884d8" name="Load Time (s)" />
                <Line type="monotone" dataKey="response_time" stroke="#82ca9d" name="API Response (s)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="active_users" stackId="1" stroke="#8884d8" fill="#8884d8" name="Active Users" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Endpoint Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <div key={endpoint.endpoint} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{endpoint.endpoint}</p>
                    <p className="text-sm text-muted-foreground">{endpoint.requests.toLocaleString()} requests</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{endpoint.avg_response}s</p>
                    <p className="text-sm text-muted-foreground">avg response</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="errors" stroke="#ff7c7c" name="Error Count" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="session_duration" stroke="#8884d8" name="Session Duration (min)" />
              <Line type="monotone" dataKey="bounce_rate" stroke="#ff7c7c" name="Bounce Rate (%)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{latestData.load_time}s</div>
              <div className="text-sm text-muted-foreground">Load Time</div>
              <div className="text-xs text-green-600">Good</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{latestData.active_users.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">DAU</div>
              <div className="text-xs text-blue-600">Growing</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{latestData.session_duration}m</div>
              <div className="text-sm text-muted-foreground">Session Time</div>
              <div className="text-xs text-purple-600">Healthy</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{latestData.bounce_rate}%</div>
              <div className="text-sm text-muted-foreground">Bounce Rate</div>
              <div className="text-xs text-orange-600">Acceptable</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
