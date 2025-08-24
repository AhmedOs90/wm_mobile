import Layout from '@/components/shared/layout/Layout';
import { JobSearchHeader, JobSearchFilters, JobSearchResults, JobSearchError } from '@/components/features/jobs';
import { JobSearchProvider, useJobSearch } from '@/contexts/JobSearchContext';

const JobSearchContent = () => {
  const { isError } = useJobSearch();

  if (isError) {
    return <JobSearchError />;
  }

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Fixed header section */}
        <div className="flex-shrink-0 p-6 pb-0">
          <JobSearchHeader />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 pt-4 space-y-6">
            <JobSearchFilters />
            <JobSearchResults />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const JobSearch = () => {
  return (
    <JobSearchProvider>
      <JobSearchContent />
    </JobSearchProvider>
  );
};

export default JobSearch;