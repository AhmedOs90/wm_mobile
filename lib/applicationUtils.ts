export const APPLICATION_STATUSES = {
  PENDING: 'pending',
  SHORTLISTED: 'shortlisted',
  INTERVIEW: 'interview',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
} as const;

export type ApplicationStatus = typeof APPLICATION_STATUSES[keyof typeof APPLICATION_STATUSES];

interface StatusConfig {
  color: string;          // You can map this to a Tailwind class if you're using nativewind
  icon: string;           // Icon name (e.g., for lucide-react-native)
  nextStep: string;
}

// Status configuration
export const getApplicationStatusConfig = (status: string): StatusConfig => {
  const normalizedStatus = status.toLowerCase();

  const statusConfigs: Record<ApplicationStatus, StatusConfig> = {
    [APPLICATION_STATUSES.INTERVIEW]: {
      color: '#DBEAFE', // blue-100
      icon: 'Calendar',
      nextStep: 'Interview scheduled',
    },
    [APPLICATION_STATUSES.SHORTLISTED]: {
      color: '#FEF3C7', // yellow-100
      icon: 'Clock',
      nextStep: 'Prepare for potential interview',
    },
    [APPLICATION_STATUSES.PENDING]: {
      color: '#F3F4F6', // gray-100
      icon: 'AlertCircle',
      nextStep: 'Waiting for employer review',
    },
    [APPLICATION_STATUSES.REJECTED]: {
      color: '#FECACA', // red-100
      icon: 'XCircle',
      nextStep: 'Consider other opportunities',
    },
    [APPLICATION_STATUSES.ACCEPTED]: {
      color: '#D1FAE5', // green-100
      icon: 'CheckCircle',
      nextStep: 'Congratulations! Prepare for onboarding',
    },
    [APPLICATION_STATUSES.ARCHIVED]: {
      color: '#E9D5FF', // purple-100
      icon: 'Briefcase',
      nextStep: 'Application archived',
    },
  };

  return statusConfigs[normalizedStatus as ApplicationStatus] ?? {
    color: '#F3F4F6',
    icon: 'Briefcase',
    nextStep: 'Waiting for update',
  };
};

// Formatting utilities
export const formatSalaryRange = (salaryFrom?: number, salaryTo?: number): string => {
  if (salaryFrom && salaryTo) {
    return `${salaryFrom} - ${salaryTo}`;
  }
  return 'Salary not specified';
};

export const formatApplicationDate = (dateString: string | number): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString(); // You can localize this further if needed
  } catch {
    return 'Invalid date';
  }
};

// Filtering utilities
export const filterApplicationsByStatus = (
  applications: any[],
  status: ApplicationStatus
) => {
  return applications.filter(app => app.status?.toLowerCase() === status);
};

export const getApplicationCounts = (applications: any[]) => {
  return {
    all: applications.length,
    pending: filterApplicationsByStatus(applications, APPLICATION_STATUSES.PENDING).length,
    shortlisted: filterApplicationsByStatus(applications, APPLICATION_STATUSES.SHORTLISTED).length,
    interview: filterApplicationsByStatus(applications, APPLICATION_STATUSES.INTERVIEW).length,
    accepted: filterApplicationsByStatus(applications, APPLICATION_STATUSES.ACCEPTED).length,
    rejected: filterApplicationsByStatus(applications, APPLICATION_STATUSES.REJECTED).length,
    archived: filterApplicationsByStatus(applications, APPLICATION_STATUSES.ARCHIVED).length,
  };
};
