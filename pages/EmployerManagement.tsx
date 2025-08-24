import { useState } from 'react';
import { 
  Bell, 
  ChevronRight, 
  Settings, 
  Users, 
  Eye, 
  Search, 
  Building2, 
  Briefcase,
  FileText,
  MoreVertical,
  Edit,
  X,
  Filter,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  Phone,
  Mail,
  User,
  Archive,
  Unlock,
  BookOpen,
  Heart,
  MessageSquare,
  Plus
} from 'lucide-react';
import Layout from '@/components/shared/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const EmployerManagement = () => {
  const [selectedSection, setSelectedSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'company-info', label: 'Company info', icon: Building2 },
    { id: 'subscription', label: 'My subscription', icon: FileText },
    { id: 'jobs', label: 'My jobs', icon: Briefcase },
    { id: 'contact-preferences', label: 'Contact preferences', icon: Settings },
    { id: 'alerts', label: 'Alerts settings', icon: Bell },
    { id: 'account', label: 'Account settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-slate-800 to-slate-600 rounded-lg p-8 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">UI/UX</h1>
                    <p className="text-slate-200 mt-1">Transforming complex problems into elegant user experiences.</p>
                  </div>
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            {/* Company Profile Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                      IT
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-semibold text-gray-900">Infotech Global</h2>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <Star className="h-3 w-3 mr-1" />
                          Rank - 122
                        </Badge>
                      </div>
                      <p className="text-gray-600 mt-1">Information Processing</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        Cairo, Egypt
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">15 days left</div>
                    <Badge variant="default" className="bg-green-100 text-green-700">Silver</Badge>
                    <p className="text-xs text-gray-500 mt-1">My subscription</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">Public view</Button>
                  <Button variant="outline" size="sm">Share my profile</Button>
                </div>
              </CardContent>
            </Card>

            {/* About Company */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-900">
                  About the company
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Our team comprises of industry experts collaborating from multiple countries to offer 
                  clients the necessary services that enable them to make well-informed decisions, 
                  ultimately benefiting their organizations. With over a decade of combined experience in 
                  the field, we leverage our extensive regional expertise to swiftly detect anomalous patterns.
                </p>
                <Button variant="link" className="p-0 h-auto text-blue-600 mt-2">More...</Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">102</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">1248</div>
                  <div className="text-sm text-gray-600">Job views</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">598</div>
                  <div className="text-sm text-gray-600">Candidates applied</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">122</div>
                  <div className="text-sm text-gray-600">Candidates unlocked</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'company-info':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-gray-900">General Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company-name">Employer / Company name *</Label>
                    <Input id="company-name" placeholder="Enter your employer / company name" defaultValue="Infotech Global" />
                  </div>
                  <div>
                    <Label htmlFor="slogan">Slogan</Label>
                    <Input id="slogan" placeholder="Enter your slogan" defaultValue="Information Processing" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="about">About your company *</Label>
                  <Textarea id="about" rows={4} placeholder="Give a good brief about your company..." 
                    defaultValue="Our team comprises of industry experts collaborating from multiple countries to offer clients the necessary services..." />
                  <div className="text-xs text-gray-500 mt-1">0 / 4000</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-gray-900">More Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">Information Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="employees">Number of employees</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your no. of employees" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="founded">Founded in</Label>
                    <Input id="founded" type="date" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="ceo">CEO/Chairman name</Label>
                  <Input id="ceo" placeholder="Enter the CEO's name" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Current Subscription</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                <CardContent className="p-4 text-center">
                  <Button variant="default" className="w-full mb-4 bg-orange-500 hover:bg-orange-600">Silver</Button>
                  <Button variant="outline" className="w-full">Gold</Button>
                  <Button variant="outline" className="w-full mt-2">Diamond</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Button variant="default" className="w-full mb-4 bg-orange-500 hover:bg-orange-600">Monthly</Button>
                  <Button variant="outline" className="w-full">6 months</Button>
                  <Button variant="outline" className="w-full mt-2">Yearly</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-orange-600 mb-2">2,500EGP/month</div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Upgrade ≫≫</Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-500">7 days left</div>
                <div className="text-xs text-gray-400">Jun 17, 2025 - Jul 17, 2025</div>
                <div className="text-lg font-semibold text-gray-900 mt-2">Due date</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">90 jobs used</div>
                <div className="text-lg font-semibold text-red-600 mt-2">Jobs used</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">39900 unlocks</div>
                <div className="text-lg font-semibold text-green-600 mt-2">Unlocks</div>
              </div>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Jobs</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post a new job
              </Button>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active jobs</TabsTrigger>
                <TabsTrigger value="inactive">Inactive jobs</TabsTrigger>
                <TabsTrigger value="closed">Closed jobs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-orange-600 font-medium">6 Active jobs found</div>
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Newest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {[1, 2, 3, 4, 5, 6].map((job) => (
                  <Card key={job} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">Senior Frontend Developer - Vue.js 3</h3>
                            <Badge variant="outline" className="text-green-700 border-green-300">Egypt - Cairo</Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <Badge variant="secondary">Hybrid</Badge>
                            <span>Full time</span>
                            <span>Salary: 26K - 30K EGP</span>
                            <span>Exp: 3 - 5 years (non managerial)</span>
                          </div>
                          
                          <div className="flex items-center space-x-6 mt-3 text-sm text-gray-600">
                            <span>22 Candidates applied</span>
                            <span>19 Viewed</span>
                            <span>8 Unselected</span>
                            <span>11 Selected</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-green-600 font-medium">16 days left</div>
                          <div className="text-xs text-gray-500">Posted 3 month ago</div>
                          <div className="text-xs text-gray-500">Expires: 23/07/2025</div>
                          
                          <div className="flex items-center space-x-2 mt-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'contact-preferences':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Preferences</h2>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900">Allow candidates to contact us</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="bg-green-100 text-green-700">YES</Button>
                    <Button variant="outline" size="sm">NO</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Candidates can reach out to you through the communication method you've selected.</p>
                <p className="font-medium text-gray-900">Select the contact info to show on your company profile.</p>
                
                <div className="grid grid-cols-5 gap-4 mt-4">
                  <Button variant="outline" className="bg-orange-100 border-orange-300">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="bg-orange-100 border-orange-300">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-900">
                  Contact Info
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900">+20 1003462969</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900">+20 1277070842</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900">+20 1003462969</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900">Ebraam.af@gmail.com (Main)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900">Ebraamayman@outlook.com</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Alerts Settings</h2>
            <p className="text-gray-600">Select what notifications or alerts you would like to consensually receive.</p>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-gray-900">I'd like to get notified when :</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  'A candidate follow my profile.',
                  'A candidate applied for my job.',
                  'A candidate accept my invitation.',
                  'A candidate accept my invitation.',
                  'When I get an instant message.',
                  'My job post is about to expire',
                  'My subscription is about to expire.'
                ].map((notification, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded"></div>
                    </div>
                    <span className="text-gray-700">{notification}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Email notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-gray-700 font-medium">I'd like to receive emails of :</div>
                
                {[
                  { label: 'A candidate applied for my job.', frequency: 'Weekly' },
                  { label: 'A candidate accept my invitation.', frequency: 'Daily' },
                  { label: 'When I get an instant message.', frequency: 'Monthly' },
                  { label: 'My job post is about to expire.', frequency: 'Monthly' },
                  { label: 'My subscription is about to expire.', frequency: 'Weekly', checked: false },
                  { label: 'Waziifame news & updates', frequency: 'Monthly', special: true }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        item.checked === false ? 'border-2 border-gray-300' : 'bg-orange-500'
                      }`}>
                        {item.checked !== false && <div className="w-2 h-2 bg-white rounded"></div>}
                      </div>
                      <span className={`${item.special ? 'text-blue-600' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    </div>
                    <Select>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder={item.frequency} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Email & Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-900">Ebraam.af@gmail.com</span>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-4 w-4 text-gray-600">🔒</div>
                    <span className="text-gray-900">••••••••••••</span>
                  </div>
                  <Button variant="outline" size="sm">Change / Update</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900">Manage users</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600 border-b">
                        <th className="pb-2">NAME</th>
                        <th className="pb-2">STATUS</th>
                        <th className="pb-2">TYPE</th>
                        <th className="pb-2">EMAIL</th>
                        <th className="pb-2">CREATED AT</th>
                        <th className="pb-2"></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { name: 'Ahmed S.', status: 'Inactive', type: 'User', email: 'dolcebi@gmail.com', date: 'Apr 30' },
                        { name: 'Diaa S.', status: 'Active', type: 'Admin', email: 'tuo1233soki@gmail.com', date: 'Mar 30' },
                        { name: 'Karim A.', status: 'Active', type: 'User', email: 'doloptahk@gmail.com', date: 'Feb 30' },
                        { name: 'Hana E.', status: 'Active', type: 'Admin', email: 'akoeJJMi@gmail.com', date: 'Jan 30' }
                      ].map((user, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{user.name}</td>
                          <td className="py-2">
                            <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} 
                                   className={user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-2">{user.type}</td>
                          <td className="py-2">{user.email}</td>
                          <td className="py-2">{user.date}</td>
                          <td className="py-2">
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Language</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900">English</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Account deactivation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  By deactivating your account you will not be able to apply to new jobs, or following up 
                  your applications. your account will not be deleted for 1 year of this deactivation, and 
                  during this duration you will be able to restore it.
                </p>
                <Button variant="destructive">Deactivate</Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Employer Management</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback>EA</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="p-4">
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSection === item.id
                        ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployerManagement;
