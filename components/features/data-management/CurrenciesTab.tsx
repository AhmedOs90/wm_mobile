
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

const CurrenciesTab = () => {
  const currenciesData = [
    'AED', 'BHD', 'DZD', 'EGP', 'EUR', 'GBP', 'JOD', 'KWD', 'LBP', 'MAD', 'OMR'
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Currencies</h2>
          <p className="text-gray-600">Wazifame - The Middle East Job Site Admin Panel</p>
        </div>
        <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">Add New Currency</Button>
      </div>
      
      <Input placeholder="Search what you need" className="max-w-md" />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Currency</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currenciesData.map((currency, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{currency}</TableCell>
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

export default CurrenciesTab;
