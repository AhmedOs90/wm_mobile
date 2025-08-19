import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown,
  ChevronRight,
  Edit,
  Mail,
  Phone,
  Globe,
  Building,
  User,
  MapPin,
  Calendar,
  Star,
  FileText,
  Download,
  Eye,
  Plus,
  MoreHorizontal
} from 'lucide-react';

interface CandidateProfileViewProps {
  candidate: any;
  activeSection: string;
}

const CandidateProfileView = ({ candidate, activeSection }: CandidateProfileViewProps) => {
  const [openSections, setOpenSections] = useState({
    personalInfo: true,
    experience: false,
    education: false,
    certificates: false,
    courses: false,
    skills: false,
    documents: false,
    achievements: false,
    workPreferences: false,
    contactInfo: false,
    introVideo: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <Edit className="h-4 w-4" />
        </div>
        <div className="absolute right-0 top-0 opacity-20">
          <div className="text-6xl font-bold">UI/UX</div>
          <div className="text-sm">Transforming complex problems into elegant user experiences.</div>
        </div>
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src={candidate.avatar_url} alt={candidate.name} />
            <AvatarFallback className="text-2xl bg-white text-purple-600">
              {candidate.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{candidate.name}</h1>
              <Badge className="bg-blue-500 text-white">✓</Badge>
            </div>
            <p className="text-lg opacity-90 mb-2">UI/UX Designer / Product designer</p>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Star className="h-4 w-4 fill-current" />
              <span>Rank: 122</span>
              <MapPin className="h-4 w-4 ml-2" />
              <span>Cairo, Egypt</span>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-full p-4 mb-2">
              <div className="text-2xl font-bold">75%</div>
            </div>
            <div className="text-sm opacity-80">Complete my profile</div>
          </div>
        </div>
        
        {/* Social Links */}
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Globe className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
            <Globe className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
            <Globe className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-green-500 hover:bg-green-600">
            <Globe className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-red-500 hover:bg-red-600">
            <Globe className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <Edit className="h-4 w-4 mr-2" />
            Upload my CV
          </Button>
          <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <Globe className="h-4 w-4 mr-2" />
            Public view
          </Button>
          <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <User className="h-4 w-4 mr-2" />
            Share my profile
          </Button>
        </div>
      </div>

      {/* About Me */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">About me</h3>
            <Edit className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            I'm a Sr. UI/UX designer | Product designer with 4 years of experience specializing in the 
            entire user experience journey. I possess a deep understanding of the product design 
            process, from initial research and user understanding to UI development, prototyping, and
            final usability testing.
          </p>
          <Button variant="link" className="p-0 mt-2 text-blue-600">
            More...
          </Button>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">801</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                Profile Views
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">102</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                Followed companies
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">598</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                Job applications
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">122</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                Shortlisted
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collapsible Sections */}
      <div className="space-y-4">
        {/* Personal Info */}
        <Collapsible open={openSections.personalInfo} onOpenChange={() => toggleSection('personalInfo')}>
          <CollapsibleTrigger className="w-full">
            <Card className="hover:bg-gray-50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Personal info</h3>
                  {openSections.personalInfo ? 
                    <ChevronDown className="h-5 w-5" /> : 
                    <ChevronRight className="h-5 w-5" />
                  }
                </div>
              </CardContent>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Ebraam Ayman Farhat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🇪🇬 Egypt</span>
                    <span className="text-sm">♂ Male</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">28 Jun, 1996</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Married</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Exempted from service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Arabic (Native), English (Professional)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Egypt, Cairo gov. - New Cairo - Address in details...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Not ready to relocate</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">✓ Account verification</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Your account isn't verified yet 🔥 Start verification process
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Experience */}
        <Collapsible open={openSections.experience} onOpenChange={() => toggleSection('experience')}>
          <CollapsibleTrigger className="w-full">
            <Card className="hover:bg-gray-50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Experience</h3>
                  {openSections.experience ? 
                    <ChevronDown className="h-5 w-5" /> : 
                    <ChevronRight className="h-5 w-5" />
                  }
                </div>
              </CardContent>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center text-white font-bold">
                      T
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Mid-level UI/UX Designer at Transformus</h4>
                      <p className="text-sm text-gray-600">Jun 2022 → Apr 2024 • 1Y, 3M</p>
                      <p className="text-sm text-gray-600">Full-time • Remotely • Cairo, Egypt</p>
                      <Button variant="ghost" size="sm" className="p-0 h-auto mt-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Other sections would follow the same pattern */}
      </div>
    </div>
  );

  // Render different sections based on activeSection
  switch (activeSection) {
    case 'overview':
      return renderOverview();
    case 'personal-info':
      return <div>Personal Info Content</div>;
    case 'qualifications':
      return <div>Qualifications Content</div>;
    // Add other cases as needed
    default:
      return renderOverview();
  }
};

export default CandidateProfileView;
