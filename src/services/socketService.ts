// // // src/services/socketService.ts - FIXED with proper TypeScript declarations
// // import { io, Socket } from 'socket.io-client';
// // import { Message, Conversation, MessageReaction, TypingIndicator } from '@/types/chat';

// // type SocketEventCallback = (data: any) => void;

// // class SocketService {
// //   private socket: Socket | null = null;
// //   private io: typeof io = io; // Add this property declaration
// //   private isConnected: boolean = false;
// //   private listeners: Map<string, Set<SocketEventCallback>> = new Map();
// //   private reconnectAttempts: number = 0;
// //   private maxReconnectAttempts: number = 5;
// //   private userSockets: Map<string, string[]> = new Map(); // Add this property declaration

// //   connect(authToken: string) {
// //     if (this.socket && this.isConnected) {
// //       console.log('Socket already connected');
// //       return;
// //     }

// //     const serverUrl = import.meta.env.VITE_API_URL || 'https://aps2.zemenbank.com';

// //     this.socket = this.io(serverUrl, {
// //       auth: {
// //         token: authToken
// //       },
// //       transports: ['websocket', 'polling'],
// //       reconnection: true,
// //       reconnectionAttempts: this.maxReconnectAttempts,
// //       reconnectionDelay: 1000,
// //       reconnectionDelayMax: 5000
// //     });

// //     this.setupEventListeners();
// //     this.setupConnectionHandlers();
// //   }

// //   private setupConnectionHandlers() {
// //     if (!this.socket) return;

// //     this.socket.on('connect', () => {
// //       console.log('Connected to chat server');
// //       this.isConnected = true;
// //       this.reconnectAttempts = 0;
// //       this.emit('connection_status', { connected: true });
// //     });

// //     this.socket.on('disconnect', (reason) => {
// //       console.log('Disconnected from chat server:', reason);
// //       this.isConnected = false;
// //       this.emit('connection_status', { connected: false, reason });
// //     });

// //     this.socket.on('connect_error', (error) => {
// //       console.error('Connection error:', error.message);
// //       this.reconnectAttempts++;
      
// //       if (this.reconnectAttempts >= this.maxReconnectAttempts) {
// //         this.emit('connection_failed', { 
// //           message: 'Failed to connect to chat server after multiple attempts' 
// //         });
// //       }
// //     });

// //     this.socket.on('error', (data) => {
// //       console.error('Socket error:', data);
// //       this.emit('socket_error', data);
// //     });
// //   }

// //   private setupEventListeners() {
// //     if (!this.socket) return;

// //     // Message events
// //     this.socket.on('new_message', (data) => {
// //       this.emit('new_message', data);
// //     });

// //     this.socket.on('message_edited', (data) => {
// //       this.emit('message_edited', data);
// //     });

// //     this.socket.on('message_deleted', (data) => {
// //       this.emit('message_deleted', data);
// //     });

// //     // Reaction events
// //     this.socket.on('reaction_added', (data) => {
// //       this.emit('reaction_added', data);
// //     });

// //     this.socket.on('reaction_removed', (data) => {
// //       this.emit('reaction_removed', data);
// //     });

// //     // Typing indicators
// //     this.socket.on('user_typing', (data: TypingIndicator) => {
// //       this.emit('user_typing', data);
// //     });

// //     this.socket.on('user_stopped_typing', (data) => {
// //       this.emit('user_stopped_typing', data);
// //     });

// //     // Read receipts
// //     this.socket.on('message_read_update', (data) => {
// //       this.emit('message_read_update', data);
// //     });

// //     // Conversation events
// //     this.socket.on('added_to_conversation', (data) => {
// //       this.emit('added_to_conversation', data);
// //     });

// //     this.socket.on('removed_from_conversation', (data) => {
// //       this.emit('removed_from_conversation', data);
// //     });

// //     this.socket.on('conversation_updated', (data) => {
// //       this.emit('conversation_updated', data);
// //     });

// //     // User status events
// //     this.socket.on('user_status_change', (data) => {
// //       this.emit('user_status_change', data);
// //     });

// //     this.socket.on('online_status_update', (data) => {
// //       this.emit('online_status_update', data);
// //     });

