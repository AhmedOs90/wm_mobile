import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, TrendingUp, Eye, Clock } from 'lucide-react';

const JobAnalytics = () => {
  const { data: jobStats, isLoading } = useQuery({
    queryKey: ['job-analytics'],
    queryFn: async () => {
      // Mock job analytics data
      return [
        {
          id: '1',
          date: '2024-01-01',
          total_jobs: 3420,
          new_jobs: 125,
          active_jobs: 2800,
          completed_jobs: 620,
          avg_time_to_fill: 15.5,
          total_active_jobs: 2800,
          avg_job_views: 45.2,
          avg_applications_per_job: 12.8,
          expired_jobs: 180,
          jobs_posted_free: 2000,
          jobs_posted_silver: 1200,
          jobs_posted_gold: 220,
          created_at: '2024-01-01T00:00:00Z'
        }
      ];
    }
  });

  const latestData = jobStats?.[jobStats.length - 1];

  if (isLoading) {
    return <div className="text-center py-8">Loading job analytics...</div>;
  }

  const planDistribution = latestData ? [
    { name: 'Free Jobs', value: latestData.jobs_posted_free, color: '#8884d8' },
    { name: 'Silver Jobs', value: latestData.jobs_posted_silver, color: '#82ca9d' },
    { name: 'Gold Jobs', value: latestData.jobs_posted_gold, color: '#ffc658' }
  ] : [];

  // Mock sector data - would come from database in real implementation
  const sectorData = [
    { name: 'Technology', jobs: 456, applications: 3420 },
    { name: 'Finance', jobs: 234, applications: 1890 },
    { name: 'Healthcare', jobs: 189, applications: 1560 },
    { name: 'Education', jobs: 156, applications: 1200 },
    { name: 'Marketing', jobs: 134, applications: 980 },
    { name: 'Sales', jobs: 123, applications: 876 }
  ];

  // Mock location data
  const locationData = [
    { name: 'Cairo', jobs: 342, heat: 95 },
    { name: 'Dubai', jobs: 287, heat: 85 },
    { name: 'Riyadh', jobs: 234, heat: 75 },
    { name: 'Amman', jobs: 189, heat: 65 },
    { name: 'Kuwait', jobs: 156, heat: 55 }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📄 Job Activity Analytics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData?.total_active_jobs?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Currently active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Job Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData?.avg_job_views}</div>
            <p className="text-xs text-muted-foreground">Views per listing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Applications</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData?.avg_applications_per_job}</div>
            <p className="text-xs text-muted-foreground">Applications per job</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData?.expired_jobs}</div>
            <p className="text-xs text-muted-foreground">Recently expired</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Posting Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Job Posting Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={jobStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total_active_jobs" stroke="#8884d8" name="Active Jobs" />
                <Line type="monotone" dataKey="total_applications" stroke="#82ca9d" name="Applications" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Jobs by Plan Type */}
        <Card>
          <CardHeader>
            <CardTitle>Jobs by Plan Type</CardTitle>
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
        {/* Job Sectors Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Job Sectors with Most Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobs" fill="#8884d8" name="Jobs" />
                <Bar dataKey="applications" fill="#82ca9d" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location-based Job Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Location-based Job Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobs" fill="#8884d8" name="Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Job Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Job Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{latestData?.jobs_posted_free}</div>
              <div className="text-sm text-muted-foreground">Free Plan Jobs</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{latestData?.jobs_posted_silver}</div>
              <div className="text-sm text-muted-foreground">Silver Plan Jobs</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{latestData?.jobs_posted_gold}</div>
              <div className="text-sm text-muted-foreground">Gold Plan Jobs</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{latestData?.avg_job_views}</div>
              <div className="text-sm text-muted-foreground">Avg Views</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600">{latestData?.expired_jobs}</div>
              <div className="text-sm text-muted-foreground">Expired Jobs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobAnalytics;
