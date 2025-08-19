
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';

const JobPositionsTab = () => {
  const jobPositionsData = [
    { id: 1, position: 'Accountant', category: 'Accounts, Finances & insurance' },
    { id: 2, position: 'Actor/Actress', category: 'Performing Arts & Entertainment' },
    { id: 3, position: 'Aerospace Engineer', category: 'Airline & Aviation' },
    { id: 4, position: 'Air Traffic Controller', category: 'Airline & Aviation' },
    { id: 5, position: 'Aircraft Mechanic', category: 'Airline & Aviation' },
    { id: 6, position: 'Animator', category: 'Other' },
    { id: 7, position: 'Architect', category: 'Real Estate & Construction' },
    { id: 8, position: 'Art Director', category: 'Design/Creative/Art' },
    { id: 9, position: 'Artist', category: 'Design/Creative/Art' },
    { id: 10, position: 'Attorney', category: 'Legal' },
    { id: 11, position: 'Audiologist', category: 'Other' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Job Positions</h2>
        <Button className="bg-cyan-500 hover:bg-cyan-600">Add Job Position</Button>
      </div>
      
      <div className="flex gap-4 items-center">
        <Input placeholder="Search for a position..." className="max-w-md" />
        <Select defaultValue="name">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="category">Sort by Category</SelectItem>
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
            <TableHead>Position</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobPositionsData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell className="font-medium">{item.position}</TableCell>
              <TableCell>{item.category}</TableCell>
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

export default JobPositionsTab;
