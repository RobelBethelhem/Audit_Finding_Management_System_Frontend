import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Clock, User, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationData } from '@/services/notificationService';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown: React.FC = () => {
  const {
    notifications,
    notificationCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  // Helper function to safely format dates
  const formatNotificationDate = (dateString: string): string => {
    try {
      if (!dateString) return 'Unknown time';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Unknown time';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.warn('Error formatting notification date:', error);
      return 'Unknown time';
    }
  };

  const handleNotificationClick = async (notification: NotificationData) => {
    try {
      if (!notification.read && notification.notification_id && notification.type) {
        // Mark as read - this will automatically update the UI through context
        await markAsRead(notification.notification_id, notification.type);
      }
      // Keep dropdown open briefly to show the update, then close
      setTimeout(() => setIsOpen(false), 100);
    } catch (error) {
      console.error('Error handling notification click:', error);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all as read - this will automatically update the UI through context
      await markAllAsRead();
      // Keep dropdown open briefly to show the update, then close
      setTimeout(() => setIsOpen(false), 200);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDropdownOpen = async (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Always refresh notifications when dropdown is opened to ensure latest data
      await fetchNotifications();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assigned':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'escalation':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationTitle = (notification: NotificationData) => {
    if (notification.type === 'assigned') {
      return 'New Assignment';
    } else if (notification.type === 'escalation') {
      return `Escalation Level ${notification.escalation_level || 1}`;
    }
    return 'Notification';
  };

  const getNotificationDescription = (notification: NotificationData) => {
    try {
      // Use the message directly from the database
      return notification.message || 'No description available';
    } catch (error) {
      console.warn('Error formatting notification description:', error);
      return 'Notification details unavailable';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount.total > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {notificationCount.total > 99 ? '99+' : notificationCount.total}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notificationCount.total > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-1 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span>Loading notifications...</span>
            </div>
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          <ScrollArea className="h-96">
            {notifications.slice(0, 10).map((notification) => {
              // Safety check for notification data
              if (!notification || !notification.notification_id) {
                return null;
              }

              return (
              <DropdownMenuItem
                key={notification.notification_id}
                className={`p-3 cursor-pointer ${
                  !notification.read ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getNotificationTitle(notification)}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {getNotificationDescription(notification)}
                    </p>
                    
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatNotificationDate(notification.created_at)}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
              );
            }).filter(Boolean)}
            
            {notifications.length > 10 && (
              <DropdownMenuItem className="text-center text-sm text-blue-600 hover:text-blue-800">
                View all notifications
              </DropdownMenuItem>
            )}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
