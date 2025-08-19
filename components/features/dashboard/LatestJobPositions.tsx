
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Building2 } from 'lucide-react';

const LatestJobPositions = () => {
  const jobPositions = [
    { title: 'Estimation Engineer', company: 'Waziifame', country: 'United Arab Emirates' },
    { title: 'Graduate Electrical Engineer', company: 'Waziifame', country: 'United Arab Emirates' },
    { title: 'Principal Safety & Risk Engineer (Oil & Gas)', company: 'Waziifame', country: 'Saudi Arabia' },
    { title: 'Senior Verification And Validation Lead Engineer', company: 'Waziifame', country: 'Saudi Arabia' },
    { title: 'Principal Engineer/Associate - Roads & Highways', company: 'Waziifame', country: 'Saudi Arabia' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-green-500" />
          Latest Job Positions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobPositions.map((job, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-medium text-sm mb-1">{job.title}</p>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {job.company}
                </span>
                <span>{job.country}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestJobPositions;
