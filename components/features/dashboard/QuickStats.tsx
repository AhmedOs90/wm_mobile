
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Eye, TrendingUp } from 'lucide-react';

const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Jobs with Applications</p>
              <p className="text-2xl font-bold">54</p>
              <p className="text-blue-100 text-xs">4.44% of total jobs</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Active Subscriptions</p>
              <p className="text-2xl font-bold">1</p>
              <p className="text-purple-100 text-xs">100% active rate</p>
            </div>
            <Eye className="h-8 w-8 text-purple-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Employer Approval Rate</p>
              <p className="text-2xl font-bold">96.7%</p>
              <p className="text-green-100 text-xs">29 verified employers</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
