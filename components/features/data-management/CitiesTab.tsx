
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';

const CitiesTab = () => {
  const citiesData = [
    { city: 'Abay', state: 'Abai', country: 'Kazakhstan' },
    { city: 'Anding', state: 'Tainan', country: 'Taiwan' },
    { city: 'Beitun', state: 'Taichung', country: 'Taiwan' },
    { city: "G'ozg'on", state: 'Navoiy', country: 'Uzbekistan' },
    { city: 'Sarmin', state: 'Idlib Governorate (Idlib)', country: 'Syria' },
    { city: 'Am-Djarass', state: 'Ennedi-Est', country: 'Chad' },
    { city: 'Anaco', state: 'Anzoátegui', country: 'Venezuela' },
    { city: 'Arichuna', state: 'Apure', country: 'Venezuela' },
    { city: 'Bardai', state: 'Tibesti', country: 'Chad' },
    { city: 'Bernau bei Berlin', state: 'Brandenburg', country: 'Germany' },
    { city: 'Besut', state: 'Terengganu', country: 'Malaysia' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">City</h2>
          <p className="text-gray-600">Wazifame - The Middle East Job Site Admin Panel</p>
        </div>
      </div>
      
      <div className="flex gap-4 items-center">
        <Input placeholder="Search what you need" className="max-w-md" />
        <Select defaultValue="search">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="search">Search...</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="search2">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="search2">Search...</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Translations</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {citiesData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.city}</TableCell>
              <TableCell>{item.state}</TableCell>
              <TableCell>{item.country}</TableCell>
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

export default CitiesTab;
