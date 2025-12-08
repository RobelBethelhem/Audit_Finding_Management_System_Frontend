// // src/contexts/ChatContext.tsx - FIXED VERSION
// import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { chatService } from '@/services/chatService';
// import socketService from '@/services/socketService';
// import { 
//   Conversation, 
//   Message, 
//   CreateConversationDto, 
//   SendMessageDto,
//   TypingIndicator,
//   OnlineStatus 
// } from '@/types/chat';
// import { toast } from 'sonner';

// interface ChatContextType {
//   // State
//   conversations: Conversation[];
//   activeConversation: Conversation | null;
//   messages: Message[];
//   typingUsers: Map<string, TypingIndicator>;
//   onlineUsers: OnlineStatus;
//   unreadCount: number;
//   loading: boolean;
//   messagesLoading: boolean;
//   error: string | null;
  
//   // Actions
//   loadConversations: () => Promise<void>;
//   createConversation: (data: CreateConversationDto) => Promise<Conversation>;
//   selectConversation: (conversationId: string) => Promise<void>;
//   sendMessage: (content: string, files?: File[], parentMessageId?: string) => Promise<void>;
//   editMessage: (messageId: string, content: string) => Promise<void>;
//   deleteMessage: (messageId: string) => Promise<void>;
//   addReaction: (messageId: string, reaction: string) => Promise<void>;
//   removeReaction: (messageId: string, reaction: string) => Promise<void>;
//   forwardMessage: (messageId: string, conversationIds: string[], additionalContent?: string) => Promise<void>;
//   markMessagesAsRead: (messageIds: string[]) => Promise<void>;
//   loadMoreMessages: () => Promise<void>;
//   searchMessages: (query: string) => Promise<Message[]>;
  
//   // Group management
//   addParticipants: (participantIds: string[]) => Promise<void>;
//   removeParticipant: (participantId: string) => Promise<void>;
//   updateConversation: (name?: string, description?: string) => Promise<void>;
  
//   // Typing indicators
//   startTyping: () => void;
//   stopTyping: () => void;
  
//   // Utilities
//   refreshConversations: () => Promise<void>;
//   clearActiveConversation: () => void;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// interface ChatProviderProps {
//   children: ReactNode;
// }

// export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
//   const { user } = useAuth();
  
