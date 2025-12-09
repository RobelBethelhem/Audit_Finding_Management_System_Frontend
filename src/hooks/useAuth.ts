
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { User } from '@/types/user';

// // Re-export User type for convenience
// export type { User };

// // Create axios instance with base URL
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'https://aps2.zemenbank.com',
// });

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored auth token on mount
//     const token = localStorage.getItem('auth_token');
//     const userData = localStorage.getItem('user_data');
    
//     if (token && userData) {
//       try {
//         setUser(JSON.parse(userData));
//         // Set default auth header for all future requests
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       } catch (error) {
//         console.error('Error parsing stored user data:', error);
//         localStorage.removeItem('auth_token');
//         localStorage.removeItem('user_data');
//       }
//     }
    
//     setIsLoading(false);
//   }, []);

//   const login = async (username: string, password: string) => {
//     setIsLoading(true);
//     console.log('Attempting login with:', { username });
    
//     try {
//       console.log('Making API request to:', '/auth/login');
//       const response = await api.post('/ZAMS/api/auth/login', { username, password });
//       console.log('Login response:', response.data);
      
//       // Make sure we're extracting data correctly based on backend response
//       const { token, user: userData } = response.data;
      
//       if (!token || !userData) {
//         console.error('Invalid response format:', response.data);
//         return { 
//           success: false, 
//           error: 'Invalid server response' 
//         };
//       }
      
//       // Store auth data
//       localStorage.setItem('auth_token', token);
//       localStorage.setItem('user_data', JSON.stringify(userData));
      
//       // Set default auth header for all future requests
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
//       setUser(userData);
//       return { success: true };
//     } catch (error: any) {
//       console.error('Login error details:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status
//       });
      
//       // Improved error handling
//       if (error.response) {
//         // The server responded with a status code outside the 2xx range
//         console.log('Error response:', error.response.data);
//         return { 
//           success: false, 
//           error: error.response.data?.error || 'Invalid username or password' 
//         };
//       } else if (error.request) {
//         // The request was made but no response was received
//         console.log('Error request:', error.request);
//         return { 
//           success: false, 
//           error: 'No response from server. Please check your connection.' 
//         };
//       } else {
//         // Something happened in setting up the request
//         return { 
//           success: false, 
//           error: error.message || 'An unexpected error occurred' 
//         };
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       const token = localStorage.getItem('auth_token');
//       if (token) {
//         await api.post('/ZAMS/api/auth/logout');
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user_data');
//       delete api.defaults.headers.common['Authorization'];
//       setUser(null);
//     }
//   };

//   return { user, login, logout, isLoading, api };
// };



// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '@/types/user';

// Re-export User type for convenience
export type { User };

// Session info type
export interface SessionInfo {
  lastActivity: string;
  ipAddress: string;
  deviceInfo: string;
  loginTime: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  code?: string;
  sessionInfo?: SessionInfo;
  requiresForce?: boolean;
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://aps2.zemenbank.com',
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

  const login = async (username: string, password: string, force: boolean = false): Promise<LoginResult> => {
    setIsLoading(true);
    console.log('Attempting login with:', { username, force });
    
    try {
      console.log('Making API request to:', '/ZAMS/api/auth/login');
      const response = await api.post('/ZAMS/api/auth/login', { 
        username, 
        password,
        force // Include force parameter
      });
      
      console.log('Login response:', response.data);
      
      // Make sure we're extracting data correctly based on backend response
      const { token, user: userData, message } = response.data;
      
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
      localStorage.setItem('login_time', new Date().toISOString());
      
      // Set default auth header for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return { 
        success: true,
        // Include message if it indicates forced login
        ...(message?.includes('Previous session') && { 
          error: message 
        })
      };
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Handle session conflict (409 status)
      if (error.response?.status === 409) {
        const { sessionInfo, message } = error.response.data;
        return {
          success: false,
          error: message || 'Active session exists',
          code: 'ACTIVE_SESSION_EXISTS',
          sessionInfo: sessionInfo,
          requiresForce: true
        };
      }
      
      // Handle account deactivated (403 status)
      if (error.response?.status === 403) {
        return {
          success: false,
          error: error.response.data?.error || 'Account is deactivated',
          code: 'ACCOUNT_DEACTIVATED'
        };
      }
      
      // Handle invalid credentials (401 status)
      if (error.response?.status === 401) {
        return {
          success: false,
          error: error.response.data?.error || 'Invalid username or password',
          code: 'INVALID_CREDENTIALS'
        };
      }
      
      // Handle other server errors
      if (error.response) {
        return { 
          success: false, 
          error: error.response.data?.error || 'Login failed' 
        };
      } else if (error.request) {
        // No response from server
        return { 
          success: false, 
          error: 'No response from server. Please check your connection.',
          code: 'NETWORK_ERROR'
        };
      } else {
        // Other errors
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
        // Include token in header for logout
        await api.post('/ZAMS/api/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('login_time');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      // Redirect to /ZAMS after logout
      window.location.href = '/ZAMS';
    }
  };

  // Check if current session is valid
  const checkSession = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      const response = await api.get('/ZAMS/api/auth/session', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.hasSession;
    } catch (error) {
      console.error('Session check error:', error);
      // If session check fails, clear auth data
      await logout();
      return false;
    }
  };

  return { 
    user, 
    login, 
    logout, 
    isLoading, 
    api,
    checkSession 
  };
};
