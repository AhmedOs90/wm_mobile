
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Edit, Plus } from 'lucide-react';

const CompaniesTab = () => {
  const companiesData = [
    { name: 'ARAB OPERATORS GROUP', email: 'followup@aog-sa.com', verified: 'Yes', createdAt: 'Jul 02, 2025' },
    { name: 'ELITE INVESTMENT', email: 'karemfathy101@gmail.com', verified: 'Yes', createdAt: 'Jul 01, 2025' },
    { name: 'MARCO ASWM', email: 'marcoasem32@gmail.com', verified: 'No', createdAt: 'Jul 01, 2025' },
    { name: 'ABDELRAHMAN ASHRAF', email: 'abdoalkber021@gmail.com', verified: 'Yes', createdAt: 'Jun 30, 2025' },
    { name: 'MARSALEX', email: 'Marsalex.eg@gmail.com', verified: 'Yes', createdAt: 'Jun 30, 2025' },
    { name: 'KARAM', email: 'karamelwrdany@gmail.com', verified: 'Yes', createdAt: 'Jun 30, 2025' },
    { name: 'EGYPTIAN EQUESTRIAN FEDERATION', email: 'mohamed.adly697@gmail.com', verified: 'Yes', createdAt: 'Jun 30, 2025' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Companies</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      
      <Input placeholder="Search what you need" className="max-w-md" />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Email Verified</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companiesData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.verified === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.verified}
                </span>
              </TableCell>
              <TableCell>{item.createdAt}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4 text-cyan-600" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4 text-orange-600" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4 text-green-600" />
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

export default CompaniesTab;
