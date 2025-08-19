
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';

const BlogsTab = () => {
  const blogsData = [
    { title: 'Introduction to Remote Jobs...', content: 'Introduction to Remote Job...', active: 'Active', lastUpdated: 'May 01, 2025' },
    { title: 'Land Your Dream Job Faster...', content: 'Have you ever wondered why...', active: 'Active', lastUpdated: 'Apr 17, 2025' },
    { title: 'Top Skills Employers Are De...', content: 'In today\'s competitive lan...', active: 'Active', lastUpdated: 'Apr 14, 2025' },
    { title: 'How to Stand Out in Egypt\'s...', content: '# How to Stand Out in Egyp...', active: 'Active', lastUpdated: 'Apr 12, 2025' },
    { title: 'How to Develop Your Profess...', content: 'How to Develop Your Profes...', active: 'Active', lastUpdated: 'Feb 28, 2025' },
    { title: 'Future Careers in Egypt: Wh...', content: 'Future Careers in Egypt: W...', active: 'Active', lastUpdated: 'Feb 28, 2025' },
    { title: 'Career Change: How to Succe...', content: 'Career Change: How to Succ...', active: 'Active', lastUpdated: 'Feb 25, 2025' }
  ];

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Last updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogsData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.content}</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-full text-xs bg-cyan-100 text-cyan-800">
                  {item.active}
                </span>
              </TableCell>
              <TableCell>{item.lastUpdated}</TableCell>
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

export default BlogsTab;
