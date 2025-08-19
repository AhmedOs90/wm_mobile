
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const TrendsChart = () => {
  const trendsData = [
    { month: 'Jan', jobs: 1200, candidates: 350, employers: 28 },
    { month: 'Feb', jobs: 1180, candidates: 380, employers: 25 },
    { month: 'Mar', jobs: 1216, candidates: 396, employers: 30 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Monthly Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="candidates" stroke="#8b5cf6" strokeWidth={2} />
            <Line type="monotone" dataKey="employers" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrendsChart;