// //     // Conversation join/leave confirmations
// //     this.socket.on('joined_conversation', (data) => {
// //       this.emit('joined_conversation', data);
// //     });

// //     this.socket.on('left_conversation', (data) => {
// //       this.emit('left_conversation', data);
// //     });

// //     // Refresh signals
// //     this.socket.on('conversations_refresh_needed', () => {
// //       this.emit('conversations_refresh_needed', {});
// //     });
// //   }

// //   // Socket actions
// //   joinConversation(conversationId: string) {
// //     if (!this.isConnected || !this.socket) {
// //       console.error('Socket not connected');
// //       return;
// //     }
// //     this.socket.emit('join_conversation', conversationId);
// //   }

// //   leaveConversation(conversationId: string) {
// //     if (!this.isConnected || !this.socket) return;
// //     this.socket.emit('leave_conversation', conversationId);
// //   }

// //   startTyping(conversationId: string) {
// //     if (!this.isConnected || !this.socket) return;
// //     this.socket.emit('typing_start', { conversationId });
// //   }

// //   stopTyping(conversationId: string) {
// //     if (!this.isConnected || !this.socket) return;
// //     this.socket.emit('typing_stop', { conversationId });
// //   }

// //   markMessageRead(conversationId: string, messageId: string) {
// //     if (!this.isConnected || !this.socket) return;
// //     this.socket.emit('message_read', { conversationId, messageId });
// //   }

// //   getOnlineStatus(userIds: string[]) {
// //     if (!this.isConnected || !this.socket) return;
// //     this.socket.emit('get_online_status', userIds);
// //   }

// //   requestConversationsRefresh() {
// //     if (!this.isConnected || !this.socket) return;
// //     this.socket.emit('refresh_conversations');
// //   }

// //   // Event subscription management
// //   on(event: string, callback: SocketEventCallback) {
// //     if (!this.listeners.has(event)) {
// //       this.listeners.set(event, new Set());
// //     }
// //     this.listeners.get(event)?.add(callback);
// //   }

// //   off(event: string, callback: SocketEventCallback) {
// //     this.listeners.get(event)?.delete(callback);
// //   }

// //   private emit(event: string, data: any) {
// //     this.listeners.get(event)?.forEach(callback => {
// //       try {
// //         callback(data);
// //       } catch (error) {
// //         console.error(`Error in socket event callback for ${event}:`, error);
// //       }
// //     });
// //   }

// //   // Helper methods for userSockets (client-side tracking)
// //   private addUserSocket(userId: string, socketId: string) {
// //     if (!this.userSockets.has(userId)) {
// //       this.userSockets.set(userId, []);
// //     }
// //     const sockets = this.userSockets.get(userId);
// //     if (sockets && !sockets.includes(socketId)) {
// //       sockets.push(socketId);
// //     }
// //   }

// //   private removeUserSocket(userId: string, socketId: string) {
// //     if (this.userSockets.has(userId)) {
// //       const sockets = this.userSockets.get(userId)?.filter(id => id !== socketId);
// //       if (sockets && sockets.length > 0) {
// //         this.userSockets.set(userId, sockets);
// //       } else {
// //         this.userSockets.delete(userId);
// //       }
// //     }
// //   }

// //   // Cleanup
// //   disconnect() {
// //     if (this.socket) {
// //       this.socket.disconnect();
// //       this.socket = null;
// //       this.isConnected = false;
// //       this.listeners.clear();
// //       this.userSockets.clear();
// //     }
// //   }

// //   getConnectionStatus(): boolean {
// //     return this.isConnected;
// //   }

// //   reconnect(authToken: string) {
// //     this.disconnect();
// //     setTimeout(() => {
// //       this.connect(authToken);
// //     }, 1000);
// //   }
// // }

// // // Export as default
// // const socketService = new SocketService();
// // export default socketService;






































// // src/services/socketService.ts - Optional Socket Support
// import { io, Socket } from 'socket.io-client';
// import { Message, Conversation, MessageReaction, TypingIndicator } from '@/types/chat';

// type SocketEventCallback = (data: any) => void;

