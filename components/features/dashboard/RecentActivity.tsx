import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Eye, Calendar, AlertCircle } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      user: 'Darren Wright',
      action: 'viewed 15 candidate profiles for the Software Developer position',
      time: '10:15 AM',
      type: 'view'
    },
    {
      user: 'Caren Smith',
      action: 'scheduled interviews with 3 candidates for the Marketing Manager role',
      time: '9:50 AM',
      type: 'schedule'
    },
    {
      user: 'System',
      action: 'Automated Reminder sent to Bob Lee to complete interview feedback',
      time: '9:30 AM',
      type: 'reminder'
    },
    {
      user: 'Ahmed Hassan',
      action: 'submitted application for Senior Engineer position',
      time: '8:45 AM',
      type: 'application'
    },
    {
      user: 'Sarah Johnson',
      action: 'updated job requirements for Graphic Designer role',
      time: '8:20 AM',
      type: 'update'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'schedule':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'reminder':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'view':
        return 'bg-blue-50 text-blue-700';
      case 'schedule':
        return 'bg-green-50 text-green-700';
      case 'reminder':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm font-medium text-muted-foreground mb-3">Today</div>
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-1 rounded-full bg-gray-100">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{' '}
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
