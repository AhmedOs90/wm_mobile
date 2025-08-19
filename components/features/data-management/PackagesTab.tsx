
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit, Calendar as CalendarIcon, Gift, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/mockSupabase';
import { useToast } from '@/hooks/use-toast';

interface Package {
  id: string;
  title: string;
  price: number;
  invites: number;
  jobs: number;
  unlocks: number;
  status: string;
  sort_order: number;
}

interface UserSegment {
  id: string;
  name: string;
  description: string;
}

interface PromotionalPackage {
  id: string;
  package_id: string;
  is_promotional: boolean;
  eligibility_group: string;
  promo_start_date: string;
  promo_end_date: string;
}

const PackagesTab = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [userSegments, setUserSegments] = useState<UserSegment[]>([]);
  const [promotionalPackages, setPromotionalPackages] = useState<PromotionalPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPromotional, setIsPromotional] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState('');
  const [promoStartDate, setPromoStartDate] = useState<Date>();
  const [promoEndDate, setPromoEndDate] = useState<Date>();
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
    fetchUserSegments();
    fetchPromotionalPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch packages",
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

  const fetchPromotionalPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('promotional_packages')
        .select('*');
      
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

  const handleEditPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    const promoPackage = promotionalPackages.find(p => p.package_id === pkg.id);
    setIsPromotional(promoPackage?.is_promotional || false);
    setSelectedSegment(promoPackage?.eligibility_group || '');
    setPromoStartDate(promoPackage?.promo_start_date ? new Date(promoPackage.promo_start_date) : undefined);
    setPromoEndDate(promoPackage?.promo_end_date ? new Date(promoPackage.promo_end_date) : undefined);
    setIsEditDialogOpen(true);
  };

  const handleSavePackage = async () => {
    if (!selectedPackage) return;

    try {
      if (isPromotional) {
        const promoPackage = promotionalPackages.find(p => p.package_id === selectedPackage.id);
        
        if (promoPackage) {
          // Update existing promotional package
          const { error } = await supabase
            .from('promotional_packages')
            .update({
              is_promotional: isPromotional,
              eligibility_group: selectedSegment,
              promo_start_date: promoStartDate?.toISOString(),
              promo_end_date: promoEndDate?.toISOString(),
            })
            .eq('id', promoPackage.id);
          
          if (error) throw error;
        } else {
          // Create new promotional package
          const { error } = await supabase
            .from('promotional_packages')
            .insert({
              package_id: selectedPackage.id,
              is_promotional: isPromotional,
              eligibility_group: selectedSegment,
              promo_start_date: promoStartDate?.toISOString(),
              promo_end_date: promoEndDate?.toISOString(),
            });
          
          if (error) throw error;
        }
      } else {
        // Remove promotional status if exists
        const promoPackage = promotionalPackages.find(p => p.package_id === selectedPackage.id);
        if (promoPackage) {
          const { error } = await supabase
            .from('promotional_packages')
            .delete()
            .eq('id', promoPackage.id);
          
          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: "Package updated successfully",
      });

      setIsEditDialogOpen(false);
      fetchPromotionalPackages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update package",
        variant: "destructive",
      });
    }
  };

  const getPromoPackage = (packageId: string) => {
    return promotionalPackages.find(p => p.package_id === packageId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Packages</h2>
          <p className="text-gray-600">Wazifame - The Middle East Job Site Admin Panel</p>
        </div>
        <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">Add New Package</Button>
      </div>
      
      <Input placeholder="Search what you need" className="max-w-md" />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Invites</TableHead>
            <TableHead>Jobs</TableHead>
            <TableHead>Unlocks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => {
            const promoPackage = getPromoPackage(pkg.id);
            const isPromo = promoPackage?.is_promotional;
            
            return (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {pkg.title}
                    {isPromo && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        <Gift className="h-3 w-3 mr-1" />
                        PROMO
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>${pkg.price}</TableCell>
                <TableCell>{pkg.invites}</TableCell>
                <TableCell>{pkg.jobs}</TableCell>
                <TableCell>{pkg.unlocks}</TableCell>
                <TableCell>
                  <span className="text-green-600 font-medium">{pkg.status}</span>
                </TableCell>
                <TableCell>
                  {isPromo ? (
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-orange-600">
                        <Users className="h-3 w-3" />
                        {promoPackage.eligibility_group}
                      </div>
                      {promoPackage.promo_end_date && (
                        <div className="text-gray-500">
                          Expires: {format(new Date(promoPackage.promo_end_date), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">Standard</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0 bg-cyan-500 hover:bg-cyan-600"
                    onClick={() => handleEditPackage(pkg)}
                  >
                    <Edit className="h-4 w-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Select defaultValue="20">
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-600">
          Showing 1 to {packages.length} of {packages.length} entries | Page 1
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Edit Package Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Package: {selectedPackage?.title}</DialogTitle>
            <DialogDescription>
              Configure promotional settings for this package.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="promotional"
                checked={isPromotional}
                onCheckedChange={setIsPromotional}
              />
              <Label htmlFor="promotional">Mark as Promotional</Label>
            </div>
            
            {isPromotional && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="segment">Eligibility Group</Label>
                  <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {userSegments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.name}>
                          {segment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Promo Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !promoStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {promoStartDate ? format(promoStartDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={promoStartDate}
                        onSelect={setPromoStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label>Promo End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !promoEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {promoEndDate ? format(promoEndDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={promoEndDate}
                        onSelect={setPromoEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePackage}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackagesTab;
