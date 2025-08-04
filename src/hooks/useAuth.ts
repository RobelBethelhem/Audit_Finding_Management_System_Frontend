
import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '@/types/user';

// Re-export User type for convenience
export type { User };

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on mount
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        // Set default auth header for all future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    console.log('Attempting login with:', { username });
    
    try {
      console.log('Making API request to:', '/auth/login');
      const response = await api.post('/auth/login', { username, password });
      console.log('Login response:', response.data);
      
      // Make sure we're extracting data correctly based on backend response
      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        console.error('Invalid response format:', response.data);
        return { 
          success: false, 
          error: 'Invalid server response' 
        };
      }
      
      // Store auth data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Set default auth header for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return { success: true };
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Improved error handling
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.log('Error response:', error.response.data);
        return { 
          success: false, 
          error: error.response.data?.error || 'Invalid username or password' 
        };
      } else if (error.request) {
        // The request was made but no response was received
        console.log('Error request:', error.request);
        return { 
          success: false, 
          error: 'No response from server. Please check your connection.' 
        };
      } else {
        // Something happened in setting up the request
        return { 
          success: false, 
          error: error.message || 'An unexpected error occurred' 
        };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return { user, login, logout, isLoading, api };
};
