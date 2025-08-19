
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LanguagesTab from './LanguagesTab';
import JobTypesTab from './JobTypesTab';
import JobPositionsTab from './JobPositionsTab';
import CategoriesTab from './CategoriesTab';
import CurrenciesTab from './CurrenciesTab';
import CitiesTab from './CitiesTab';
import StatesTab from './StatesTab';
import CountriesTab from './CountriesTab';
import PackagesTab from './PackagesTab';
import UserAssignmentTab from './UserAssignmentTab';
import SegmentManagementTab from './SegmentManagementTab';
import IndustriesTab from './IndustriesTab';
import SkillsTab from './SkillsTab';
import DegreeLevelsTab from './DegreeLevelsTab';
import DegreeTypesTab from './DegreeTypesTab';
import PositionTypesTab from './PositionTypesTab';

const AttributesTabs = () => {
  return (
    <Tabs defaultValue="job-management" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="job-management">Job Management</TabsTrigger>
        <TabsTrigger value="user-skills">Skills & Education</TabsTrigger>
        <TabsTrigger value="location">Location & Currency</TabsTrigger>
        <TabsTrigger value="system">System & Packages</TabsTrigger>
        <TabsTrigger value="content">Content & Language</TabsTrigger>
      </TabsList>
      
      <TabsContent value="job-management" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoriesTab />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Job Types</CardTitle>
            </CardHeader>
            <CardContent>
              <JobTypesTab />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Job Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <JobPositionsTab />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Position Types</CardTitle>
            </CardHeader>
            <CardContent>
              <PositionTypesTab />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="user-skills" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills Management</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsTab />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Degree Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <DegreeLevelsTab />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Degree Types</CardTitle>
            </CardHeader>
            <CardContent>
              <DegreeTypesTab />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Industries</CardTitle>
            </CardHeader>
            <CardContent>
              <IndustriesTab />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="location" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <CountriesTab />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>States</CardTitle>
            </CardHeader>
            <CardContent>
              <StatesTab />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cities</CardTitle>
            </CardHeader>
            <CardContent>
              <CitiesTab />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Currencies</CardTitle>
            </CardHeader>
            <CardContent>
              <CurrenciesTab />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="system" className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Promotional Package Management</CardTitle>
            </CardHeader>
            <CardContent>
              <PackagesTab />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Assignment & Promo Grants</CardTitle>
            </CardHeader>
            <CardContent>
              <UserAssignmentTab />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Segment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <SegmentManagementTab />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="content" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguagesTab />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AttributesTabs;
