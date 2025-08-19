
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Briefcase, UserCheck, Building2 } from 'lucide-react';
import MetricCard from './MetricCard';
import JobsOverviewChart from './JobsOverviewChart';
import CandidatesOverviewChart from './CandidatesOverviewChart';
import TrendsChart from './TrendsChart';
import RecentCandidates from './RecentCandidates';
import LatestJobPositions from './LatestJobPositions';
import QuickStats from './QuickStats';
import ApplicationPipeline from './ApplicationPipeline';
import ApplicationsByDepartment from './ApplicationsByDepartment';
import CurrentVacancies from './CurrentVacancies';
import RecentActivity from './RecentActivity';
import TasksSchedule from './TasksSchedule';
import ReferralWidget from './ReferralWidget';
import NotificationBanner from '@/components/shared/notifications/NotificationBanner';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  // Fetch dashboard metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      // Mock dashboard metrics data
      return [
        {
          metric_name: 'new_users',
          current_value: 1250,
          percentage_change: 12.5,
          change_type: 'up'
        },
        {
          metric_name: 'total_jobs',
          current_value: 3420,
          percentage_change: 8.2,
          change_type: 'up'
        },
        {
          metric_name: 'active_candidates',
          current_value: 8900,
          percentage_change: -2.1,
          change_type: 'down'
        },
        {
          metric_name: 'verified_employers',
          current_value: 456,
          percentage_change: 15.3,
          change_type: 'up'
        }
      ];
    }
  });

  const getMetricData = (metricName: string) => {
    const metric = metrics?.find(m => m.metric_name === metricName);
    if (!metric) return { value: '0', change: '0%', changeType: 'neutral' as const };
    
    const changeSign = metric.percentage_change > 0 ? '+' : '';
    return {
      value: metric.current_value.toLocaleString(),
      change: `${changeSign}${metric.percentage_change}% from last month`,
      changeType: (metric.change_type as 'neutral' | 'up' | 'down') || 'neutral'
    };
  };

  if (metricsLoading) {
    return <div className="p-6 bg-gray-50 min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBanner companyId="company-id-placeholder" />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Application Pipeline */}
      <ApplicationPipeline />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="New Users"
          value={getMetricData('new_users').value}
          change={getMetricData('new_users').change}
          changeType={getMetricData('new_users').changeType}
          icon={Users}
          color="text-blue-500"
        />
        <MetricCard
          title="Total Jobs"
          value={getMetricData('total_jobs').value}
          change={getMetricData('total_jobs').change}
          changeType={getMetricData('total_jobs').changeType}
          icon={Briefcase}
          color="text-green-500"
        />
        <MetricCard
          title="Active Candidates"
          value={getMetricData('active_candidates').value}
          change={getMetricData('active_candidates').change}
          changeType={getMetricData('active_candidates').changeType}
          icon={UserCheck}
          color="text-purple-500"
        />
        <MetricCard
          title="Verified Employers"
          value={getMetricData('verified_employers').value}
          change={getMetricData('verified_employers').change}
          changeType={getMetricData('verified_employers').changeType}
          icon={Building2}
          color="text-cyan-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <JobsOverviewChart />
        <CandidatesOverviewChart />
        <ApplicationsByDepartment />
      </div>

      {/* Trends Chart */}
      <TrendsChart />

      {/* Referral Statistics */}
      <ReferralWidget companyId="company-id-placeholder" />

      {/* Current Vacancies */}
      <CurrentVacancies />

      {/* Tasks and Schedule */}
      <TasksSchedule />

      {/* Data Tables and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentCandidates />
        <LatestJobPositions />
        <RecentActivity />
      </div>

      {/* Quick Stats */}
      <QuickStats />
    </div>
  );
};

export default Dashboard;