// class SocketService {
//   private socket: Socket | null = null;
//   private io: typeof io = io;
//   private isConnected: boolean = false;
//   private listeners: Map<string, Set<SocketEventCallback>> = new Map();
//   private reconnectAttempts: number = 0;
//   private maxReconnectAttempts: number = 5;
//   private userSockets: Map<string, string[]> = new Map();
//   private socketEnabled: boolean = false;

//   async checkSocketAvailability(): Promise<boolean> {
//     try {
//       const response = await fetch('/ZAMS/api/socket-status');
//       const data = await response.json();
//       return data.status === 'active';
//     } catch (error) {
//       console.log('Socket.IO not available, continuing without real-time features');
//       return false;
//     }
//   }

//   async connect(authToken: string) {
//     // Check if sockets are available first
//     this.socketEnabled = await this.checkSocketAvailability();
    
//     if (!this.socketEnabled) {
//       console.log('Socket.IO is disabled on server, skipping connection');
//       return;
//     }

//     if (this.socket && this.isConnected) {
//       console.log('Socket already connected');
//       return;
//     }

//     const serverUrl = import.meta.env.VITE_API_URL || 'https://aps2.zemenbank.com';
    
//     console.log('Attempting to connect to socket server:', serverUrl);

//     try {
//       this.socket = this.io(serverUrl, {
//         auth: {
//           token: authToken
//         },
//         transports: ['polling', 'websocket'],
//         upgrade: true,
//         reconnection: true,
//         reconnectionAttempts: this.maxReconnectAttempts,
//         reconnectionDelay: 2000,
//         reconnectionDelayMax: 10000,
//         timeout: 20000,
//         path: '/socket.io/',
//         withCredentials: true
//       });

//       this.setupEventListeners();
//       this.setupConnectionHandlers();
//     } catch (error) {
//       console.error('Failed to initialize socket connection:', error);
//       this.socketEnabled = false;
//     }
//   }

//   private setupConnectionHandlers() {
//     if (!this.socket) return;

//     this.socket.on('connect', () => {
//       console.log('✅ Connected to chat server');
//       this.isConnected = true;
//       this.reconnectAttempts = 0;
//       this.emit('connection_status', { connected: true });
//     });

//     this.socket.on('disconnect', (reason) => {
//       console.log('❌ Disconnected from chat server:', reason);
//       this.isConnected = false;
//       this.emit('connection_status', { connected: false, reason });
//     });

//     this.socket.on('connect_error', (error) => {
//       console.error('Connection error:', error.message);
//       this.reconnectAttempts++;
      
//       if (this.reconnectAttempts >= this.maxReconnectAttempts) {
//         console.error('Max reconnection attempts reached');
//         this.socketEnabled = false;
//         this.emit('connection_failed', { 
//           message: 'Failed to connect to chat server' 
//         });
//       }
//     });

//     this.socket.on('error', (data) => {
//       console.error('Socket error:', data);
//       this.emit('socket_error', data);
//     });
//   }

//   private setupEventListeners() {
//     if (!this.socket) return;

//     // Message events
//     this.socket.on('new_message', (data) => {
//       this.emit('new_message', data);
//     });

//     this.socket.on('message_edited', (data) => {
//       this.emit('message_edited', data);
//     });

//     this.socket.on('message_deleted', (data) => {
//       this.emit('message_deleted', data);
//     });

//     // Reaction events
//     this.socket.on('reaction_added', (data) => {
//       this.emit('reaction_added', data);
//     });

//     this.socket.on('reaction_removed', (data) => {
//       this.emit('reaction_removed', data);
//     });

//     // Typing indicators
//     this.socket.on('user_typing', (data: TypingIndicator) => {
//       this.emit('user_typing', data);
//     });

//     this.socket.on('user_stopped_typing', (data) => {
//       this.emit('user_stopped_typing', data);
//     });

//     // Read receipts
//     this.socket.on('message_read_update', (data) => {
//       this.emit('message_read_update', data);
//     });

//     // Conversation events
//     this.socket.on('added_to_conversation', (data) => {
//       this.emit('added_to_conversation', data);
//     });

//     this.socket.on('removed_from_conversation', (data) => {
//       this.emit('removed_from_conversation', data);
//     });

//     this.socket.on('conversation_updated', (data) => {
//       this.emit('conversation_updated', data);
//     });

