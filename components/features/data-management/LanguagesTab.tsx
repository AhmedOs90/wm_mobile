
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

const LanguagesTab = () => {
  const languagesData = [
    { languageEn: 'English', languageAr: 'الإنجليزية' },
    { languageEn: 'Arabic', languageAr: 'عربي' },
    { languageEn: 'French', languageAr: 'فرنسي' },
    { languageEn: 'Spanish', languageAr: 'اسباني' },
    { languageEn: 'German', languageAr: 'ألماني' },
    { languageEn: 'Italian', languageAr: 'إيطالي' },
    { languageEn: 'Chinese', languageAr: 'صيني' },
    { languageEn: 'Japanese', languageAr: 'ياباني' },
    { languageEn: 'Korean', languageAr: 'كوري' },
    { languageEn: 'Russian', languageAr: 'روسي' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Languages</h2>
          <p className="text-gray-600">Wazifame - The Middle East Job Site Admin Panel</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-600">Add New Language</Button>
      </div>
      
      <Input placeholder="Search what you need" className="max-w-md" />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Language EN</TableHead>
            <TableHead>Language AR</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {languagesData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.languageEn}</TableCell>
              <TableCell>{item.languageAr}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-cyan-500 hover:bg-cyan-600">
                  <Edit className="h-4 w-4 text-white" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LanguagesTab;
