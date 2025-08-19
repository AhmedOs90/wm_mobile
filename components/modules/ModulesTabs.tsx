
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubscriptionsTab from './SubscriptionsTab';
import JobsTab from './JobsTab';
import CompaniesTab from './CompaniesTab';
import CandidatesTab from './CandidatesTab';
import BlogsTab from './BlogsTab';
import FaqsTab from './FaqsTab';
import FeedbackTab from './FeedbackTab';

const ModulesTabs = () => {
  return (
    <Tabs defaultValue="subscriptions" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        <TabsTrigger value="jobs">Jobs</TabsTrigger>
        <TabsTrigger value="companies">Companies</TabsTrigger>
        <TabsTrigger value="candidates">Candidates</TabsTrigger>
        <TabsTrigger value="blogs">Manage Blogs</TabsTrigger>
        <TabsTrigger value="faqs">FAQs</TabsTrigger>
        <TabsTrigger value="feedback">Users Feedback</TabsTrigger>
      </TabsList>
      
      <TabsContent value="subscriptions">
        <SubscriptionsTab />
      </TabsContent>
      
      <TabsContent value="jobs">
        <JobsTab />
      </TabsContent>
      
      <TabsContent value="companies">
        <CompaniesTab />
      </TabsContent>
      
      <TabsContent value="candidates">
        <CandidatesTab />
      </TabsContent>
      
      <TabsContent value="blogs">
        <BlogsTab />
      </TabsContent>
      
      <TabsContent value="faqs">
        <FaqsTab />
      </TabsContent>
      
      <TabsContent value="feedback">
        <FeedbackTab />
      </TabsContent>
    </Tabs>
  );
};

export default ModulesTabs;
