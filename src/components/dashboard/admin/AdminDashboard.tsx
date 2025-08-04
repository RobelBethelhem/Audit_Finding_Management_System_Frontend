import { useAuth } from '@/hooks/useAuth';
import { UserManagement } from './UserManagement';

export const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users and system settings</p>
      </div>

      <UserManagement user={user} />
    </div>
  );
};


