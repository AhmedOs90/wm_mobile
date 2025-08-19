import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { JobApplication } from "@types.gen.ts";
import { getApplicationStatusConfig, formatSalaryRange, formatApplicationDate, APPLICATION_STATUSES } from '../../../lib/applicationUtils';

interface ApplicationCardProps {
  application: JobApplication;
  onViewApplication?: (application: JobApplication) => void;
  onViewMessages?: (application: JobApplication) => void;
  onPrepareInterview?: (application: JobApplication) => void;
}

const ApplicationCard = memo(({ 
  application, 
  onViewApplication, 
  onViewMessages, 
  onPrepareInterview 
}: ApplicationCardProps) => {
  const statusConfig = getApplicationStatusConfig(application.status);
  const salaryRange = formatSalaryRange(application.job?.salaryFrom, application.job?.salaryTo);
  const applicationDate = formatApplicationDate(application.createdAt);
  
  // Get the appropriate icon component
  const getIconComponent = (iconName: string) => {
    const icons = {
      Calendar,
      Clock,
      CheckCircle,
      XCircle,
      AlertCircle,
      Briefcase
    };
    return icons[iconName as keyof typeof icons] || Briefcase;
  };
  
  const IconComponent = getIconComponent(statusConfig.icon);
  const jobTitle = application.job?.title || 'Unknown Position';
  const employerName = application.job?.employer?.firstName || 'Unknown Company';
  const isInterviewStatus = application.status.toLowerCase() === APPLICATION_STATUSES.INTERVIEW;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">🏢</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{jobTitle}</h3>
              <p className="text-lg text-gray-700 mb-2">{employerName}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span>Applied: {applicationDate}</span>
                <span>•</span>
                <span>{salaryRange}</span>
              </div>
              <Badge className={statusConfig.color}>
                <IconComponent className="h-4 w-4" />
                <span className="ml-1">
                  {application.status}
                </span>
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Next Step:</p>
          <p className="text-sm text-gray-600">{statusConfig.nextStep}</p>
        </div>

        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewApplication?.(application)}
          >
            <FileText className="mr-2 h-4 w-4" />
            View Application
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewMessages?.(application)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Button>
          {isInterviewStatus && (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onPrepareInterview?.(application)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Prepare for Interview
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard; 