//   // State
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [typingUsers, setTypingUsers] = useState<Map<string, TypingIndicator>>(new Map());
//   const [onlineUsers, setOnlineUsers] = useState<OnlineStatus>({});
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [messagesLoading, setMessagesLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [messageOffset, setMessageOffset] = useState(0);
//   const [hasMoreMessages, setHasMoreMessages] = useState(true);
  
//   // Use refs for values that shouldn't trigger re-renders
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const activeConversationRef = useRef<Conversation | null>(null);
  
//   // Update refs when state changes
//   useEffect(() => {
//     activeConversationRef.current = activeConversation;
//   }, [activeConversation]);

//   // Load conversations
//   const loadConversations = useCallback(async () => {
//     if (!user) return;
    
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await chatService.getMyConversations();
//       setConversations(data);
      
//       // Calculate total unread
//       const total = data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
//       setUnreadCount(total);
//     } catch (err: any) {
//       setError(err.message || 'Failed to load conversations');
//       toast.error('Failed to load conversations');
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   // Create conversation
//   const createConversation = useCallback(async (data: CreateConversationDto): Promise<Conversation> => {
//     try {
//       const conversation = await chatService.createConversation(data);
//       setConversations(prev => [conversation, ...prev]);
//       toast.success(data.type === 'group' ? 'Group created successfully' : 'Conversation started');
//       return conversation;
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to create conversation');
//       throw err;
//     }
//   }, []);

//   // Select conversation
//   const selectConversation = useCallback(async (conversationId: string) => {
//     try {
//       setMessagesLoading(true);
//       setMessageOffset(0);
//       setHasMoreMessages(true);
      
//       // Get conversation details
//       const conversation = await chatService.getConversation(conversationId);
//       setActiveConversation(conversation);
      
//       // Join socket room
//       socketService.joinConversation(conversationId);
      
//       // Load messages
//       const messages = await chatService.getMessages(conversationId, { limit: 50 });
//       setMessages(messages);
      
//       // Mark messages as read
//       const unreadMessageIds = messages
//         .filter(m => m.sender_id !== user?.id && !m.MessageReadStatuses?.find(rs => rs.user_id === user?.id && rs.is_read))
//         .map(m => m.id);
      
//       if (unreadMessageIds.length > 0) {
//         await chatService.markAsRead(conversationId, unreadMessageIds);
        
//         // Update unread count
//         setConversations(prev => prev.map(conv => 
//           conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
//         ));
//         setUnreadCount(prev => Math.max(0, prev - unreadMessageIds.length));
//       }
//     } catch (err: any) {
//       toast.error('Failed to load conversation');
//       setError(err.message);
//     } finally {
//       setMessagesLoading(false);
//     }
//   }, [user]);

//   // Send message
//   const sendMessage = useCallback(async (content: string, files?: File[], parentMessageId?: string) => {
//     if (!activeConversation) return;
    
//     try {
//       const message = await chatService.sendMessage(activeConversation.id, {
//         content,
//         files,
//         parent_message_id: parentMessageId
//       });
      
//       // Message will be added via socket event
//       // Update last message in conversation list
//       setConversations(prev => prev.map(conv => 
//         conv.id === activeConversation.id 
//           ? { ...conv, last_message_at: message.created_at }
//           : conv
//       ));
//     } catch (err: any) {
//       toast.error('Failed to send message');
//       throw err;
//     }
//   }, [activeConversation]);

//   // Edit message
//   const editMessage = useCallback(async (messageId: string, content: string) => {
//     try {
//       await chatService.editMessage(messageId, content);
//       // Update will come through socket
//     } catch (err: any) {
//       toast.error('Failed to edit message');
//     }
//   }, []);

//   // Delete message
//   const deleteMessage = useCallback(async (messageId: string) => {
//     try {
//       await chatService.deleteMessage(messageId);
//       // Update will come through socket
//     } catch (err: any) {
//       toast.error('Failed to delete message');
//     }
//   }, []);

//   // Add reaction
//   const addReaction = useCallback(async (messageId: string, reaction: string) => {
//     try {
//       await chatService.addReaction(messageId, reaction);
//       // Update will come through socket
//     } catch (err: any) {
//       if (err.response?.status !== 200) { // Not already exists
//         toast.error('Failed to add reaction');
//       }
//     }
//   }, []);

//   // Remove reaction
//   const removeReaction = useCallback(async (messageId: string, reaction: string) => {
//     try {
//       await chatService.removeReaction(messageId, reaction);
//       // Update will come through socket
//     } catch (err: any) {
//       toast.error('Failed to remove reaction');
//     }
//   }, []);

//   // Forward message
//   const forwardMessage = useCallback(async (
//     messageId: string, 
//     conversationIds: string[], 
//     additionalContent?: string
//   ) => {
//     try {
//       await chatService.forwardMessage(messageId, {
//         conversation_ids: conversationIds,
//         additional_content: additionalContent
//       });
//       toast.success(`Message forwarded to ${conversationIds.length} conversation(s)`);
//     } catch (err: any) {
//       toast.error('Failed to forward message');
//     }
//   }, []);

//   // Mark messages as read
//   const markMessagesAsRead = useCallback(async (messageIds: string[]) => {
//     if (!activeConversation) return;
    
//     try {
//       await chatService.markAsRead(activeConversation.id, messageIds);
//     } catch (err: any) {
//       console.error('Failed to mark messages as read:', err);
//     }
//   }, [activeConversation]);

//   // Load more messages
//   const loadMoreMessages = useCallback(async () => {
//     if (!activeConversation || !hasMoreMessages || messagesLoading) return;
    
//     try {
//       setMessagesLoading(true);
//       const newOffset = messageOffset + 50;
//       const olderMessages = await chatService.getMessages(activeConversation.id, {
//         limit: 50,
//         offset: newOffset
//       });
      
//       if (olderMessages.length === 0) {
//         setHasMoreMessages(false);
//       } else {
//         setMessages(prev => [...olderMessages, ...prev]);
//         setMessageOffset(newOffset);
//       }
//     } catch (err: any) {
//       toast.error('Failed to load more messages');
//     } finally {
//       setMessagesLoading(false);
//     }
//   }, [activeConversation, messageOffset, hasMoreMessages, messagesLoading]);

//   // Search messages
//   const searchMessages = useCallback(async (query: string): Promise<Message[]> => {
//     try {
//       return await chatService.searchMessages({
//         query,
//         conversation_id: activeConversation?.id,
//         limit: 20
//       });
//     } catch (err: any) {
//       toast.error('Search failed');
//       return [];
//     }
//   }, [activeConversation]);

//   // Group management
//   const addParticipants = useCallback(async (participantIds: string[]) => {
//     if (!activeConversation || activeConversation.type !== 'group') return;
    
//     try {
//       await chatService.addParticipants(activeConversation.id, participantIds);
//       toast.success('Participants added successfully');
//       // Reload conversation
//       await selectConversation(activeConversation.id);
//     } catch (err: any) {
//       toast.error('Failed to add participants');
//     }
//   }, [activeConversation, selectConversation]);

//   const removeParticipant = useCallback(async (participantId: string) => {
//     if (!activeConversation) return;
    
//     try {
//       await chatService.removeParticipant(activeConversation.id, participantId);
//       toast.success('Participant removed');
//       // Reload conversation
//       await selectConversation(activeConversation.id);
//     } catch (err: any) {
//       toast.error('Failed to remove participant');
//     }
//   }, [activeConversation, selectConversation]);

//   const updateConversation = useCallback(async (name?: string, description?: string) => {
//     if (!activeConversation || activeConversation.type !== 'group') return;
    
//     try {
//       const updated = await chatService.updateConversation(activeConversation.id, { name, description });
//       setActiveConversation(updated);
//       setConversations(prev => prev.map(conv => 
//         conv.id === updated.id ? updated : conv
//       ));
//       toast.success('Group updated successfully');
//     } catch (err: any) {
//       toast.error('Failed to update group');
//     }
//   }, [activeConversation]);

//   // FIXED: Typing indicators without circular dependency
//   const startTyping = useCallback(() => {
//     const currentConversation = activeConversationRef.current;
//     if (!currentConversation) return;
    
//     socketService.startTyping(currentConversation.id);
    
//     // Clear existing timeout
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }
    
//     // Set new timeout to stop typing after 2 seconds
//     typingTimeoutRef.current = setTimeout(() => {
//       stopTyping();
//     }, 2000);
//   }, []); // No dependencies needed since we use refs!

//   const stopTyping = useCallback(() => {
//     const currentConversation = activeConversationRef.current;
//     if (!currentConversation) return;
    
//     socketService.stopTyping(currentConversation.id);
    
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//       typingTimeoutRef.current = null;
//     }
//   }, []); // No dependencies needed since we use refs!

//   // Refresh conversations
//   const refreshConversations = useCallback(async () => {
//     await loadConversations();
//   }, [loadConversations]);

//   // Clear active conversation
//   const clearActiveConversation = useCallback(() => {
//     if (activeConversation) {
//       socketService.leaveConversation(activeConversation.id);
//     }
//     setActiveConversation(null);
//     setMessages([]);
//     setMessageOffset(0);
//     setHasMoreMessages(true);
//   }, [activeConversation]);

//   // EFFECT 1: Socket Connection (only depends on user)
//   useEffect(() => {
//     if (!user) return;

//     const token = localStorage.getItem('auth_token');
//     if (!token) return;

//     // Connect to socket
//     socketService.connect(token);

//     // Load initial data
//     loadConversations();

//     // Cleanup
//     return () => {
//       socketService.disconnect();
//     };
//   }, [user]); // Only user dependency - removed loadConversations!

//   // EFFECT 2: Socket event handlers - use refs to avoid stale closures
//   useEffect(() => {
//     if (!user) return;

//     // Socket event handlers
//     const handleNewMessage = (data: any) => {
//       const currentActiveConv = activeConversationRef.current;
      
//       if (data.conversationId === currentActiveConv?.id) {
//         setMessages(prev => [...prev, data.message]);
//       }
      
