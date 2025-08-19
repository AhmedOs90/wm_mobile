
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Edit } from 'lucide-react';

const SubscriptionsTab = () => {
  const subscriptionsData = [
    {
      employer: 'HEBEI FIBER GLASS',
      planName: 'Silver',
      duration: '22/06/2025 - 22/07/2025',
      status: 'ACTIVE',
      quota: '6/20/50'
    },
    {
      employer: 'ESTATE EXPERTS',
      planName: 'Silver',
      duration: '18/02/2025 - 18/03/2025',
      status: 'EXPIRED',
      quota: '3/20/45'
    },
    {
      employer: 'KEEN REAL ESTATE',
      planName: 'Silver',
      duration: '29/01/2025 - 01/03/2025',
      status: 'EXPIRED',
      quota: '3/20/48'
    },
    {
      employer: 'M. H. ENTERPRISE S.A.E.',
      planName: 'Silver',
      duration: '15/01/2025 - 15/02/2025',
      status: 'EXPIRED',
      quota: '5/20/48'
    },
    {
      employer: 'REALOGY PROPERTIES',
      planName: 'Silver',
      duration: '17/10/2024 - 08/01/2025',
      status: 'EXPIRED',
      quota: '1/20/59'
    },
    {
      employer: 'MEETUSAR',
      planName: 'Silver',
      duration: '25/07/2024 - 25/07/2025',
      status: 'ACTIVE (Ending soon)',
      quota: '60/240/720'
    },
    {
      employer: 'I MARKET BUSINESS SUPPORT',
      planName: 'Silver',
      duration: '20/02/2025 - 20/03/2025',
      status: 'EXPIRED',
      quota: '2/20/49'
    },
    {
      employer: 'INFOTECH GLOBAL',
      planName: 'Gold',
      duration: '17/03/2025 - 17/09/2025',
      status: 'ACTIVE',
      quota: '89/300/592'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input placeholder="Search Company..." className="w-64" />
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Subscriptions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subscriptions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Search..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plan">Plan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employer</TableHead>
            <TableHead>Plan Name</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Available Quota (Jobs/Invites/Unlocks)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptionsData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.employer}</TableCell>
              <TableCell>{item.planName}</TableCell>
              <TableCell>{item.duration}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  item.status.includes('ACTIVE') ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell>{item.quota}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4 text-blue-600" />
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

export default SubscriptionsTab;
