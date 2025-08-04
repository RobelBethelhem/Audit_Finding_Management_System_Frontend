
import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from '@/components/ui/sonner';

const Index = () => {
  const { user, login, logout, isLoading } = useAuth();
  const { toast } = useToast();

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

  const handleLogin = async (username: string, password: string) => {
    try {
      const result = await login(username, password);
      
      if (result.success) {
        // Show success toast
        sonnerToast.success('Login successful', {
          description: 'Welcome back!',
          duration: 3000,
        });
        return result;
      } else {
        // Show error toast
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
