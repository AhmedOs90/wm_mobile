
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';

const FeedbackTab = () => {
  const usersFeedbackData = [
    { type: 'General Feedback', name: 'Yara ashraf', email: 'yaraashraf2006@gmail.com', details: 'Talk calmly to the c...', date: '02/24/2025' },
    { type: 'Bug Report', name: 'Saad', email: 'saadcrane1977@gmail.com', details: 'كل ما اكتب علي الموقع', date: '10/17/2024' },
    { type: 'General Feedback', name: 'Abde jemal', email: 'abdulmalekjemal449@gmail.com', details: 'Hi wazifame my name ...', date: '07/08/2024' },
    { type: 'General Feedback', name: 'Mahmoud Ebrahim', email: 'mahmmodelmageko@yahoo.com', details: 'It is nice to see th...', date: '07/05/2024' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Search..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feedback">Feedback Type</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" placeholder="dd/mm/yyyy" className="w-40" />
        <Input type="date" placeholder="dd/mm/yyyy" className="w-40" />
        <Button>Apply</Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersFeedbackData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.type}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.details}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4 text-blue-600" />
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

export default FeedbackTab;
