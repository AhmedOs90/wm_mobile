
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Plus } from 'lucide-react';

const JobsTab = () => {
  const jobsData = [
    { title: 'Senior Project Control Engineer', company: '', city: '', postedDate: 'Jul 03, 2025', expiredOn: 'Jul 16, 2025' },
    { title: 'Mechanical Engineer--Qalyoub', company: '', city: '', postedDate: 'Jul 03, 2025', expiredOn: 'Jul 15, 2025' },
    { title: 'Telecom Security Design Tech Lead', company: '', city: '', postedDate: 'Jul 03, 2025', expiredOn: 'Jul 16, 2025' },
    { title: 'Service Engineer - Alexandria', company: '', city: '', postedDate: 'Jul 03, 2025', expiredOn: 'Jul 16, 2025' },
    { title: 'Senior MLOps Engineer', company: '', city: '', postedDate: 'Jul 03, 2025', expiredOn: 'Jul 16, 2025' },
    { title: 'Medical Equipment Planning Engineer', company: '', city: '', postedDate: 'Jul 03, 2025', expiredOn: 'Jul 16, 2025' },
    { title: 'Jr Rolling Stock Technical Engineer', company: '', city: '', postedDate: 'Jul 03, 2025', expiredOn: 'Jul 17, 2025' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Jobs</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <p className="text-gray-600">WazifaME - The Middle East Job Site Admin Panel</p>
      
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search a job title" className="flex-1" />
        <div className="flex gap-2">
          <Input placeholder="Search a company" className="w-48" />
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sort">Sort by</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Search..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="country">Country</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Search..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Any Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" placeholder="dd/mm/yyyy" className="w-40" />
        <Input type="date" placeholder="dd/mm/yyyy" className="w-40" />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Posted Date</TableHead>
            <TableHead>Expired On</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobsData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.company}</TableCell>
              <TableCell>{item.city}</TableCell>
              <TableCell>{item.postedDate}</TableCell>
              <TableCell>{item.expiredOn}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4 text-cyan-600" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobsTab;
