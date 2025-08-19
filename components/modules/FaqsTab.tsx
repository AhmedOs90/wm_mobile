
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';

const FaqsTab = () => {
  const faqsData = [
    { question: 'How can I keep track of the jobs I\'ve...', answer: 'You can easily track your job applica...', createdAt: 'Jan 06, 2024' },
    { question: 'Can employers contact me directly thr...', answer: 'Yes, employers may contact you throug...', createdAt: 'Jan 06, 2024' },
    { question: 'Does WazifaME offer career advice or ...', answer: 'Yes, we provide a wealth of resources...', createdAt: 'Jan 06, 2024' },
    { question: 'How can I improve my chances of getti...', answer: 'To enhance your visibility to employe...', createdAt: 'Jan 06, 2024' },
    { question: 'What should I do if I encounter techn...', answer: 'If you experience technical issues whi...', createdAt: 'Jan 06, 2024' },
    { question: 'How do I receive notifications about ...', answer: 'You can set up job alerts on WazifaMe...', createdAt: 'Jan 06, 2024' }
  ];

  return (
    <div className="space-y-4">
      <Input placeholder="Search what you need" className="max-w-md" />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqsData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.question}</TableCell>
              <TableCell>{item.answer}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4 text-cyan-600" />
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

export default FaqsTab;
