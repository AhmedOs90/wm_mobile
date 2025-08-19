import React, { memo, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobApplication } from '@types.gen.ts';
import { APPLICATION_STATUSES, filterApplicationsByStatus } from '../../../lib/applicationUtils';
import ApplicationsList from './ApplicationsList';

type ApplicationStatus = typeof APPLICATION_STATUSES[keyof typeof APPLICATION_STATUSES];
type FilteredApplications = Record<ApplicationStatus | 'all', JobApplication[]>;

interface ApplicationsTabsProps {
  applications: JobApplication[];
  hasMorePages: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  onTabChange: (value: string) => void;
  onViewApplication?: (application: JobApplication) => void;
  onViewMessages?: (application: JobApplication) => void;
  onPrepareInterview?: (application: JobApplication) => void;
  activeTab?: string;
}

const ApplicationsTabs = memo(({ 
  applications, 
  hasMorePages, 
  isFetchingMore, 
  onLoadMore, 
  onTabChange,
  onViewApplication,
  onViewMessages,
  onPrepareInterview,
  activeTab = 'all'
}: ApplicationsTabsProps) => {
  const filteredApplications = useMemo((): FilteredApplications => {
    const applicationsList = applications.length > 0 ? applications : [];
    
    return {
      all: applicationsList,
      pending: filterApplicationsByStatus(applicationsList, APPLICATION_STATUSES.PENDING),
      shortlisted: filterApplicationsByStatus(applicationsList, APPLICATION_STATUSES.SHORTLISTED),
      interview: filterApplicationsByStatus(applicationsList, APPLICATION_STATUSES.INTERVIEW),
      accepted: filterApplicationsByStatus(applicationsList, APPLICATION_STATUSES.ACCEPTED),
      rejected: filterApplicationsByStatus(applicationsList, APPLICATION_STATUSES.REJECTED),
      archived: filterApplicationsByStatus(applicationsList, APPLICATION_STATUSES.ARCHIVED)
    };
  }, [applications]);

  // Tab configuration array to eliminate duplication
  const tabConfig = [
    { key: 'all', label: 'All', emptyMessage: 'No applications found' },
    { key: 'pending', label: 'Pending', emptyMessage: 'No pending applications' },
    { key: 'shortlisted', label: 'Shortlisted', emptyMessage: 'No shortlisted applications' },
    { key: 'interview', label: 'Interviews', emptyMessage: 'No interview applications' },
    { key: 'accepted', label: 'Accepted', emptyMessage: 'No accepted applications' },
    { key: 'rejected', label: 'Rejected', emptyMessage: 'No rejected applications' }
  ] as const;

  return (
    <Tabs defaultValue="all" value={activeTab} className="space-y-6" onValueChange={(value) => onTabChange(value)}>
      <TabsList className="grid w-full grid-cols-6">
        {tabConfig.map(({ key, label }) => (
          <TabsTrigger key={key} value={key}>
            {label} ({filteredApplications[key].length})
          </TabsTrigger>
        ))}
      </TabsList>

      {tabConfig.map(({ key, emptyMessage }) => (
        <TabsContent key={key} value={key} className="space-y-4">
          <ApplicationsList 
            applications={filteredApplications[key]}
            hasMorePages={hasMorePages}
            isFetchingMore={isFetchingMore}
            onLoadMore={onLoadMore}
            emptyMessage={emptyMessage}
            onViewApplication={onViewApplication}
            onViewMessages={onViewMessages}
            onPrepareInterview={onPrepareInterview}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
});

ApplicationsTabs.displayName = 'ApplicationsTabs';

export default ApplicationsTabs; 