
import { LogOut, Menu, Search } from 'lucide-react';
import { User } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
  onMenuToggle: () => void;
}

export const DashboardHeader = ({ user, onLogout, onMenuToggle }: DashboardHeaderProps) => {
  // Add null check for user
  if (!user) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search findings..."
                className="pl-10 w-80 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-600">{user.role ? user.role.replace(/_/g, ' ') : 'Unknown Role'}</p>
            </div>
          </div>

          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
