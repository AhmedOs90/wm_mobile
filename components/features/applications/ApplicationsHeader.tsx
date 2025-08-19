import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ApplicationsHeaderProps {
  onRefresh: () => void;
  title?: string;
  description?: string;
}

const ApplicationsHeader = memo(({ 
  onRefresh, 
  title = "My Applications",
  description = "Track and manage all your job applications"
}: ApplicationsHeaderProps) => (
  <div className="mb-6 flex justify-between items-start">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
    <Button onClick={onRefresh} variant="outline" size="sm" className="gap-2">
      <RefreshCw className="h-4 w-4" />
      Refresh
    </Button>
  </div>
));

ApplicationsHeader.displayName = 'ApplicationsHeader';

export default ApplicationsHeader; 