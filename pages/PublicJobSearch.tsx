import ClientLayout from "@/components/shared/layout/ClientLayout";
import {
  JobSearchHeader,
  JobSearchFilters,
  JobSearchResults,
  JobSearchError,
} from "@/components/features/jobs";
import { JobSearchProvider, useJobSearch } from "@/contexts/JobSearchContext";

const JobSearchContent = () => {
  const { isError } = useJobSearch();

  if (isError) {
    return <JobSearchError />;
  }

  return (
    <ClientLayout>
      <div className="flex flex-col h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </ClientLayout>
  );
};

const PublicJobSearch = () => {
  return (
    <JobSearchProvider isPublic>
      <JobSearchContent />
    </JobSearchProvider>
  );
};
export default PublicJobSearch;
