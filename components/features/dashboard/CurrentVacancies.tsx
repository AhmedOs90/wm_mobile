import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, MapPin, Clock, Users } from 'lucide-react';

const CurrentVacancies = () => {
  const vacancies = [
    {
      title: 'Software Developer',
      type: 'Full-time',
      location: 'Remote',
      salary: '$70K - $90K',
      applicants: 120,
      department: 'Engineering'
    },
    {
      title: 'Graphic Designer',
      type: 'Part-time',
      location: 'Hybrid',
      salary: '$40K - $55K',
      applicants: 75,
      department: 'Marketing'
    },
    {
      title: 'Sales Manager',
      type: 'Full-time',
      location: 'On-site',
      salary: '$65K - $80K',
      applicants: 65,
      department: 'Sales'
    },
    {
      title: 'HR Coordinator',
      type: 'Contract',
      location: 'Remote',
      salary: '$50K - $60K',
      applicants: 45,
      department: 'HR'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-500" />
            Current Vacancies ({vacancies.length * 26})
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="popular">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">See All</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vacancies.map((job, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{job.salary}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-3 w-3" />
                    <span>{job.applicants} Applicants</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentVacancies;
