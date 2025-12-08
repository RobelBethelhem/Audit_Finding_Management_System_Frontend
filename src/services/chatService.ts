// src/services/chatService.ts
import api from './api';
import { 
  Conversation, 
  Message, 
  CreateConversationDto, 
  SendMessageDto,
  ForwardMessageDto,
  AddReactionDto,
  MessageReaction
} from '@/types/chat';

class ChatService {
  // ============ CONVERSATION ENDPOINTS ============
  
  async getMyConversations(params?: {
    type?: 'direct' | 'group';
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const response = await api.get<Conversation[]>('/ZAMS/api/chat/conversations', { params });
    return response.data;
  }

  async createConversation(data: CreateConversationDto) {
    const response = await api.post<Conversation>('/ZAMS/api/chat/conversations', data);
    return response.data;
  }

  async getConversation(id: string) {
    const response = await api.get<Conversation>(`/ZAMS/api/chat/conversations/${id}`);
    return response.data;
  }

  async updateConversation(id: string, data: { name?: string; description?: string }) {
    const response = await api.put<Conversation>(`/ZAMS/api/chat/conversations/${id}`, data);
    return response.data;
  }

  async addParticipants(conversationId: string, participantIds: string[]) {
    const response = await api.post(
      `/ZAMS/api/chat/conversations/${conversationId}/participants`,
      { participant_ids: participantIds }
    );
    return response.data;
  }

  async removeParticipant(conversationId: string, participantId: string) {
    const response = await api.delete(
      `/ZAMS/api/chat/conversations/${conversationId}/participants/${participantId}`
    );
    return response.data;
  }

  // ============ MESSAGE ENDPOINTS ============
  
  async getMessages(conversationId: string, params?: {
    limit?: number;
    offset?: number;
    before_date?: string;
  }) {
    const response = await api.get<Message[]>(
      `/ZAMS/api/chat/conversations/${conversationId}/messages`,
      { params }
    );
    return response.data;
  }

  async sendMessage(conversationId: string, data: SendMessageDto) {
    const formData = new FormData();
    
    if (data.content) {
      formData.append('content', data.content);
    }
    
    if (data.parent_message_id) {
      formData.append('parent_message_id', data.parent_message_id);
    }
    
    if (data.files && data.files.length > 0) {
      data.files.forEach(file => {
        formData.append('files', file);
      });
    }

    const response = await api.post<Message>(
      `/ZAMS/api/chat/conversations/${conversationId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async editMessage(messageId: string, content: string) {
    const response = await api.put<Message>(
      `/ZAMS/api/chat/messages/${messageId}`,
      { content }
    );
    return response.data;
  }

  async deleteMessage(messageId: string) {
    const response = await api.delete(`/ZAMS/api/chat/messages/${messageId}`);
    return response.data;
  }

  async markAsRead(conversationId: string, messageIds: string[]) {
    const response = await api.post(
      `/ZAMS/api/chat/conversations/${conversationId}/mark-read`,
      { message_ids: messageIds }
    );
    return response.data;
  }

  // ============ REACTION ENDPOINTS ============
  
  async addReaction(messageId: string, reaction: string) {
    const response = await api.post<MessageReaction>(
      `/ZAMS/api/chat/messages/${messageId}/reactions`,
      { reaction }
    );
    return response.data;
  }

  async removeReaction(messageId: string, reaction: string) {
    const response = await api.delete(
      `/ZAMS/api/chat/messages/${messageId}/reactions`,
      { data: { reaction } }
    );
    return response.data;
  }

  async getMessageReactions(messageId: string) {
    const response = await api.get<{
      reactions: MessageReaction[];
      grouped: Record<string, any[]>;
      total: number;
    }>(`/ZAMS/api/chat/messages/${messageId}/reactions`);
    return response.data;
  }

  // ============ FORWARDING ============
  
  async forwardMessage(messageId: string, data: ForwardMessageDto) {
    const response = await api.post(
      `/ZAMS/api/chat/messages/${messageId}/forward`,
      data
    );
    return response.data;
  }

  // ============ ATTACHMENTS ============
  
  async downloadAttachment(attachmentId: string) {
    const response = await api.get(
      `/ZAMS/api/chat/attachments/${attachmentId}/download`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  // ============ UTILITIES ============
  
  async getUnreadCount() {
    const response = await api.get<{ unread_count: number }>('/ZAMS/api/chat/unread-count');
    return response.data;
  }

  async searchMessages(params: {
    query: string;
    conversation_id?: string;
    limit?: number;
  }) {
    const response = await api.get<Message[]>('/ZAMS/api/chat/search', { params });
    return response.data;
  }

  // ============ HELPER METHODS ============
  
  getAttachmentUrl(attachmentId: string): string {
    const token = localStorage.getItem('auth_token');
    return `${api.defaults.baseURL}/ZAMS/api/chat/attachments/${attachmentId}/download?token=${token}`;
  }

  formatMessageTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Default to date format
    return date.toLocaleDateString();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export const chatService = new ChatService();

