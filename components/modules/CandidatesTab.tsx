
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Edit, UserPlus } from 'lucide-react';
import ReferralModal from '@/components/features/referrals/ReferralModal';
import ReferralHistory from '@/components/features/referrals/ReferralHistory';

const CandidatesTab = () => {
  const [referralModal, setReferralModal] = useState<{
    isOpen: boolean;
    candidate?: any;
  }>({ isOpen: false });

  // Fetch candidates from database
  const { data: candidates, isLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      // Mock candidates data
      return [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Software Engineer',
          status: 'active',
          skills: ['React', 'TypeScript', 'Node.js'],
          experience_years: 5,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          position: 'Product Manager',
          status: 'active',
          skills: ['Product Strategy', 'Agile', 'User Research'],
          experience_years: 7,
          created_at: '2024-01-02T00:00:00Z'
        }
      ];
    }
  });

  const handleReferCandidate = (candidate: any) => {
    setReferralModal({
      isOpen: true,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        position: candidate.position,
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">Loading candidates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold">{candidates?.length || 0}</div>
            <div className="text-sm text-gray-600">Total Candidates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{candidates?.filter(c => c.status === 'active').length || 0}</div>
            <div className="text-sm text-gray-600">Active Candidates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{candidates?.filter(c => c.skills && c.skills.length > 0).length || 0}</div>
            <div className="text-sm text-gray-600">With Skills Listed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{candidates?.filter(c => c.experience_years && c.experience_years > 0).length || 0}</div>
            <div className="text-sm text-gray-600">With Experience</div>
          </div>
        </div>
        <Input placeholder="Search candidates..." className="w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Candidates Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates?.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div className="font-medium">{candidate.name}</div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {candidate.email}
                      </TableCell>
                      <TableCell>{candidate.position || 'Not specified'}</TableCell>
                      <TableCell>{candidate.experience_years ? `${candidate.experience_years} years` : 'Not specified'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills?.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills && candidate.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={candidate.status === 'active' ? 'default' : 'secondary'}>
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleReferCandidate(candidate)}
                            title="Refer to another company"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <ReferralHistory companyId="company-id-placeholder" type="outgoing" />
        </div>
      </div>

      {/* Referral Modal */}
      {referralModal.candidate && (
        <ReferralModal
          isOpen={referralModal.isOpen}
          onClose={() => setReferralModal({ isOpen: false })}
          candidate={referralModal.candidate}
          referringCompanyId="company-id-placeholder"
        />
      )}
    </div>
  );
};

export default CandidatesTab;
