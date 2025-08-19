import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
  variant?: 'default' | 'sidebar';
  collapsed?: boolean;
}

const LogoutButton = ({ variant = 'default', collapsed = false }: LogoutButtonProps) => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (variant === 'sidebar') {
    return (
      <button
        onClick={handleLogout}
        className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full",
          "text-red-600 hover:bg-red-50 hover:text-red-700",
          collapsed && "justify-center"
        )}
      >
        <LogOut className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span>Logout</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 text-red-600 hover:text-red-700"
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
