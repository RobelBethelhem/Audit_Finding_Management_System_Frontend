import api from './api';

export interface NotificationData {
  notification_id: string;
  type: 'assigned' | 'escalation';
  message: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  AuditFinding?: {
    id: string;
    title: string;
    description: string;
  };
  escalation_level?: number;
  audit_finding_id: string;
  user_id?: string;
  escalated_to_id?: string;
  escalated_by_id?: string;
}

export interface NotificationCount {
  total: number;
  assigned: number;
  escalation: number;
}

export interface NotificationResponse {
  success: boolean;
  data: NotificationData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface NotificationCountResponse {
  success: boolean;
  data: NotificationCount;
}

class NotificationService {
  // Get all notifications for current user
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unread_only?: boolean;
  }): Promise<NotificationResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unread_only) queryParams.append('unread_only', params.unread_only.toString());

    const response = await api.get(`ZAMS/api/notifications?${queryParams.toString()}`);
    return response.data;
  }

  // Get notification count for current user
  async getNotificationCount(): Promise<NotificationCountResponse> {
    const response = await api.get('/ZAMS/api/notifications/count');
    return response.data;
  }

  // Mark specific notification as read
  async markAsRead(notificationId: string, type: 'assigned' | 'escalation'): Promise<void> {
    await api.put(`/ZAMS/api/notifications/${notificationId}/read`, { type });
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await api.put('ZAMS/api/notifications/mark-all-read');
  }

  // Get unread notifications only
  async getUnreadNotifications(limit: number = 10): Promise<NotificationResponse> {
    return this.getNotifications({
      limit,
      unread_only: true
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