//     // User status events
//     this.socket.on('user_status_change', (data) => {
//       this.emit('user_status_change', data);
//     });

//     this.socket.on('online_status_update', (data) => {
//       this.emit('online_status_update', data);
//     });

//     // Conversation join/leave confirmations
//     this.socket.on('joined_conversation', (data) => {
//       this.emit('joined_conversation', data);
//     });

//     this.socket.on('left_conversation', (data) => {
//       this.emit('left_conversation', data);
//     });

//     // Refresh signals
//     this.socket.on('conversations_refresh_needed', () => {
//       this.emit('conversations_refresh_needed', {});
//     });
//   }

//   // Socket actions - all safe to call even if socket is disabled
//   joinConversation(conversationId: string) {
//     if (!this.socketEnabled || !this.socket) {
//       console.debug('Socket not available, skipping joinConversation');
//       return;
//     }
    
//     if (!this.socket.connected) {
//       this.socket.once('connect', () => {
//         this.socket?.emit('join_conversation', conversationId);
//       });
//     } else {
//       this.socket.emit('join_conversation', conversationId);
//     }
//   }

//   leaveConversation(conversationId: string) {
//     if (!this.socketEnabled || !this.socket || !this.socket.connected) return;
//     this.socket.emit('leave_conversation', conversationId);
//   }

//   startTyping(conversationId: string) {
//     if (!this.socketEnabled || !this.socket || !this.socket.connected) return;
//     this.socket.emit('typing_start', { conversationId });
//   }

//   stopTyping(conversationId: string) {
//     if (!this.socketEnabled || !this.socket || !this.socket.connected) return;
//     this.socket.emit('typing_stop', { conversationId });
//   }

//   markMessageRead(conversationId: string, messageId: string) {
//     if (!this.socketEnabled || !this.socket || !this.socket.connected) return;
//     this.socket.emit('message_read', { conversationId, messageId });
//   }

//   getOnlineStatus(userIds: string[]) {
//     if (!this.socketEnabled || !this.socket || !this.socket.connected) return;
//     this.socket.emit('get_online_status', userIds);
//   }

//   requestConversationsRefresh() {
//     if (!this.socketEnabled || !this.socket || !this.socket.connected) return;
//     this.socket.emit('refresh_conversations');
//   }

//   // Event subscription management
//   on(event: string, callback: SocketEventCallback) {
//     if (!this.listeners.has(event)) {
//       this.listeners.set(event, new Set());
//     }
//     this.listeners.get(event)?.add(callback);
//   }

//   off(event: string, callback: SocketEventCallback) {
//     this.listeners.get(event)?.delete(callback);
//   }

//   private emit(event: string, data: any) {
//     this.listeners.get(event)?.forEach(callback => {
//       try {
//         callback(data);
//       } catch (error) {
//         console.error(`Error in socket event callback for ${event}:`, error);
//       }
//     });
//   }

//   // Helper methods
//   private addUserSocket(userId: string, socketId: string) {
//     if (!this.userSockets.has(userId)) {
//       this.userSockets.set(userId, []);
//     }
//     const sockets = this.userSockets.get(userId);
//     if (sockets && !sockets.includes(socketId)) {
//       sockets.push(socketId);
//     }
//   }

//   private removeUserSocket(userId: string, socketId: string) {
//     if (this.userSockets.has(userId)) {
//       const sockets = this.userSockets.get(userId)?.filter(id => id !== socketId);
//       if (sockets && sockets.length > 0) {
//         this.userSockets.set(userId, sockets);
//       } else {
//         this.userSockets.delete(userId);
//       }
//     }
//   }

//   // Cleanup
//   disconnect() {
//     if (this.socket) {
//       console.log('Disconnecting socket...');
//       this.socket.disconnect();
//       this.socket = null;
//       this.isConnected = false;
//       this.listeners.clear();
//       this.userSockets.clear();
//     }
//   }

//   getConnectionStatus(): boolean {
//     return this.isConnected;
//   }

//   isSocketEnabled(): boolean {
//     return this.socketEnabled;
//   }

//   reconnect(authToken: string) {
//     this.disconnect();
//     setTimeout(() => {
//       this.connect(authToken);
//     }, 1000);
//   }
// }

