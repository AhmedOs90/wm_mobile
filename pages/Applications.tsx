import { useCallback, memo, useState } from 'react';
import Layout from '@/components/shared/layout/Layout';
import { LoadingSpinner, ErrorState } from '@/components/shared/ui';
import { ApplicationsHeader, ApplicationsTabs } from '@/components/features/applications';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { JobApplication } from '@types.gen.ts';

// Main component
const Applications = () => {
  const { userId } = useAuth();
  const {
    applications,
    isInitialLoading,
    hasError,
    fetchError,
    isFetchingMore,
    hasMorePages,
    loadNextPage,
    // resetPagination,
    refreshData,
    retryFetch
  } = useApplications({ userId });

  const [activeTab, setActiveTab] = useState('all');

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    
  }, []);

  const handleViewApplication = useCallback((application: JobApplication) => {
    // TODO: Implement view application logic
    console.log('View application:', application.id);
  }, []);

  const handleViewMessages = useCallback((application: JobApplication) => {
    // TODO: Implement view messages logic
    console.log('View messages for application:', application.id);
  }, []);

  const handlePrepareInterview = useCallback((application: JobApplication) => {
    // TODO: Implement prepare interview logic
    console.log('Prepare for interview:', application.id);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {isInitialLoading && (
          <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner />
          </div>
        )}
        
        {hasError && (
          <div className="flex justify-center items-center min-h-screen">
            <ErrorState 
              error={fetchError as Error} 
              onRetry={retryFetch}
              title="Failed to load applications"
            />
          </div>
        )}
        
        {!isInitialLoading && !hasError && (
          <>
            {/* Fixed header section */}
            <div className="flex-shrink-0 p-6 pb-0">
              <ApplicationsHeader onRefresh={refreshData} />
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-auto">
              <div className="p-6 pt-4">
                <ApplicationsTabs 
                  applications={applications}
                  hasMorePages={hasMorePages}
                  isFetchingMore={isFetchingMore}
                  onLoadMore={loadNextPage}
                  onTabChange={handleTabChange}
                  onViewApplication={handleViewApplication}
                  onViewMessages={handleViewMessages}
                  onPrepareInterview={handlePrepareInterview}
                  activeTab={activeTab}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default memo(Applications);
