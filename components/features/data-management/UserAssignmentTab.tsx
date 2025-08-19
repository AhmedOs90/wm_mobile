import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserPlus, Calendar as CalendarIcon, Gift, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/mockSupabase';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  current_package: string;
  status: string;
}

interface PromotionalPackage {
  id: string;
  package_id: string;
  is_promotional: boolean;
  eligibility_group: string;
  promo_start_date: string;
  promo_end_date: string;
  packages: {
    title: string;
  };
}

interface UserSegment {
  id: string;
  name: string;
  description: string;
}

const UserAssignmentTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [promotionalPackages, setPromotionalPackages] = useState<PromotionalPackage[]>([]);
  const [userSegments, setUserSegments] = useState<UserSegment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState('');
  const [selectedPromoPackage, setSelectedPromoPackage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);
  const [promoExpiresDate, setPromoExpiresDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchPromotionalPackages();
    fetchUserSegments();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock users data - in real app, this would come from your users table
      const mockUsers: User[] = [
        { id: '1', email: 'user1@example.com', name: 'John Doe', current_package: 'Free', status: 'Active' },
        { id: '2', email: 'user2@example.com', name: 'Jane Smith', current_package: 'Silver', status: 'Active' },
        { id: '3', email: 'user3@example.com', name: 'Bob Johnson', current_package: 'Gold', status: 'Inactive' },
        { id: '4', email: 'user4@example.com', name: 'Alice Brown', current_package: 'Free', status: 'Active' },
      ];
      setUsers(mockUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const fetchPromotionalPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('promotional_packages')
        .select(`
          *,
          packages (
            title
          )
        `)
        .eq('is_promotional', true);
      
      if (error) throw error;
      setPromotionalPackages(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch promotional packages",
        variant: "destructive",
      });
    }
  };

  const fetchUserSegments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_segments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setUserSegments(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user segments",
        variant: "destructive",
      });
    }
  };

  const handleBulkAssign = async () => {
    if (!selectedSegment || !selectedPromoPackage) {
      toast({
        title: "Error",
        description: "Please select both segment and promotional package",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, you would filter users by segment criteria
      // For now, we'll simulate bulk assignment
      const targetUsers = users.filter(user => user.status === 'Active'); // Example criteria
      
      for (const user of targetUsers) {
        await supabase
          .from('user_promotional_assignments')
          .insert({
            user_id: user.id,
            promotional_package_id: selectedPromoPackage,
            promo_expires_date: promoExpiresDate?.toISOString(),
            previous_package_id: null, // Would be the user's current package ID
          });
      }

      toast({
        title: "Success",
        description: `Promotional package assigned to ${targetUsers.length} users`,
      });

      setSelectedSegment('');
      setSelectedPromoPackage('');
      setPromoExpiresDate(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign promotional packages",
        variant: "destructive",
      });
    }
  };

  const handleGrantPromo = (user: User) => {
    setSelectedUser(user);
    setIsGrantDialogOpen(true);
  };

  const handleSaveGrant = async () => {
    if (!selectedUser || !selectedPromoPackage) return;

    try {
      await supabase
        .from('user_promotional_assignments')
        .insert({
          user_id: selectedUser.id,
          promotional_package_id: selectedPromoPackage,
          promo_expires_date: promoExpiresDate?.toISOString(),
          previous_package_id: null, // Would be the user's current package ID
        });

      toast({
        title: "Success",
        description: `Promotional package granted to ${selectedUser.name}`,
      });

      setIsGrantDialogOpen(false);
      setSelectedUser(null);
      setSelectedPromoPackage('');
      setPromoExpiresDate(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to grant promotional package",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Assignment</h2>
          <p className="text-gray-600">Assign promotional packages to users</p>
        </div>
      </div>

      {/* Bulk Assignment Section */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk Assignment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>User Segment</Label>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger>
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                {userSegments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Promotional Package</Label>
            <Select value={selectedPromoPackage} onValueChange={setSelectedPromoPackage}>
              <SelectTrigger>
                <SelectValue placeholder="Select package" />
              </SelectTrigger>
              <SelectContent>
                {promotionalPackages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.packages?.title} - {pkg.eligibility_group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !promoExpiresDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {promoExpiresDate ? format(promoExpiresDate, "PPP") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={promoExpiresDate}
                  onSelect={setPromoExpiresDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-end">
            <Button onClick={handleBulkAssign} className="w-full">
              Assign to Segment
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Current Package</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.current_package}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGrantPromo(user)}
                    className="flex items-center gap-2"
                  >
                    <Gift className="h-4 w-4" />
                    Grant Promo
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Grant Promo Dialog */}
      <Dialog open={isGrantDialogOpen} onOpenChange={setIsGrantDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Grant Promotional Package</DialogTitle>
            <DialogDescription>
              Grant a promotional package to {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Promotional Package</Label>
              <Select value={selectedPromoPackage} onValueChange={setSelectedPromoPackage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  {promotionalPackages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.packages?.title} - {pkg.eligibility_group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !promoExpiresDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {promoExpiresDate ? format(promoExpiresDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={promoExpiresDate}
                    onSelect={setPromoExpiresDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGrantDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGrant}>
              Grant Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAssignmentTab;
