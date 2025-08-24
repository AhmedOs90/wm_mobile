import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/shared/layout/Layout';
import { JobDetailsView } from '@/components/features/jobs';

const JobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();

  if (!jobId) {
    return <Navigate to="/jobs" replace />;
  }

  return (
    <Layout>
      <JobDetailsView jobId={jobId} />
    </Layout>
  );
};

export default JobDetails;