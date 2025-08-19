
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';

const CountriesTab = () => {
  const countriesData = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 
    'Antarctica', 'Antigua And Barbuda', 'Argentina', 'Armenia', 'Australia'
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Countries</h2>
          <p className="text-gray-600">Wazifame - The Middle East Job Site Admin Panel</p>
        </div>
        <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">Add New Country</Button>
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
            <TableHead>Country</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countriesData.map((country, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{country}</TableCell>
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

export default CountriesTab;
