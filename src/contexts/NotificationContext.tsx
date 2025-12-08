//src/contexts/NotificationContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notificationService, NotificationData, NotificationCount } from '@/services/notificationService';
import { useAuth } from '@/hooks/useAuth';

interface NotificationContextType {
  notifications: NotificationData[];
  notificationCount: NotificationCount;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  fetchNotificationCount: () => Promise<void>;
  markAsRead: (notificationId: string, type: 'assigned' | 'escalation') => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  forceRefresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [notificationCount, setNotificationCount] = useState<NotificationCount>({
    total: 0,
    assigned: 0,
    escalation: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) {
      console.log('NotificationContext: No user, skipping notification fetch');
      return;
    }

    try {
      console.log('NotificationContext: Fetching notifications for user:', user.username);
      setLoading(true);
      setError(null);
      const response = await notificationService.getNotifications({
        limit: 20,
        unread_only: true // Only fetch unread notifications for dropdown
      });
      // Ensure we have valid data before setting it
      if (response && response.data && Array.isArray(response.data)) {
        console.log('NotificationContext: Successfully fetched', response.data.length, 'notifications');
        setNotifications(response.data);
      } else {
        console.warn('NotificationContext: Invalid notification response format:', response);
        setNotifications([]);
      }
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('NotificationContext: Error fetching notifications:', err);
      setNotifications([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationCount = async () => {
    if (!user) {
      console.log('NotificationContext: No user, skipping notification count fetch');
      return;
    }

    try {
      console.log('NotificationContext: Fetching notification count for user:', user.username);
      const response = await notificationService.getNotificationCount();
      console.log('NotificationContext: Successfully fetched notification count:', response.data);
      setNotificationCount(response.data);
    } catch (err) {
      console.error('NotificationContext: Error fetching notification count:', err);
    }
  };

  const markAsRead = async (notificationId: string, type: 'assigned' | 'escalation') => {
    try {
      await notificationService.markAsRead(notificationId, type);

      // Immediately remove the notification from the list since we only show unread notifications
      setNotifications(prev =>
        prev.filter(notification => notification.notification_id !== notificationId)
      );

      // Immediately update the count by decrementing the appropriate counter
      setNotificationCount(prev => {
        const newCount = { ...prev };
        if (type === 'assigned') {
          newCount.assigned = Math.max(0, newCount.assigned - 1);
        } else if (type === 'escalation') {
          newCount.escalation = Math.max(0, newCount.escalation - 1);
        }
        newCount.total = newCount.assigned + newCount.escalation;
        return newCount;
      });

    } catch (err) {
      console.error('Error marking notification as read:', err);
      // On error, refresh to get the correct state
      await refreshNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();

      // Immediately clear all notifications since we only show unread ones
      setNotifications([]);

      // Immediately reset count to zero
      setNotificationCount({
        total: 0,
        assigned: 0,
        escalation: 0
      });
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      // On error, refresh to get the correct state
      await refreshNotifications();
    }
  };

  const refreshNotifications = async () => {
    await Promise.all([
      fetchNotifications(),
      fetchNotificationCount()
    ]);
  };

  const forceRefresh = async () => {
    if (!user) return;

    // Force refresh regardless of current state
    setError(null);
    await refreshNotifications();
  };

  // Auto-refresh notification count every 30 seconds and initial load
  useEffect(() => {
    if (!user) {
      // Reset state when user logs out
      setNotifications([]);
      setNotificationCount({ total: 0, assigned: 0, escalation: 0 });
      return;
    }

    // Immediate fetch when user becomes available with a small delay to ensure auth is ready
    const initialFetch = async () => {
      // Small delay to ensure authentication headers are properly set
      setTimeout(async () => {
        try {
          await refreshNotifications();
        } catch (error) {
          console.warn('Initial notification fetch failed, retrying in 2 seconds:', error);
          // Retry once after 2 seconds if initial fetch fails
          setTimeout(() => {
            refreshNotifications().catch(err =>
              console.error('Retry notification fetch also failed:', err)
            );
          }, 2000);
        }
      }, 100);
    };

    initialFetch();

    // Set up interval for periodic refresh
    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const value: NotificationContextType = {
    notifications,
    notificationCount,
    loading,
    error,
    fetchNotifications,
    fetchNotificationCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    forceRefresh
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
