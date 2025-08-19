import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { supabase } from '@/lib/mockSupabase';
import { useToast } from '@/hooks/use-toast';

interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: any;
  created_at: string;
}

const SegmentManagementTab = () => {
  const [segments, setSegments] = useState<UserSegment[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<UserSegment | null>(null);
  const [segmentName, setSegmentName] = useState('');
  const [segmentDescription, setSegmentDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_segments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSegments(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user segments",
        variant: "destructive",
      });
    }
  };

  const handleAddSegment = () => {
    setSegmentName('');
    setSegmentDescription('');
    setIsAddDialogOpen(true);
  };

  const handleEditSegment = (segment: UserSegment) => {
    setSelectedSegment(segment);
    setSegmentName(segment.name);
    setSegmentDescription(segment.description || '');
    setIsEditDialogOpen(true);
  };

  const handleSaveSegment = async (isEdit = false) => {
    if (!segmentName.trim()) {
      toast({
        title: "Error",
        description: "Segment name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEdit && selectedSegment) {
        const { error } = await supabase
          .from('user_segments')
          .update({
            name: segmentName,
            description: segmentDescription,
          })
          .eq('id', selectedSegment.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Segment updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('user_segments')
          .insert({
            name: segmentName,
            description: segmentDescription,
            criteria: {}, // Default empty criteria
          });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Segment created successfully",
        });
      }

      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedSegment(null);
      setSegmentName('');
      setSegmentDescription('');
      fetchSegments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message.includes('duplicate') 
          ? "A segment with this name already exists" 
          : "Failed to save segment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSegment = async (segment: UserSegment) => {
    if (!confirm(`Are you sure you want to delete the segment "${segment.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_segments')
        .delete()
        .eq('id', segment.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Segment deleted successfully",
      });
      
      fetchSegments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete segment",
        variant: "destructive",
      });
    }
  };

  const filteredSegments = segments.filter(segment => 
    segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (segment.description && segment.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSegmentUserCount = (segmentName: string) => {
    // Mock user counts - in real app, this would be calculated based on criteria
    const mockCounts: { [key: string]: number } = {
      'New Users': 245,
      'Premium Users': 89,
      'Inactive Users': 156,
      'All Users': 1420,
    };
    return mockCounts[segmentName] || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Segment Management</h2>
          <p className="text-gray-600">Define user segments for promotional targeting</p>
        </div>
        <Button onClick={handleAddSegment} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Segment
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <Input
            placeholder="Search segments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>User Count</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSegments.map((segment) => (
              <TableRow key={segment.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    {segment.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {segment.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getSegmentUserCount(segment.name)} users
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(segment.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditSegment(segment)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteSegment(segment)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Segment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Segment</DialogTitle>
            <DialogDescription>
              Create a new user segment for promotional targeting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Segment Name</Label>
              <Input
                id="name"
                placeholder="e.g., VIP Customers"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the criteria for this segment..."
                value={segmentDescription}
                onChange={(e) => setSegmentDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSaveSegment(false)}>
              Create Segment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Segment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Segment</DialogTitle>
            <DialogDescription>
              Update the segment details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Segment Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., VIP Customers"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe the criteria for this segment..."
                value={segmentDescription}
                onChange={(e) => setSegmentDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSaveSegment(true)}>
              Update Segment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SegmentManagementTab;
