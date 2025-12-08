
// import { useState, useEffect } from 'react';
// import { LoginForm } from '@/components/auth/LoginForm';
// import { Dashboard } from '@/components/dashboard/Dashboard';
// import { useAuth } from '@/hooks/useAuth';
// import { useToast } from '@/components/ui/use-toast';
// import { toast as sonnerToast } from '@/components/ui/sonner';

// const Index = () => {
//   const { user, login, logout, isLoading } = useAuth();
//   const { toast } = useToast();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   const handleLogin = async (username: string, password: string) => {
//     try {
//       const result = await login(username, password);
      
//       if (result.success) {
//         // Show success toast
//         sonnerToast.success('Login successful', {
//           description: 'Welcome back!',
//           duration: 3000,
//         });
//         return result;
//       } else {
//         // Show error toast
//         sonnerToast.error('Login failed', {
//           description: result.error || 'Invalid username or password',
//           duration: 5000,
//         });
//         return result;
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       // Show error toast for unexpected errors
//       sonnerToast.error('Login error', {
//         description: 'An unexpected error occurred. Please try again.',
//         duration: 5000,
//       });
//       return { success: false, error: 'An unexpected error occurred' };
//     }
//   };

//   if (!user) {
//     return <LoginForm onLogin={handleLogin} />;
//   }

//   return <Dashboard onLogout={logout} />;
// };

// export default Index;


// pages/Index.tsx
import { useState, useEffect } from 'react';
import LoginForm  from '@/components/auth/LoginForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from '@/components/ui/sonner';

const Index = () => {
  const { user, login, logout, isLoading, checkSession } = useAuth();
  const { toast } = useToast();
  const [sessionConflict, setSessionConflict] = useState<any>(null);

  // Check session validity periodically
  useEffect(() => {
    if (user) {
      // Check session every 30 seconds
      const interval = setInterval(async () => {
        const isValid = await checkSession();
        if (!isValid) {
          sonnerToast.error('Session expired', {
            description: 'Your session has expired or you have logged in from another device.',
            duration: 5000,
          });
        }
      }, 5000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, checkSession]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (username: string, password: string, force: boolean = false) => {
    try {
      const result = await login(username, password, force);
      
      if (result.success) {
        // Show success toast
        if (force) {
          sonnerToast.success('Login successful', {
            description: 'Previous session has been terminated.',
            duration: 3000,
          });
        } else {
          sonnerToast.success('Login successful', {
            description: 'Welcome back!',
            duration: 3000,
          });
        }
        
        // Clear any session conflict
        setSessionConflict(null);
        return result;
      } else if (result.code === 'ACTIVE_SESSION_EXISTS') {
        // Handle session conflict
        setSessionConflict(result.sessionInfo);
        
        // Don't show toast for session conflict, let the LoginForm handle the UI
        return {
          success: false,
          error: result.error,
          code: result.code,
          sessionInfo: result.sessionInfo,
          requiresForce: true
        };
      } else if (result.code === 'ACCOUNT_DEACTIVATED') {
        // Show error toast for deactivated account
        sonnerToast.error('Account Deactivated', {
          description: result.error || 'Your account has been deactivated. Please contact administrator.',
          duration: 5000,
        });
        return result;
      } else {
        // Show error toast for other errors
        sonnerToast.error('Login failed', {
          description: result.error || 'Invalid username or password',
          duration: 5000,
        });
        return result;
      }
    } catch (error) {
      console.error('Login error:', error);
      // Show error toast for unexpected errors
      sonnerToast.error('Login error', {
        description: 'An unexpected error occurred. Please try again.',
        duration: 5000,
      });
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={logout} />;
};

export default Index;