//       // Update conversation list
//       setConversations(prev => prev.map(conv => {
//         if (conv.id === data.conversationId) {
//           return {
//             ...conv,
//             Messages: [data.message],
//             last_message_at: data.message.created_at,
//             unread_count: conv.id === currentActiveConv?.id ? 0 : (conv.unread_count || 0) + 1
//           };
//         }
//         return conv;
//       }));
      
//       // Update unread count if not active conversation
//       if (data.conversationId !== currentActiveConv?.id) {
//         setUnreadCount(prev => prev + 1);
//       }
//     };

//     const handleMessageEdited = (data: any) => {
//       setMessages(prev => prev.map(msg => 
//         msg.id === data.message.id ? data.message : msg
//       ));
//     };

//     const handleMessageDeleted = (data: any) => {
//       setMessages(prev => prev.map(msg => 
//         msg.id === data.messageId ? { ...msg, is_deleted: true, content: '[Message deleted]' } : msg
//       ));
//     };

//     const handleReactionAdded = (data: any) => {
//       setMessages(prev => prev.map(msg => {
//         if (msg.id === data.messageId) {
//           return {
//             ...msg,
//             MessageReactions: [...(msg.MessageReactions || []), data.reaction]
//           };
//         }
//         return msg;
//       }));
//     };

//     const handleReactionRemoved = (data: any) => {
//       setMessages(prev => prev.map(msg => {
//         if (msg.id === data.messageId) {
//           return {
//             ...msg,
//             MessageReactions: msg.MessageReactions?.filter(r => 
//               !(r.user_id === data.userId && r.reaction === data.reaction)
//             ) || []
//           };
//         }
//         return msg;
//       }));
//     };

//     const handleUserTyping = (data: TypingIndicator) => {
//       setTypingUsers(prev => {
//         const newMap = new Map(prev);
//         newMap.set(data.userId, data);
//         return newMap;
//       });
      
//       // Remove after 3 seconds
//       setTimeout(() => {
//         setTypingUsers(prev => {
//           const newMap = new Map(prev);
//           newMap.delete(data.userId);
//           return newMap;
//         });
//       }, 3000);
//     };

//     const handleUserStoppedTyping = (data: any) => {
//       setTypingUsers(prev => {
//         const newMap = new Map(prev);
//         newMap.delete(data.userId);
//         return newMap;
//       });
//     };

//     const handleUserStatusChange = (data: any) => {
//       setOnlineUsers(prev => ({
//         ...prev,
//         [data.userId]: data.status === 'online'
//       }));
//     };

//     const handleAddedToConversation = () => {
//       loadConversations();
//       toast.info('You were added to a new conversation');
//     };

//     const handleRemovedFromConversation = (data: any) => {
//       const currentActiveConv = activeConversationRef.current;
//       if (currentActiveConv?.id === data.conversationId) {
//         clearActiveConversation();
//       }
//       loadConversations();
//       toast.info('You were removed from a conversation');
//     };

//     // Register socket event listeners
//     socketService.on('new_message', handleNewMessage);
//     socketService.on('message_edited', handleMessageEdited);
//     socketService.on('message_deleted', handleMessageDeleted);
//     socketService.on('reaction_added', handleReactionAdded);
//     socketService.on('reaction_removed', handleReactionRemoved);
//     socketService.on('user_typing', handleUserTyping);
//     socketService.on('user_stopped_typing', handleUserStoppedTyping);
//     socketService.on('user_status_change', handleUserStatusChange);
//     socketService.on('added_to_conversation', handleAddedToConversation);
//     socketService.on('removed_from_conversation', handleRemovedFromConversation);

//     // Cleanup
//     return () => {
//       socketService.off('new_message', handleNewMessage);
//       socketService.off('message_edited', handleMessageEdited);
//       socketService.off('message_deleted', handleMessageDeleted);
//       socketService.off('reaction_added', handleReactionAdded);
//       socketService.off('reaction_removed', handleReactionRemoved);
//       socketService.off('user_typing', handleUserTyping);
//       socketService.off('user_stopped_typing', handleUserStoppedTyping);
//       socketService.off('user_status_change', handleUserStatusChange);
//       socketService.off('added_to_conversation', handleAddedToConversation);
//       socketService.off('removed_from_conversation', handleRemovedFromConversation);
//     };
//   }, [user, loadConversations, clearActiveConversation]); // Removed activeConversation?.id!

//   // EFFECT 3: Separate effect for joining/leaving rooms
//   useEffect(() => {
//     if (activeConversation) {
//       socketService.joinConversation(activeConversation.id);
      
//       return () => {
//         socketService.leaveConversation(activeConversation.id);
//       };
//     }
//   }, [activeConversation?.id]); // This is OK in a separate effect

//   // Cleanup typing timeout on unmount
//   useEffect(() => {
//     return () => {
//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//       }
//     };
//   }, []);

//   const value: ChatContextType = {
//     // State
//     conversations,
//     activeConversation,
//     messages,
//     typingUsers,
//     onlineUsers,
//     unreadCount,
//     loading,
//     messagesLoading,
//     error,
    
//     // Actions
//     loadConversations,
//     createConversation,
//     selectConversation,
//     sendMessage,
//     editMessage,
//     deleteMessage,
//     addReaction,
//     removeReaction,
//     forwardMessage,
//     markMessagesAsRead,
//     loadMoreMessages,
//     searchMessages,
    
//     // Group management
//     addParticipants,
//     removeParticipant,
//     updateConversation,
    
//     // Typing indicators
//     startTyping,
//     stopTyping,
    
//     // Utilities
//     refreshConversations,
//     clearActiveConversation
//   };

//   return (
//     <ChatContext.Provider value={value}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = (): ChatContextType => {
//   const context = useContext(ChatContext);
//   if (context === undefined) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// };


// // src/contexts/ChatContext.tsx - HTTP Polling Version

// import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { chatService } from '@/services/chatService';
// import socketService from '@/services/socketService';
// import { 
//   Conversation, 
//   Message, 
//   CreateConversationDto, 
//   SendMessageDto,
//   TypingIndicator,
//   OnlineStatus 
// } from '@/types/chat';
// import { toast } from 'sonner';

