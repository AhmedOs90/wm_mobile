import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Users, UserCheck, TrendingUp, Award } from 'lucide-react';
import { useState } from 'react';

const UserAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const { data: userStats, isLoading } = useQuery({
    queryKey: ['user-analytics', timeRange],
    queryFn: async () => {
      // Mock user analytics data
      return [
        {
          id: '1',
          date: '2024-01-01',
          total_users: 12500,
          new_users: 250,
          active_users: 8900,
          total_job_seekers: 8000,
          active_job_seekers: 6500,
          total_employers: 4500,
          profile_completion_rate: 85,
          verified_employers: 3200,
          active_employers: 2800,
          cv_uploads: 12000,
          ai_generated_cvs: 3500,
          free_plan_employers: 8000,
          silver_plan_employers: 3500,
          gold_plan_employers: 1000,
          created_at: '2024-01-01T00:00:00Z'
        }
      ];
    }
  });

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const latestData = userStats?.[userStats.length - 1];

  if (isLoading) {
    return <div className="text-center py-8">Loading user analytics...</div>;
  }

  const planDistribution = latestData ? [
    { name: 'Free Plan', value: latestData.free_plan_employers, color: '#8884d8' },
    { name: 'Silver Plan', value: latestData.silver_plan_employers, color: '#82ca9d' },
    { name: 'Gold Plan', value: latestData.gold_plan_employers, color: '#ffc658' }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🧑‍💼 User Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Job Seekers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData?.total_job_seekers?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered candidates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Job Seekers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData?.active_job_seekers?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active in last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData?.total_employers?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData?.profile_completion_rate}%</div>
            <p className="text-xs text-muted-foreground">Average completion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Seeker Registration Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Job Seeker Registration Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="new_job_seekers" stroke="#8884d8" name="New Registrations" />
                <Line type="monotone" dataKey="active_job_seekers" stroke="#82ca9d" name="Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employer Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Employer Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CV Upload Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>CV Upload vs AI Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cv_uploads" fill="#8884d8" name="CV Uploads" />
                <Bar dataKey="ai_generated_cvs" fill="#82ca9d" name="AI Generated" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Job Alerts Created */}
        <Card>
          <CardHeader>
            <CardTitle>Job Alerts Created</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="job_alerts_created" stroke="#ffc658" name="Job Alerts" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed User Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{latestData?.verified_employers}</div>
              <div className="text-sm text-muted-foreground">Verified Employers</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{latestData?.active_employers}</div>
              <div className="text-sm text-muted-foreground">Active Employers</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{latestData?.cv_uploads}</div>
              <div className="text-sm text-muted-foreground">CV Uploads</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{latestData?.ai_generated_cvs}</div>
              <div className="text-sm text-muted-foreground">AI Generated CVs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalytics;
