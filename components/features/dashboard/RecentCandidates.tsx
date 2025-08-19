
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck } from 'lucide-react';

const RecentCandidates = () => {
  const recentCandidates = [
    { name: 'مصطفى صبح', email: '01125637958dd@gmail.com', type: 'CANDIDATE', status: 'active' },
    { name: 'Eman Elkassar', email: 'eman.elkassar86@gmail.com', type: 'CANDIDATE', status: 'active' },
    { name: 'Mona Afifi', email: 'fytyf@gmail.com', type: 'CANDIDATE', status: 'pending' },
    { name: 'Ahmed Mohamed', email: 'ahmedmohamed335522@gmail.com', type: 'CANDIDATE', status: 'active' },
    { name: 'Mohamed Baddar', email: 'mohamed.magh10@gmail.com', type: 'CANDIDATE', status: 'inactive' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-blue-500" />
          Recent Candidates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCandidates.map((candidate, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-sm">{candidate.name}</p>
                <p className="text-xs text-gray-600">{candidate.email}</p>
              </div>
              <Badge 
                variant={candidate.status === 'active' ? 'default' : candidate.status === 'pending' ? 'secondary' : 'destructive'}
                className="text-xs"
              >
                {candidate.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCandidates;
