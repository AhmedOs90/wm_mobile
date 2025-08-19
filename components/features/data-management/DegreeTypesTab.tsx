
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';

const DegreeTypesTab = () => {
  const degreeTypesData = [
    { degreeType: 'GCSE / iGCSE', degreeLevel: 'O-Levels' },
    { degreeType: 'Short Course / O-Level', degreeLevel: 'A-Levels' },
    { degreeType: 'Diploma / HND', degreeLevel: 'Diploma / HND' },
    { degreeType: 'A-Levels', degreeLevel: 'Secondary Education' },
    { degreeType: 'Bachelors in Architecture', degreeLevel: 'Bachelors Degree' },
    { degreeType: 'Bachelors in Arts', degreeLevel: 'Bachelors Degree' },
    { degreeType: 'Bachelors in Business Administration', degreeLevel: 'Bachelors Degree' },
    { degreeType: 'Bachelors in Commerce', degreeLevel: 'Bachelors Degree' },
    { degreeType: 'Bachelors in Computer Science', degreeLevel: 'Bachelors Degree' },
    { degreeType: 'Bachelors of Dental Surgery', degreeLevel: 'Bachelors Degree' },
    { degreeType: 'Bachelors in Economics', degreeLevel: 'Bachelors Degree' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Degree Types</h2>
          <p className="text-gray-600">Wazifame - The Middle East Job Site Admin Panel</p>
        </div>
        <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">Add New Degree Type</Button>
      </div>
      
      <div className="flex gap-4 items-center">
        <Input placeholder="Search what you need" className="max-w-md" />
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Translation Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Translations</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Degree Type</TableHead>
            <TableHead>Degree Level</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {degreeTypesData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.degreeType}</TableCell>
              <TableCell>{item.degreeLevel}</TableCell>
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

export default DegreeTypesTab;
