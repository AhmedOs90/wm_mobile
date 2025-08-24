import Layout from '@/components/shared/layout/Layout';
import { JobSearchResults } from '@/components/features/jobs';
import { JobSearchProvider, useJobSearch } from '@/contexts/JobSearchContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Search, Bookmark, MapPin, Briefcase, Clock, Building2, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { candidateJobsControllerGetFavourite, candidateJobsControllerSaveJob } from '@sdk.gen.ts';
import { useAuth } from '@/hooks/useAuth';

const SavedJobsContent = () => {
  const { userId } = useAuth();

  
  const { data: savedJobsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['savedJobs'],
    queryFn: () => candidateJobsControllerGetFavourite({ query: { page: 1, limit: 100 } }),
    enabled: !!userId
  });

  const savedJobs = savedJobsResponse?.data?.data || [];

  const handleUnsaveJob = async (jobId: string) => {
    try {
      await candidateJobsControllerSaveJob({ body: { jobId } });
      refetch(); 
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  };

  const handleApplyToJob = (jobId: string) => {
    
    window.location.href = `/jobs/${jobId}`;
  };


  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

 
  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Error Loading Saved Jobs</CardTitle>
              <CardDescription className="text-center">
                There was an issue loading your saved jobs. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => refetch()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Fixed header section */}
        <div className="flex-shrink-0 p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bookmark className="h-8 w-8 text-primary" />
                Saved Jobs
              </h1>
              <p className="text-gray-600 mt-2">
                {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved for later
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/jobs'}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Find More Jobs
            </Button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 pt-4">
            {savedJobs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Saved Jobs Yet
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start saving jobs you're interested in to view them here. Click the heart icon on any job listing to save it.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/jobs'}
                    className="flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {savedJobs.map((job: any) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {job.job?.title || 'Job Title'}
                               </h3>
                               <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                 <div className="flex items-center">
                                   <Building2 className="h-4 w-4 mr-1" />
                                   {job.job?.company?.name || 'Company Name'}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {job.job?.location || 'Location'}
                                </div>
                                <div className="flex items-center">
                                  <Briefcase className="h-4 w-4 mr-1" />
                                  {job.job?.jobType?.jobType || 'Full-time'}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              {job.job?.salary && (
                                <div className="flex items-center text-green-600 mb-3">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  <span className="font-medium">{job.job.salary}</span>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnsaveJob(job.job?.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Heart className="h-5 w-5 fill-current" />
                            </Button>
                          </div>
                          
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {job.job?.description || 'No description available'}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.job?.category && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                {job.job.category.category}
                              </span>
                            )}
                            {job.job?.functionalArea && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                {job.job.functionalArea.functionalArea}
                              </span>
                            )}
                            {job.job?.isRemote && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                Remote
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Button 
                              onClick={() => handleApplyToJob(job.job?.id)}
                              className="flex-1 sm:flex-none"
                            >
                              Apply Now
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => window.location.href = `/jobs/${job.job?.id}`}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const SavedJobs = () => {
  return (
    <JobSearchProvider>
      <SavedJobsContent />
    </JobSearchProvider>
  );
};

export default SavedJobs;