// interface ChatContextType {
//   // State
//   conversations: Conversation[];
//   activeConversation: Conversation | null;
//   messages: Message[];
//   typingUsers: Map<string, TypingIndicator>;
//   onlineUsers: OnlineStatus;
//   unreadCount: number;
//   loading: boolean;
//   messagesLoading: boolean;
//   error: string | null;
  
//   // Actions
//   loadConversations: () => Promise<void>;
//   createConversation: (data: CreateConversationDto) => Promise<Conversation>;
//   selectConversation: (conversationId: string) => Promise<void>;
//   sendMessage: (content: string, files?: File[], parentMessageId?: string) => Promise<void>;
//   editMessage: (messageId: string, content: string) => Promise<void>;
//   deleteMessage: (messageId: string) => Promise<void>;
//   addReaction: (messageId: string, reaction: string) => Promise<void>;
//   removeReaction: (messageId: string, reaction: string) => Promise<void>;
//   forwardMessage: (messageId: string, conversationIds: string[], additionalContent?: string) => Promise<void>;
//   markMessagesAsRead: (messageIds: string[]) => Promise<void>;
//   loadMoreMessages: () => Promise<void>;
//   searchMessages: (query: string) => Promise<Message[]>;
  
//   // Group management
//   addParticipants: (participantIds: string[]) => Promise<void>;
//   removeParticipant: (participantId: string) => Promise<void>;
//   updateConversation: (name?: string, description?: string) => Promise<void>;
  
//   // Typing indicators (stubbed for HTTP)
//   startTyping: () => void;
//   stopTyping: () => void;
  
//   // Utilities
//   refreshConversations: () => Promise<void>;
//   clearActiveConversation: () => void;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// interface ChatProviderProps {
//   children: ReactNode;
// }

// // Polling intervals (in milliseconds)
// const CONVERSATIONS_POLL_INTERVAL = 10000; // 10 seconds
// const MESSAGES_POLL_INTERVAL = 3000; // 3 seconds
// const UNREAD_COUNT_POLL_INTERVAL = 5000; // 5 seconds

// export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
//   const { user } = useAuth();
  
