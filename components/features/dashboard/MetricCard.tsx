
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const MetricCard = ({ title, value, change, changeType, icon: Icon, color }: MetricCardProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          {changeType === 'up' ? (
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
          ) : changeType === 'down' ? (
            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
          ) : null}
          {change}
        </p>
      )}
    </CardContent>
  </Card>
);

export default MetricCard;
