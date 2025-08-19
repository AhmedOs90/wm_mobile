
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';

const JobTypesTab = () => {
  const jobTypesData = [
    { id: 1, type: 'Internship', lang: 'en', active: true },
    { id: 2, type: 'Contract', lang: 'en', active: true },
    { id: 3, type: 'Part Time', lang: 'en', active: true },
    { id: 4, type: 'Full Time', lang: 'en', active: true },
    { id: 5, type: 'Freelance', lang: 'en', active: true }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Job types</h2>
        <Button className="bg-cyan-500 hover:bg-cyan-600">Add job type</Button>
      </div>
      
      <div className="flex gap-4 items-center">
        <Input placeholder="Search for a type..." className="max-w-md" />
        <Select defaultValue="EN">
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EN">EN</SelectItem>
            <SelectItem value="AR">AR</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Checkbox id="active-only" />
          <label htmlFor="active-only" className="text-sm">Show Active Only</label>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>lang</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobTypesData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell className="font-medium">{item.type}</TableCell>
              <TableCell>{item.lang}</TableCell>
              <TableCell>
                <span className="text-green-600 font-medium">Active</span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-cyan-500 hover:bg-cyan-600">
                    <Edit className="h-4 w-4 text-white" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600">
                    <Trash2 className="h-4 w-4 text-white" />
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

export default JobTypesTab;
