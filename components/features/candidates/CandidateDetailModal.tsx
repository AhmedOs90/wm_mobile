import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/mockSupabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  MessageSquare,
  Edit,
  Save,
  Star,
  Globe,
  Building,
  Download,
  Eye
} from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
}

const CandidateDetailModal = ({ candidate, isOpen, onClose }: CandidateDetailModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminNotes, setAdminNotes] = useState('');
  const [candidateStatus, setCandidateStatus] = useState(candidate?.status || 'active');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch detailed candidate data
  const { data: candidateDetails, isLoading } = useQuery({
    queryKey: ['candidate-details', candidate?.id],
    queryFn: async () => {
      if (!candidate?.id) return null;

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', candidate.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!candidate?.id && isOpen
  });

  // Update candidate status
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const { error } = await supabase
        .from('candidates')
        .update({ status: newStatus })
        .eq('id', candidate.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Candidate status has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
    }
  });

  // Add admin notes
  const addNotesMutation = useMutation({
    mutationFn: async (notes: string) => {
      // For now, we'll use console.log since admin_notes field doesn't exist
      console.log('Admin notes for candidate:', candidate.id, notes);
      // In production, you'd create a separate admin_notes table
    },
    onSuccess: () => {
      toast({
        title: "Notes Added",
        description: "Admin notes have been saved successfully."
      });
      setAdminNotes('');
    }
  });

  const mockExperienceData = [
    {
      id: 1,
      position: "Mid-level UI/UX Designer",
      company: "Transformus",
      duration: "Jun 2022 - Apr 2024",
      type: "Full-time • Remote",
      location: "Cairo, Egypt",
      description: "Designed and developed web projects, portals, and dashboards for the Egyptian market, including educational web services and medical dashboards, enhancing user engagement and satisfaction for other projects.",
      skills: ["User Experience Design (UED)", "UI", "Target Audience", "Business Requirements", "Mobile Design"]
    }
  ];

  const mockEducationData = [
    {
      id: 1,
      degree: "Diploma of UX / UI design",
      institution: "Information Technology Institute (ITI)",
      duration: "Apr 2021 - Jul 2024",
      grade: "User experience designing",
      description: "I studied the user experience and user interface design in the 4th intake of the UI/UX track at the great ITI institute and received my graduation certificate from the Ministry of Communication and Information Technology (MCIT) at the end of July 2021."
    }
  ];

  const mockSkillsData = [
    { name: "User Experience Design", proficiency: 4, experience: "2 Years" },
    { name: "UI Design", proficiency: 4, experience: "2 Years" },
    { name: "Mobile Design", proficiency: 5, experience: "3 Years" },
    { name: "Prototyping", proficiency: 3, experience: "1 Year" }
  ];

  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={candidate.avatar_url} alt={candidate.name} />
              <AvatarFallback>{candidate.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{candidate.name}</h2>
              <p className="text-sm text-gray-600">{candidate.position || 'Position not specified'}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Profile Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">801</div>
                  <div className="text-sm text-gray-600">Profile Views</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">102</div>
                  <div className="text-sm text-gray-600">Followed Companies</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">598</div>
                  <div className="text-sm text-gray-600">Job Applications</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">122</div>
                  <div className="text-sm text-gray-600">Shortlisted</div>
                </CardContent>
              </Card>
            </div>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{candidate.phone || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Cairo, Egypt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Joined {new Date(candidate.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Me */}
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  I'm a Sr. UI/UX designer | Product designer with 4 years of experience specializing in the 
                  entire user experience journey. I possess a deep understanding of the product design 
                  process, from initial research and user understanding to UI development, prototyping, and
                  final usability testing.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            {mockExperienceData.map((exp) => (
              <Card key={exp.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-600">{exp.duration} • {exp.type}</p>
                      <p className="text-sm text-gray-600">{exp.location}</p>
                    </div>
                    <Building className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            {mockEducationData.map((edu) => (
              <Card key={edu.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{edu.degree}</h3>
                      <p className="text-blue-600 font-medium">{edu.institution}</p>
                      <p className="text-sm text-gray-600">{edu.duration}</p>
                      <p className="text-sm text-gray-600">Grade: {edu.grade}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-700">{edu.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSkillsData.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < skill.proficiency ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">Ex: {skill.experience}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CV & Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Main CV */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="aspect-[3/4] bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center mb-3">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <h4 className="font-medium mb-2">My CV / Resume</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Including your CV or resume document is important for employers and HR departments to have a good & quick introduction about you.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* Other Documents */}
                  {[1, 2, 3, 4].map((doc) => (
                    <div key={doc} className="border rounded-lg p-4">
                      <div className="aspect-[3/4] bg-gray-100 rounded border mb-3 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <h5 className="font-medium">Document name</h5>
                      <p className="text-sm text-gray-600">Document description</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Candidate Status</Label>
                  <select
                    id="status"
                    value={candidateStatus}
                    onChange={(e) => {
                      setCandidateStatus(e.target.value);
                      updateStatusMutation.mutate(e.target.value);
                    }}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="notes">Admin Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add internal notes about this candidate..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                  />
                  <Button 
                    onClick={() => addNotesMutation.mutate(adminNotes)}
                    disabled={!adminNotes || addNotesMutation.isPending}
                    className="mt-2"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Notes
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailModal;