//   // State
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [typingUsers, setTypingUsers] = useState<Map<string, TypingIndicator>>(new Map());
//   const [onlineUsers, setOnlineUsers] = useState<OnlineStatus>({});
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [messagesLoading, setMessagesLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [messageOffset, setMessageOffset] = useState(0);
//   const [hasMoreMessages, setHasMoreMessages] = useState(true);
  
//   // Refs for polling intervals
//   const conversationsPollRef = useRef<NodeJS.Timeout | null>(null);
//   const messagesPollRef = useRef<NodeJS.Timeout | null>(null);
//   const unreadPollRef = useRef<NodeJS.Timeout | null>(null);
//   const activeConversationRef = useRef<Conversation | null>(null);
//   const lastMessageIdRef = useRef<string | null>(null);
  
//   // Update refs when state changes
//   useEffect(() => {
//     activeConversationRef.current = activeConversation;
//   }, [activeConversation]);

//   // Load conversations
//   const loadConversations = useCallback(async () => {
//     if (!user) return;
    
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await chatService.getMyConversations();
//       setConversations(data);
      
//       // Calculate total unread
//       const total = data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
//       setUnreadCount(total);
//     } catch (err: any) {
//       setError(err.message || 'Failed to load conversations');
//       console.error('Failed to load conversations:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   // Load unread count
//   const loadUnreadCount = useCallback(async () => {
//     if (!user) return;
    
//     try {
//       const data = await chatService.getUnreadCount();
//       setUnreadCount(data.unread_count);
//     } catch (err: any) {
//       console.error('Failed to load unread count:', err);
//     }
//   }, [user]);

//   // Poll for new messages in active conversation
//   const pollMessages = useCallback(async () => {
//     if (!activeConversation || messagesLoading) return;
    
//     try {
//       const latestMessages = await chatService.getMessages(activeConversation.id, { 
//         limit: 50 
//       });
      
//       // Check if there are new messages
//       const currentMessageIds = new Set(messages.map(m => m.id));
//       const newMessages = latestMessages.filter(m => !currentMessageIds.has(m.id));
      
//       if (newMessages.length > 0) {
//         setMessages(latestMessages);
        
//         // Mark new messages as read if they're not from the current user
//         const unreadMessageIds = newMessages
//           .filter(m => m.sender_id !== user?.id)
//           .map(m => m.id);
        
//         if (unreadMessageIds.length > 0) {
//           await chatService.markAsRead(activeConversation.id, unreadMessageIds);
          
//           // Update unread count in conversation list
//           setConversations(prev => prev.map(conv =>
//             conv.id === activeConversation.id ? { ...conv, unread_count: 0 } : conv
//           ));
//         }
//       }
      
//       // Check for edited or deleted messages
//       const messageMap = new Map(messages.map(m => [m.id, m]));
//       const updatedMessages = latestMessages.filter(m => {
//         const oldMsg = messageMap.get(m.id);
//         return oldMsg && (
//           oldMsg.content !== m.content || 
//           oldMsg.is_deleted !== m.is_deleted ||
//           oldMsg.is_edited !== m.is_edited
//         );
//       });
      
//       if (updatedMessages.length > 0 || newMessages.length > 0) {
//         setMessages(latestMessages);
//       }
//     } catch (err: any) {
//       console.error('Failed to poll messages:', err);
//     }
//   }, [activeConversation, messages, user, messagesLoading]);

//   // Create conversation
//   const createConversation = useCallback(async (data: CreateConversationDto): Promise<Conversation> => {
//     try {
//       const conversation = await chatService.createConversation(data);
//       setConversations(prev => [conversation, ...prev]);
//       toast.success(data.type === 'group' ? 'Group created successfully' : 'Conversation started');
//       return conversation;
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to create conversation');
//       throw err;
//     }
//   }, []);

//   // Select conversation
//   const selectConversation = useCallback(async (conversationId: string) => {
//     try {
//       setMessagesLoading(true);
//       setMessageOffset(0);
//       setHasMoreMessages(true);
      
//       // Get conversation details
//       const conversation = await chatService.getConversation(conversationId);
//       setActiveConversation(conversation);
      
//       // Load messages
//       const messages = await chatService.getMessages(conversationId, { limit: 50 });
//       setMessages(messages);
      
//       // Store last message ID for polling comparison
//       if (messages.length > 0) {
//         lastMessageIdRef.current = messages[messages.length - 1].id;
//       }
      
//       // Mark messages as read
//       const unreadMessageIds = messages
//         .filter(m => m.sender_id !== user?.id && !m.MessageReadStatuses?.find(rs => rs.user_id === user?.id && rs.is_read))
//         .map(m => m.id);
      
//       if (unreadMessageIds.length > 0) {
//         await chatService.markAsRead(conversationId, unreadMessageIds);
        
//         // Update unread count
//         setConversations(prev => prev.map(conv =>
//           conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
//         ));
//         setUnreadCount(prev => Math.max(0, prev - unreadMessageIds.length));
//       }
//     } catch (err: any) {
//       toast.error('Failed to load conversation');
//       setError(err.message);
//     } finally {
//       setMessagesLoading(false);
//     }
//   }, [user]);

//   // Send message
//   const sendMessage = useCallback(async (content: string, files?: File[], parentMessageId?: string) => {
//     if (!activeConversation) return;
    
//     try {
//       const message = await chatService.sendMessage(activeConversation.id, {
//         content,
//         files,
//         parent_message_id: parentMessageId
//       });
      
//       // Add message to state immediately
//       setMessages(prev => [...prev, message]);
      
//       // Update last message in conversation list
//       setConversations(prev => prev.map(conv => 
//         conv.id === activeConversation.id 
//           ? { ...conv, last_message_at: message.created_at }
//           : conv
//       ));
      
//       // Force a refresh of messages after a short delay
//       setTimeout(() => pollMessages(), 500);
//     } catch (err: any) {
//       toast.error('Failed to send message');
//       throw err;
//     }
//   }, [activeConversation, pollMessages]);

//   // Edit message
//   const editMessage = useCallback(async (messageId: string, content: string) => {
//     try {
//       await chatService.editMessage(messageId, content);
//       // Force refresh messages
//       setTimeout(() => pollMessages(), 500);
//     } catch (err: any) {
//       toast.error('Failed to edit message');
//     }
//   }, [pollMessages]);

//   // Delete message
//   const deleteMessage = useCallback(async (messageId: string) => {
//     try {
//       await chatService.deleteMessage(messageId);
//       // Force refresh messages
//       setTimeout(() => pollMessages(), 500);
//     } catch (err: any) {
//       toast.error('Failed to delete message');
//     }
//   }, [pollMessages]);

//   // Add reaction
//   const addReaction = useCallback(async (messageId: string, reaction: string) => {
//     try {
//       await chatService.addReaction(messageId, reaction);
//       // Force refresh messages
//       setTimeout(() => pollMessages(), 500);
//     } catch (err: any) {
//       if (err.response?.status !== 200) {
//         toast.error('Failed to add reaction');
//       }
//     }
//   }, [pollMessages]);

//   // Remove reaction
//   const removeReaction = useCallback(async (messageId: string, reaction: string) => {
//     try {
//       await chatService.removeReaction(messageId, reaction);
//       // Force refresh messages
//       setTimeout(() => pollMessages(), 500);
//     } catch (err: any) {
//       toast.error('Failed to remove reaction');
//     }
//   }, [pollMessages]);

//   // Forward message
//   const forwardMessage = useCallback(async (
//     messageId: string, 
//     conversationIds: string[], 
//     additionalContent?: string
//   ) => {
//     try {
//       await chatService.forwardMessage(messageId, {
//         conversation_ids: conversationIds,
//         additional_content: additionalContent
//       });
//       toast.success(`Message forwarded to ${conversationIds.length} conversation(s)`);
//       // Refresh conversations list
//       await loadConversations();
//     } catch (err: any) {
//       toast.error('Failed to forward message');
//     }
//   }, [loadConversations]);

//   // Mark messages as read
//   const markMessagesAsRead = useCallback(async (messageIds: string[]) => {
//     if (!activeConversation) return;
    
//     try {
//       await chatService.markAsRead(activeConversation.id, messageIds);
//     } catch (err: any) {
//       console.error('Failed to mark messages as read:', err);
//     }
//   }, [activeConversation]);

//   // Load more messages
//   const loadMoreMessages = useCallback(async () => {
//     if (!activeConversation || !hasMoreMessages || messagesLoading) return;
    
//     try {
//       setMessagesLoading(true);
//       const newOffset = messageOffset + 50;
//       const olderMessages = await chatService.getMessages(activeConversation.id, {
//         limit: 50,
//         offset: newOffset
//       });
      
//       if (olderMessages.length === 0) {
//         setHasMoreMessages(false);
//       } else {
//         setMessages(prev => [...olderMessages, ...prev]);
//         setMessageOffset(newOffset);
//       }
//     } catch (err: any) {
//       toast.error('Failed to load more messages');
//     } finally {
//       setMessagesLoading(false);
//     }
//   }, [activeConversation, messageOffset, hasMoreMessages, messagesLoading]);

//   // Search messages
//   const searchMessages = useCallback(async (query: string): Promise<Message[]> => {
//     try {
//       return await chatService.searchMessages({
//         query,
//         conversation_id: activeConversation?.id,
//         limit: 20
//       });
//     } catch (err: any) {
//       toast.error('Search failed');
//       return [];
//     }
//   }, [activeConversation]);

//   // Group management
//   const addParticipants = useCallback(async (participantIds: string[]) => {
//     if (!activeConversation || activeConversation.type !== 'group') return;
    
//     try {
//       await chatService.addParticipants(activeConversation.id, participantIds);
//       toast.success('Participants added successfully');
//       // Reload conversation
//       await selectConversation(activeConversation.id);
//     } catch (err: any) {
//       toast.error('Failed to add participants');
//     }
//   }, [activeConversation, selectConversation]);

//   const removeParticipant = useCallback(async (participantId: string) => {
//     if (!activeConversation) return;
    
//     try {
//       await chatService.removeParticipant(activeConversation.id, participantId);
//       toast.success('Participant removed');
//       // Reload conversation
//       await selectConversation(activeConversation.id);
//     } catch (err: any) {
//       toast.error('Failed to remove participant');
//     }
//   }, [activeConversation, selectConversation]);

//   const updateConversation = useCallback(async (name?: string, description?: string) => {
//     if (!activeConversation || activeConversation.type !== 'group') return;
    
//     try {
//       const updated = await chatService.updateConversation(activeConversation.id, { name, description });
//       setActiveConversation(updated);
//       setConversations(prev => prev.map(conv => 
//         conv.id === updated.id ? updated : conv
//       ));
//       toast.success('Group updated successfully');
//     } catch (err: any) {
//       toast.error('Failed to update group');
//     }
//   }, [activeConversation]);

//   // Typing indicators (stubbed for HTTP polling)
//   const startTyping = useCallback(() => {
//     // No-op for HTTP polling
//     console.debug('Typing indicators not available without WebSocket');
//   }, []);

//   const stopTyping = useCallback(() => {
//     // No-op for HTTP polling
//     console.debug('Typing indicators not available without WebSocket');
//   }, []);

//   // Refresh conversations
//   const refreshConversations = useCallback(async () => {
//     await loadConversations();
//   }, [loadConversations]);

//   // Clear active conversation
//   const clearActiveConversation = useCallback(() => {
//     setActiveConversation(null);
//     setMessages([]);
//     setMessageOffset(0);
//     setHasMoreMessages(true);
//   }, []);

//   // Set up polling for conversations list
//   useEffect(() => {
//     if (!user) return;

//     // Initial load
//     loadConversations();

//     // Set up polling interval for conversations
//     conversationsPollRef.current = setInterval(() => {
//       loadConversations();
//     }, CONVERSATIONS_POLL_INTERVAL);

//     // Set up polling interval for unread count
//     unreadPollRef.current = setInterval(() => {
//       loadUnreadCount();
//     }, UNREAD_COUNT_POLL_INTERVAL);

//     // Cleanup
//     return () => {
//       if (conversationsPollRef.current) {
//         clearInterval(conversationsPollRef.current);
//       }
//       if (unreadPollRef.current) {
//         clearInterval(unreadPollRef.current);
//       }
//     };
//   }, [user, loadConversations, loadUnreadCount]);

//   // Set up polling for messages in active conversation
//   useEffect(() => {
//     if (!activeConversation) {
//       // Clear message polling when no active conversation
//       if (messagesPollRef.current) {
//         clearInterval(messagesPollRef.current);
//         messagesPollRef.current = null;
//       }
//       return;
//     }

//     // Set up polling interval for messages
//     messagesPollRef.current = setInterval(() => {
//       pollMessages();
//     }, MESSAGES_POLL_INTERVAL);

//     // Cleanup
//     return () => {
//       if (messagesPollRef.current) {
//         clearInterval(messagesPollRef.current);
//       }
//     };
//   }, [activeConversation, pollMessages]);

//   // Clean up on unmount
//   useEffect(() => {
//     return () => {
//       if (conversationsPollRef.current) {
//         clearInterval(conversationsPollRef.current);
//       }
//       if (messagesPollRef.current) {
//         clearInterval(messagesPollRef.current);
//       }
//       if (unreadPollRef.current) {
//         clearInterval(unreadPollRef.current);
//       }
//     };
//   }, []);

//   const value: ChatContextType = {
//     // State
//     conversations,
//     activeConversation,
//     messages,
//     typingUsers,
//     onlineUsers,
//     unreadCount,
//     loading,
//     messagesLoading,
//     error,
    
//     // Actions
//     loadConversations,
//     createConversation,
//     selectConversation,
//     sendMessage,
//     editMessage,
//     deleteMessage,
//     addReaction,
//     removeReaction,
//     forwardMessage,
//     markMessagesAsRead,
//     loadMoreMessages,
//     searchMessages,
    
//     // Group management
//     addParticipants,
//     removeParticipant,
//     updateConversation,
    
//     // Typing indicators
//     startTyping,
//     stopTyping,
    
//     // Utilities
//     refreshConversations,
//     clearActiveConversation
//   };

//   return (
//     <ChatContext.Provider value={value}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = (): ChatContextType => {
//   const context = useContext(ChatContext);
//   if (context === undefined) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// };






// src/contexts/ChatContext.tsx - HTTP Polling Version

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { chatService } from '@/services/chatService';
import socketService from '@/services/socketService';
import { 
  Conversation, 
  Message, 
  CreateConversationDto, 
  SendMessageDto,
  TypingIndicator,
  OnlineStatus 
} from '@/types/chat';
import { toast } from 'sonner';

interface ChatContextType {
  // State
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  typingUsers: Map<string, TypingIndicator>;
  onlineUsers: OnlineStatus;
  unreadCount: number;
  loading: boolean;
  messagesLoading: boolean;
  error: string | null;
  
  // Actions
  loadConversations: () => Promise<void>;
  createConversation: (data: CreateConversationDto) => Promise<Conversation>;
  selectConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string, files?: File[], parentMessageId?: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, reaction: string) => Promise<void>;
  removeReaction: (messageId: string, reaction: string) => Promise<void>;
  forwardMessage: (messageId: string, conversationIds: string[], additionalContent?: string) => Promise<void>;
  markMessagesAsRead: (messageIds: string[]) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  searchMessages: (query: string) => Promise<Message[]>;
  
  // Group management
  addParticipants: (participantIds: string[]) => Promise<void>;
  removeParticipant: (participantId: string) => Promise<void>;
  updateConversation: (name?: string, description?: string) => Promise<void>;
  
  // Typing indicators (stubbed for HTTP)
  startTyping: () => void;
  stopTyping: () => void;
  
  // Utilities
  refreshConversations: () => Promise<void>;
  clearActiveConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

// Polling intervals (in milliseconds)
const CONVERSATIONS_POLL_INTERVAL = 10000; // 10 seconds
const MESSAGES_POLL_INTERVAL = 3000; // 3 seconds
const UNREAD_COUNT_POLL_INTERVAL = 5000; // 5 seconds

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingIndicator>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<OnlineStatus>({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageOffset, setMessageOffset] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  
  // Refs for polling intervals
  const conversationsPollRef = useRef<NodeJS.Timeout | null>(null);
  const messagesPollRef = useRef<NodeJS.Timeout | null>(null);
  const unreadPollRef = useRef<NodeJS.Timeout | null>(null);
  const activeConversationRef = useRef<Conversation | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  
  // Update refs when state changes
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await chatService.getMyConversations();
      
      // Sort conversations by last_message_at, handling null/invalid dates
      const sortedData = data.sort((a, b) => {
        const dateA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
        const dateB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
        
        // Check for invalid dates
        const validDateA = !isNaN(dateA) ? dateA : 0;
        const validDateB = !isNaN(dateB) ? dateB : 0;
        
        return validDateB - validDateA; // Most recent first
      });
      
      setConversations(sortedData);
      
      // Calculate total unread
      const total = sortedData.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
      setUnreadCount(total);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations');
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    if (!user) return;
    
    try {
      const data = await chatService.getUnreadCount();
      setUnreadCount(data.unread_count);
    } catch (err: any) {
      console.error('Failed to load unread count:', err);
    }
  }, [user]);

  // Poll for new messages in active conversation
  const pollMessages = useCallback(async () => {
    if (!activeConversation || messagesLoading) return;
    
    try {
      const latestMessages = await chatService.getMessages(activeConversation.id, { 
        limit: 50 
      });
      
      // Check if there are new messages
      const currentMessageIds = new Set(messages.map(m => m.id));
      const newMessages = latestMessages.filter(m => !currentMessageIds.has(m.id));
      
      if (newMessages.length > 0) {
        setMessages(latestMessages);
        
        // Mark new messages as read if they're not from the current user
        const unreadMessageIds = newMessages
          .filter(m => m.sender_id !== user?.id)
          .map(m => m.id);
        
        if (unreadMessageIds.length > 0) {
          await chatService.markAsRead(activeConversation.id, unreadMessageIds);
          
          // Update unread count in conversation list
          setConversations(prev => prev.map(conv =>
            conv.id === activeConversation.id ? { ...conv, unread_count: 0 } : conv
          ));
        }
      }
      
      // Check for edited or deleted messages
      const messageMap = new Map(messages.map(m => [m.id, m]));
      const updatedMessages = latestMessages.filter(m => {
        const oldMsg = messageMap.get(m.id);
        return oldMsg && (
          oldMsg.content !== m.content || 
          oldMsg.is_deleted !== m.is_deleted ||
          oldMsg.is_edited !== m.is_edited
        );
      });
      
      if (updatedMessages.length > 0 || newMessages.length > 0) {
        setMessages(latestMessages);
      }
    } catch (err: any) {
      console.error('Failed to poll messages:', err);
    }
  }, [activeConversation, messages, user, messagesLoading]);

  // Create conversation
  const createConversation = useCallback(async (data: CreateConversationDto): Promise<Conversation> => {
    try {
      const conversation = await chatService.createConversation(data);
      setConversations(prev => [conversation, ...prev]);
      toast.success(data.type === 'group' ? 'Group created successfully' : 'Conversation started');
      return conversation;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create conversation');
      throw err;
    }
  }, []);

  // Select conversation
  const selectConversation = useCallback(async (conversationId: string) => {
    try {
      setMessagesLoading(true);
      setMessageOffset(0);
      setHasMoreMessages(true);
      
      // Get conversation details
      const conversation = await chatService.getConversation(conversationId);
      setActiveConversation(conversation);
      
      // Load messages
      const messages = await chatService.getMessages(conversationId, { limit: 50 });
      setMessages(messages);
      
      // Store last message ID for polling comparison
      if (messages.length > 0) {
        lastMessageIdRef.current = messages[messages.length - 1].id;
      }
      
      // Mark messages as read
      const unreadMessageIds = messages
        .filter(m => m.sender_id !== user?.id && !m.MessageReadStatuses?.find(rs => rs.user_id === user?.id && rs.is_read))
        .map(m => m.id);
      
      if (unreadMessageIds.length > 0) {
        await chatService.markAsRead(conversationId, unreadMessageIds);
        
        // Update unread count
        setConversations(prev => prev.map(conv =>
          conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
        ));
        setUnreadCount(prev => Math.max(0, prev - unreadMessageIds.length));
      }
    } catch (err: any) {
      toast.error('Failed to load conversation');
      setError(err.message);
    } finally {
      setMessagesLoading(false);
    }
  }, [user]);

  // Send message
  const sendMessage = useCallback(async (content: string, files?: File[], parentMessageId?: string) => {
    if (!activeConversation) return;
    
    try {
      const message = await chatService.sendMessage(activeConversation.id, {
        content,
        files,
        parent_message_id: parentMessageId
      });
      
      // Add message to state immediately
      setMessages(prev => [...prev, message]);
      
      // Update last message in conversation list
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation.id 
          ? { ...conv, last_message_at: message.created_at || new Date().toISOString() }
          : conv
      ));
      
      // Force a refresh of messages after a short delay
      setTimeout(() => pollMessages(), 500);
    } catch (err: any) {
      toast.error('Failed to send message');
      throw err;
    }
  }, [activeConversation, pollMessages]);

  // Edit message
  const editMessage = useCallback(async (messageId: string, content: string) => {
    try {
      await chatService.editMessage(messageId, content);
      // Force refresh messages
      setTimeout(() => pollMessages(), 500);
    } catch (err: any) {
      toast.error('Failed to edit message');
    }
  }, [pollMessages]);

  // Delete message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await chatService.deleteMessage(messageId);
      // Force refresh messages
      setTimeout(() => pollMessages(), 500);
    } catch (err: any) {
      toast.error('Failed to delete message');
    }
  }, [pollMessages]);

  // Add reaction
  const addReaction = useCallback(async (messageId: string, reaction: string) => {
    try {
      await chatService.addReaction(messageId, reaction);
      // Force refresh messages
      setTimeout(() => pollMessages(), 500);
    } catch (err: any) {
      if (err.response?.status !== 200) {
        toast.error('Failed to add reaction');
      }
    }
  }, [pollMessages]);

  // Remove reaction
  const removeReaction = useCallback(async (messageId: string, reaction: string) => {
    try {
      await chatService.removeReaction(messageId, reaction);
      // Force refresh messages
      setTimeout(() => pollMessages(), 500);
    } catch (err: any) {
      toast.error('Failed to remove reaction');
    }
  }, [pollMessages]);

  // Forward message
  const forwardMessage = useCallback(async (
    messageId: string, 
    conversationIds: string[], 
    additionalContent?: string
  ) => {
    try {
      await chatService.forwardMessage(messageId, {
        conversation_ids: conversationIds,
        additional_content: additionalContent
      });
      toast.success(`Message forwarded to ${conversationIds.length} conversation(s)`);
      // Refresh conversations list
      await loadConversations();
    } catch (err: any) {
      toast.error('Failed to forward message');
    }
  }, [loadConversations]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (messageIds: string[]) => {
    if (!activeConversation) return;
    
    try {
      await chatService.markAsRead(activeConversation.id, messageIds);
    } catch (err: any) {
      console.error('Failed to mark messages as read:', err);
    }
  }, [activeConversation]);

  // Load more messages
  const loadMoreMessages = useCallback(async () => {
    if (!activeConversation || !hasMoreMessages || messagesLoading) return;
    
    try {
      setMessagesLoading(true);
      const newOffset = messageOffset + 50;
      const olderMessages = await chatService.getMessages(activeConversation.id, {
        limit: 50,
        offset: newOffset
      });
      
      if (olderMessages.length === 0) {
        setHasMoreMessages(false);
      } else {
        setMessages(prev => [...olderMessages, ...prev]);
        setMessageOffset(newOffset);
      }
    } catch (err: any) {
      toast.error('Failed to load more messages');
    } finally {
      setMessagesLoading(false);
    }
  }, [activeConversation, messageOffset, hasMoreMessages, messagesLoading]);

  // Search messages
  const searchMessages = useCallback(async (query: string): Promise<Message[]> => {
    try {
      return await chatService.searchMessages({
        query,
        conversation_id: activeConversation?.id,
        limit: 20
      });
    } catch (err: any) {
      toast.error('Search failed');
      return [];
    }
  }, [activeConversation]);

  // Group management
  const addParticipants = useCallback(async (participantIds: string[]) => {
    if (!activeConversation || activeConversation.type !== 'group') return;
    
    try {
      await chatService.addParticipants(activeConversation.id, participantIds);
      toast.success('Participants added successfully');
      // Reload conversation
      await selectConversation(activeConversation.id);
    } catch (err: any) {
      toast.error('Failed to add participants');
    }
  }, [activeConversation, selectConversation]);

  const removeParticipant = useCallback(async (participantId: string) => {
    if (!activeConversation) return;
    
    try {
      await chatService.removeParticipant(activeConversation.id, participantId);
      toast.success('Participant removed');
      // Reload conversation
      await selectConversation(activeConversation.id);
    } catch (err: any) {
      toast.error('Failed to remove participant');
    }
  }, [activeConversation, selectConversation]);

  const updateConversation = useCallback(async (name?: string, description?: string) => {
    if (!activeConversation || activeConversation.type !== 'group') return;
    
    try {
      const updated = await chatService.updateConversation(activeConversation.id, { name, description });
      setActiveConversation(updated);
      setConversations(prev => prev.map(conv => 
        conv.id === updated.id ? updated : conv
      ));
      toast.success('Group updated successfully');
    } catch (err: any) {
      toast.error('Failed to update group');
    }
  }, [activeConversation]);

  // Typing indicators (stubbed for HTTP polling)
  const startTyping = useCallback(() => {
    // No-op for HTTP polling
    console.debug('Typing indicators not available without WebSocket');
  }, []);

  const stopTyping = useCallback(() => {
    // No-op for HTTP polling
    console.debug('Typing indicators not available without WebSocket');
  }, []);

  // Refresh conversations
  const refreshConversations = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  // Clear active conversation
  const clearActiveConversation = useCallback(() => {
    setActiveConversation(null);
    setMessages([]);
    setMessageOffset(0);
    setHasMoreMessages(true);
  }, []);

  // Set up polling for conversations list
  useEffect(() => {
    if (!user) return;

    // Initial load
    loadConversations();

    // Set up polling interval for conversations
    conversationsPollRef.current = setInterval(() => {
      loadConversations();
    }, CONVERSATIONS_POLL_INTERVAL);

    // Set up polling interval for unread count
    unreadPollRef.current = setInterval(() => {
      loadUnreadCount();
    }, UNREAD_COUNT_POLL_INTERVAL);

    // Cleanup
    return () => {
      if (conversationsPollRef.current) {
        clearInterval(conversationsPollRef.current);
      }
      if (unreadPollRef.current) {
        clearInterval(unreadPollRef.current);
      }
    };
  }, [user, loadConversations, loadUnreadCount]);

  // Set up polling for messages in active conversation
  useEffect(() => {
    if (!activeConversation) {
      // Clear message polling when no active conversation
      if (messagesPollRef.current) {
        clearInterval(messagesPollRef.current);
        messagesPollRef.current = null;
      }
      return;
    }

    // Set up polling interval for messages
    messagesPollRef.current = setInterval(() => {
      pollMessages();
    }, MESSAGES_POLL_INTERVAL);

    // Cleanup
    return () => {
      if (messagesPollRef.current) {
        clearInterval(messagesPollRef.current);
      }
    };
  }, [activeConversation, pollMessages]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (conversationsPollRef.current) {
        clearInterval(conversationsPollRef.current);
      }
      if (messagesPollRef.current) {
        clearInterval(messagesPollRef.current);
      }
      if (unreadPollRef.current) {
        clearInterval(unreadPollRef.current);
      }
    };
  }, []);

  const value: ChatContextType = {
    // State
    conversations,
    activeConversation,
    messages,
    typingUsers,
    onlineUsers,
    unreadCount,
    loading,
    messagesLoading,
    error,
    
    // Actions
    loadConversations,
    createConversation,
    selectConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    forwardMessage,
    markMessagesAsRead,
    loadMoreMessages,
    searchMessages,
    
    // Group management
    addParticipants,
    removeParticipant,
    updateConversation,
    
    // Typing indicators
    startTyping,
    stopTyping,
    
    // Utilities
    refreshConversations,
    clearActiveConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
