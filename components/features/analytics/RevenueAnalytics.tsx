import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';

const RevenueAnalytics = () => {
  // Mock data - would come from database
  const revenueData = [
    { date: '2025-01-03', total_revenue: 15420, silver_revenue: 8950, gold_revenue: 6470, subscriptions: 45, cancellations: 3 },
    { date: '2025-01-04', total_revenue: 16780, silver_revenue: 9320, gold_revenue: 7460, subscriptions: 52, cancellations: 5 },
    { date: '2025-01-05', total_revenue: 18234, silver_revenue: 10150, gold_revenue: 8084, subscriptions: 48, cancellations: 2 }
  ];

  const latestData = revenueData[revenueData.length - 1];

  const planRevenue = [
    { name: 'Silver Plan', value: latestData.silver_revenue, color: '#82ca9d' },
    { name: 'Gold Plan', value: latestData.gold_revenue, color: '#ffc658' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">💳 Subscription & Revenue Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${latestData.total_revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Subscriptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.subscriptions}</div>
            <p className="text-xs text-muted-foreground">New paid subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancellations</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestData.cancellations}</div>
            <p className="text-xs text-muted-foreground">Subscription cancellations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((latestData.cancellations / latestData.subscriptions) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Monthly churn rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total_revenue" stroke="#8884d8" name="Total Revenue" />
                <Line type="monotone" dataKey="silver_revenue" stroke="#82ca9d" name="Silver Revenue" />
                <Line type="monotone" dataKey="gold_revenue" stroke="#ffc658" name="Gold Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="subscriptions" fill="#82ca9d" name="New Subscriptions" />
              <Bar dataKey="cancellations" fill="#ff7c7c" name="Cancellations" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueAnalytics;
