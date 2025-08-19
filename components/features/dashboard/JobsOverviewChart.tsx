
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Briefcase } from 'lucide-react';

const JobsOverviewChart = () => {
  const jobsData = [
    { name: 'Unlocked', value: 1216, color: '#3b82f6' },
    { name: 'Shortlisted', value: 0, color: '#ef4444' },
    { name: 'Renewed', value: 0, color: '#f59e0b' },
    { name: 'Expired', value: 696, color: '#6b7280' },
    { name: 'With Applications', value: 54, color: '#10b981' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-500" />
          Jobs Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={jobsData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {jobsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {jobsData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span>{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobsOverviewChart;
