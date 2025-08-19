import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, FunnelChart, Funnel, Cell } from 'recharts';
import { TrendingDown, Clock, MousePointer, AlertTriangle } from 'lucide-react';

const ApplicationFunnel = () => {
  const { data: funnelStats, isLoading } = useQuery({
    queryKey: ['application-analytics'],
    queryFn: async () => {
      // Mock application analytics data
      return [
        {
          id: '1',
          date: '2024-01-01',
          applications_viewed: 1250,
          applications_submitted: 890,
          drop_off_job_view: 360,
          drop_off_application_start: 200,
          external_clicks: 150,
          avg_time_to_apply: 4.5,
          created_at: '2024-01-01T00:00:00Z'
        }
      ];
    }
  });

  const latestData = funnelStats?.[funnelStats.length - 1];

  if (isLoading) {
    return <div className="text-center py-8">Loading application funnel analytics...</div>;
  }

  // Calculate success rate
  const successRate = latestData ? 
    ((latestData.applications_submitted / latestData.applications_viewed) * 100).toFixed(1) : 0;

  // Funnel data for visualization
  const funnelData = latestData ? [
    { name: 'Job Views', value: latestData.applications_viewed, fill: '#8884d8' },
    { name: 'Application Started', value: latestData.applications_viewed - latestData.drop_off_job_view, fill: '#82ca9d' },
    { name: 'Application Submitted', value: latestData.applications_submitted, fill: '#ffc658' },
    { name: 'External Clicks', value: latestData.external_clicks, fill: '#ff7c7c' }
  ] : [];

  // Drop-off analysis
  const dropOffData = latestData ? [
    { stage: 'Job View', dropOff: latestData.drop_off_job_view, color: '#ff7c7c' },
    { stage: 'Application Start', dropOff: latestData.drop_off_application_start, color: '#ffc658' }
  ] : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">👤 Application Funnel Metrics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Submitted</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData?.applications_submitted?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">View to application rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Apply</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData?.avg_time_to_apply} min</div>
            <p className="text-xs text-muted-foreground">Average application time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">External Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData?.external_clicks?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Redirect job clicks</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={funnelStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="applications_submitted" stroke="#8884d8" name="Submitted" />
                <Line type="monotone" dataKey="applications_viewed" stroke="#82ca9d" name="Viewed" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Drop-off Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Drop-off Points Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dropOffData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dropOff" fill="#ff7c7c" name="Drop-offs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Application Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Application Funnel Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {funnelData.map((item, index) => (
              <div key={item.name} className="text-center">
                <div 
                  className="mx-auto mb-2 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: item.fill,
                    height: `${60 + (4 - index) * 20}px`,
                    width: `${80 + (4 - index) * 20}px`
                  }}
                >
                  <span className="text-white font-bold text-lg">
                    {item.value?.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-medium">{item.name}</p>
                {index > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {((item.value / funnelData[0].value) * 100).toFixed(1)}% conversion
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time to Apply Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Time to Apply Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={funnelStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avg_time_to_apply" stroke="#ffc658" name="Avg Time (minutes)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Funnel Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Funnel Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{latestData?.applications_viewed?.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Job Views</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{latestData?.drop_off_job_view?.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Drop-off at View</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{latestData?.drop_off_application_start?.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Drop-off at Start</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{latestData?.external_clicks?.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">External Redirects</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationFunnel;
