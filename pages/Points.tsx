import { useLocation } from 'react-router-dom';
import Layout from '@/components/shared/layout/Layout';
import AdminPointsManager from '@/components/features/points/AdminPointsManager';
import EmployerPoints from '@/components/features/employer/EmployerPoints';

const Points = () => {
  const location = useLocation();
  const isEmployerContext = location.pathname.startsWith('/employers');

  if (isEmployerContext) {
    return (
      <Layout>
        <div className="p-6 bg-gray-50 min-h-screen">
          <EmployerPoints />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscriber Points & Referral Management</h1>
          <p className="text-gray-600">Manage subscriber points, referral codes, and track conversion analytics</p>
        </div>

        <AdminPointsManager />
      </div>
    </Layout>
  );
};

export default Points;