// // Export as default
// const socketService = new SocketService();
// export default socketService;





// type SocketEventCallback = (data: any) => void;

// class SocketService {
//   private listeners: Map<string, Set<SocketEventCallback>> = new Map();
//   private isConnected: boolean = false;

//   // Stub connection - doesn't actually connect
//   async connect(authToken: string) {
//     console.log('Socket service disabled - using HTTP polling instead');
//     this.isConnected = false;
//     return Promise.resolve();
//   }

//   // Stub methods that do nothing
//   joinConversation(conversationId: string) {
//     // No-op
//   }

//   leaveConversation(conversationId: string) {
//     // No-op
//   }

//   startTyping(conversationId: string) {
//     // No-op - typing indicators won't work without sockets
//   }

//   stopTyping(conversationId: string) {
//     // No-op
//   }

//   markMessageRead(conversationId: string, messageId: string) {
//     // No-op
//   }

//   getOnlineStatus(userIds: string[]) {
//     // No-op - online status won't work without sockets
//   }

//   requestConversationsRefresh() {
//     // Trigger a manual refresh through the listeners
//     this.emit('conversations_refresh_needed', {});
//   }

//   // Event subscription management (kept for compatibility)
//   on(event: string, callback: SocketEventCallback) {
//     if (!this.listeners.has(event)) {
//       this.listeners.set(event, new Set());
//     }
//     this.listeners.get(event)?.add(callback);
//   }

//   off(event: string, callback: SocketEventCallback) {
//     this.listeners.get(event)?.delete(callback);
//   }

//   private emit(event: string, data: any) {
//     this.listeners.get(event)?.forEach(callback => {
//       try {
//         callback(data);
//       } catch (error) {
//         console.error(`Error in event callback for ${event}:`, error);
//       }
//     });
//   }

//   // Cleanup
//   disconnect() {
//     this.isConnected = false;
//     this.listeners.clear();
//   }

//   getConnectionStatus(): boolean {
//     return false; // Always return false since we're not using sockets
//   }

//   isSocketEnabled(): boolean {
//     return false; // Sockets are disabled
//   }

//   reconnect(authToken: string) {
//     // No-op
//   }

//   // Method to trigger events manually (for polling updates)
//   triggerEvent(event: string, data: any) {
//     this.emit(event, data);
//   }
// }

// // Export as default
// const socketService = new SocketService();
// export default socketService;



















// src/services/socketService.ts - Stub Version (No Socket.IO)

type SocketEventCallback = (data: any) => void;

class SocketService {
  private listeners: Map<string, Set<SocketEventCallback>> = new Map();
  private isConnected: boolean = false;

  // Stub connection - doesn't actually connect
  async connect(authToken: string) {
    console.log('Socket service disabled - using HTTP polling instead');
    this.isConnected = false;
    return Promise.resolve();
  }

  // Stub methods that do nothing
  joinConversation(conversationId: string) {
    // No-op
  }

  leaveConversation(conversationId: string) {
    // No-op
  }

  startTyping(conversationId: string) {
    // No-op - typing indicators won't work without sockets
  }

  stopTyping(conversationId: string) {
    // No-op
  }

  markMessageRead(conversationId: string, messageId: string) {
    // No-op
  }

  getOnlineStatus(userIds: string[]) {
    // No-op - online status won't work without sockets
  }

  requestConversationsRefresh() {
    // Trigger a manual refresh through the listeners
    this.emit('conversations_refresh_needed', {});
  }

  // Event subscription management (kept for compatibility)
  on(event: string, callback: SocketEventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: SocketEventCallback) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event callback for ${event}:`, error);
      }
    });
  }

  // Cleanup
  disconnect() {
    this.isConnected = false;
    this.listeners.clear();
  }

  getConnectionStatus(): boolean {
    return false; // Always return false since we're not using sockets
  }

  isSocketEnabled(): boolean {
    return false; // Sockets are disabled
  }

  reconnect(authToken: string) {
    // No-op
  }

  // Method to trigger events manually (for polling updates)
  triggerEvent(event: string, data: any) {
    this.emit(event, data);
  }
}

// Export as default
const socketService = new SocketService();
export default socketService;