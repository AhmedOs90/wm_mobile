import React, { memo } from 'react';
import { JobApplication } from '@types.gen.ts';
import ApplicationCard from './ApplicationCard';
import EmptyState from '@/components/shared/ui/EmptyState';
import { Button } from '@/components/ui/button';

interface ApplicationsListProps {
  applications: JobApplication[];
  hasMorePages: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  emptyMessage: string;
  onViewApplication?: (application: JobApplication) => void;
  onViewMessages?: (application: JobApplication) => void;
  onPrepareInterview?: (application: JobApplication) => void;
}

const LoadMoreButton = memo(({ 
  onLoadMore, 
  isLoading, 
  hasMore 
}: { 
  onLoadMore: () => void, 
  isLoading: boolean, 
  hasMore: boolean 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center space-x-2 py-4">
        <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    );
  }

  if (!hasMore) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">No more applications to load</p>
    );
  }

  return (
    <div className="text-center py-4">
      <Button onClick={onLoadMore} variant="outline">
        Load More Applications
      </Button>
    </div>
  );
});

LoadMoreButton.displayName = 'LoadMoreButton';

const ApplicationsList = memo(({ 
  applications, 
  hasMorePages, 
  isFetchingMore, 
  onLoadMore, 
  emptyMessage,
  onViewApplication,
  onViewMessages,
  onPrepareInterview
}: ApplicationsListProps) => {
  if (applications.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard 
          key={application.id} 
          application={application}
          onViewApplication={onViewApplication}
          onViewMessages={onViewMessages}
          onPrepareInterview={onPrepareInterview}
        />
      ))}
      
      <LoadMoreButton 
        onLoadMore={onLoadMore}
        isLoading={isFetchingMore}
        hasMore={hasMorePages}
      />
    </div>
  );
});

ApplicationsList.displayName = 'ApplicationsList';

export default ApplicationsList; 