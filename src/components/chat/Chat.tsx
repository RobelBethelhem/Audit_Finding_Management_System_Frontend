// // src/components/chat/Chat.tsx - FIXED for username only
// import { useState, useRef, useEffect } from 'react';
// import { useChat } from '@/contexts/ChatContext'; // Fixed capital C
// import { useAuth } from '@/hooks/useAuth';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from '@/components/ui/tooltip';
// import { cn } from '@/lib/utils';
// import { 
//   Send, 
//   Paperclip, 
//   Search, 
//   MoreVertical, 
//   Users, 
//   Plus,
//   Edit2,
//   Trash2,
//   Reply,
//   Forward,
//   Download,
//   Image,
//   File,
//   MessageCircle,
//   ChevronLeft,
//   Smile,
//   Check,
//   CheckCheck,
//   Clock,
//   UserPlus,
//   Settings,
//   X
// } from 'lucide-react';
// import { chatService } from '@/services/chatService';
// import { Message as MessageType, AVAILABLE_REACTIONS } from '@/types/chat';
// import { format, isToday, isYesterday } from 'date-fns';

// export const Chat = () => {
//   const { user } = useAuth();
//   const {
//     conversations,
//     activeConversation,
//     messages,
//     typingUsers,
//     onlineUsers,
//     unreadCount,
//     loading,
//     messagesLoading,
//     selectConversation,
//     sendMessage,
//     editMessage,
//     deleteMessage,
//     addReaction,
//     removeReaction,
//     startTyping,
//     stopTyping,
//     clearActiveConversation,
//     loadMoreMessages
//   } = useChat();

//   const [messageInput, setMessageInput] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [editingMessage, setEditingMessage] = useState<MessageType | null>(null);
//   const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
//   const [showReactions, setShowReactions] = useState<string | null>(null);
//   const [showNewConversation, setShowNewConversation] = useState(false);
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const scrollAreaRef = useRef<HTMLDivElement>(null);
//   const lastMessageCountRef = useRef(messages.length);

//   // Auto-scroll to bottom on new messages
//   useEffect(() => {
//     if (messages.length > lastMessageCountRef.current) {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }
//     lastMessageCountRef.current = messages.length;
//   }, [messages]);

//   // Handle typing indicator
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setMessageInput(e.target.value);
//     if (e.target.value.length > 0) {
//       startTyping();
//     } else {
//       stopTyping();
//     }
//   };

//   // Send message
//   const handleSendMessage = async () => {
//     if (!messageInput.trim() && selectedFiles.length === 0) return;
    
//     try {
//       await sendMessage(
//         messageInput,
//         selectedFiles,
//         replyingTo?.id
//       );
      
//       setMessageInput('');
//       setSelectedFiles([]);
//       setReplyingTo(null);
//       setEditingMessage(null);
//       stopTyping();
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   };

//   // Handle edit message
//   const handleEditMessage = async () => {
//     if (!editingMessage || !messageInput.trim()) return;
    
//     try {
//       await editMessage(editingMessage.id, messageInput);
//       setEditingMessage(null);
//       setMessageInput('');
//     } catch (error) {
//       console.error('Failed to edit message:', error);
//     }
//   };

//   // Format message time
//   const formatMessageTime = (dateString: string) => {
//     const date = new Date(dateString);
    
//     if (isToday(date)) {
//       return format(date, 'HH:mm');
//     }
    
//     if (isYesterday(date)) {
//       return 'Yesterday ' + format(date, 'HH:mm');
//     }
    
//     return format(date, 'dd/MM/yyyy HH:mm');
//   };

//   // Get user initials from username only
//   const getUserInitials = (username?: string) => {
//     if (username) {
//       return username.substring(0, 2).toUpperCase();
//     }
//     return 'U';
//   };

//   // Filter conversations based on search
//   const filteredConversations = conversations.filter(conv => {
//     if (!searchQuery) return true;
    
//     const searchLower = searchQuery.toLowerCase();
    
//     // Search in conversation name
//     if (conv.name?.toLowerCase().includes(searchLower)) return true;
    
//     // Search in participant usernames
//     if (conv.participants) {
//       return conv.participants.some(p => 
//         p.User?.username?.toLowerCase().includes(searchLower)
//       );
//     }
    
//     return false;
//   });

//   // Get conversation display name
//   const getConversationName = (conversation: typeof conversations[0]) => {
//     if (conversation.type === 'group') {
//       return conversation.name || 'Unnamed Group';
//     }
    
//     // For direct chat, show the other participant's username
//     const otherParticipant = conversation.participants?.find(p => p.user_id !== user?.id);
//     if (otherParticipant?.User) {
//       return otherParticipant.User.username;
//     }
    
//     return 'Direct Chat';
//   };

//   // Message component
//   const Message = ({ message, isOwn }: { message: MessageType; isOwn: boolean }) => {
//     const [showActions, setShowActions] = useState(false);
    
//     return (
//       <div
//         className={cn(
//           "group flex gap-3 px-4 py-2 hover:bg-gray-50",
//           isOwn && "flex-row-reverse"
//         )}
//         onMouseEnter={() => setShowActions(true)}
//         onMouseLeave={() => setShowActions(false)}
//       >
//         <Avatar className="h-8 w-8 flex-shrink-0">
//           <AvatarFallback>
//             {getUserInitials(message.sender?.username)}
//           </AvatarFallback>
//         </Avatar>
        
//         <div className={cn("flex-1 max-w-[70%]", isOwn && "flex flex-col items-end")}>
//           <div className="flex items-baseline gap-2 mb-1">
//             <span className="text-sm font-medium">
//               {message.sender?.username}
//             </span>
//             <span className="text-xs text-gray-500">
//               {formatMessageTime(message.created_at)}
//             </span>
//             {message.is_edited && (
//               <span className="text-xs text-gray-400">(edited)</span>
//             )}
//           </div>
          
//           {message.parentMessage && (
//             <div className="bg-gray-100 rounded px-2 py-1 mb-2 text-sm border-l-2 border-blue-500">
//               <div className="text-xs text-gray-600 mb-1">
//                 Replying to {message.parentMessage.sender?.username}
//               </div>
//               <div className="text-gray-700 line-clamp-2">
//                 {message.parentMessage.content}
//               </div>
//             </div>
//           )}
          
//           <div className={cn(
//             "rounded-lg px-3 py-2",
//             isOwn ? "bg-red-600 text-white" : "bg-gray-100 text-gray-900"
//           )}>
//             {message.is_deleted ? (
//               <span className="italic text-gray-500">Message deleted</span>
//             ) : (
//               <div className="whitespace-pre-wrap break-words">{message.content}</div>
//             )}
            
//             {message.MessageAttachments && message.MessageAttachments.length > 0 && (
//               <div className="mt-2 space-y-1">
//                 {message.MessageAttachments.map(attachment => (
//                   <div
//                     key={attachment.id}
//                     className={cn(
//                       "flex items-center gap-2 p-2 rounded",
//                       isOwn ? "bg-red-700" : "bg-gray-200"
//                     )}
//                   >
//                     {attachment.mime_type?.startsWith('image/') ? (
//                       <Image className="h-4 w-4" />
//                     ) : (
//                       <File className="h-4 w-4" />
//                     )}
//                     <span className="text-sm truncate flex-1">
//                       {attachment.file_name}
//                     </span>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       className="h-6 w-6 p-0"
//                       onClick={() => window.open(chatService.getAttachmentUrl(attachment.id))}
//                     >
//                       <Download className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           {/* Reactions */}
//           {message.MessageReactions && message.MessageReactions.length > 0 && (
//             <div className="flex flex-wrap gap-1 mt-1">
//               {Object.entries(
//                 message.MessageReactions.reduce((acc, reaction) => {
//                   if (!acc[reaction.reaction]) {
//                     acc[reaction.reaction] = [];
//                   }
//                   acc[reaction.reaction].push(reaction.User?.username || 'Unknown');
//                   return acc;
//                 }, {} as Record<string, string[]>)
//               ).map(([emoji, users]) => (
//                 <Tooltip key={emoji}>
//                   <TooltipTrigger>
//                     <div
//                       className={cn(
//                         "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
//                         "bg-gray-100 hover:bg-gray-200 cursor-pointer"
//                       )}
//                       onClick={() => {
//                         const hasReacted = message.MessageReactions?.some(
//                           r => r.reaction === emoji && r.user_id === user?.id
//                         );
//                         if (hasReacted) {
//                           removeReaction(message.id, emoji);
//                         } else {
//                           addReaction(message.id, emoji);
//                         }
//                       }}
//                     >
//                       <span>{emoji}</span>
//                       <span>{users.length}</span>
//                     </div>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     {users.join(', ')}
//                   </TooltipContent>
//                 </Tooltip>
//               ))}
//             </div>
//           )}
          
//           {/* Message actions */}
//           {showActions && !message.is_deleted && (
//             <div className="flex items-center gap-1 mt-1">
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 className="h-6 w-6 p-0"
//                 onClick={() => setShowReactions(message.id)}
//               >
//                 <Smile className="h-3 w-3" />
//               </Button>
              
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 className="h-6 w-6 p-0"
//                 onClick={() => setReplyingTo(message)}
//               >
//                 <Reply className="h-3 w-3" />
//               </Button>
              
//               {isOwn && (
//                 <>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     className="h-6 w-6 p-0"
//                     onClick={() => {
//                       setEditingMessage(message);
//                       setMessageInput(message.content || '');
//                     }}
//                   >
//                     <Edit2 className="h-3 w-3" />
//                   </Button>
                  
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     className="h-6 w-6 p-0"
//                     onClick={() => deleteMessage(message.id)}
//                   >
//                     <Trash2 className="h-3 w-3" />
//                   </Button>
//                 </>
//               )}
//             </div>
//           )}
          
//           {/* Reaction picker */}
//           {showReactions === message.id && (
//             <div className="flex flex-wrap gap-1 mt-2 p-2 bg-white rounded-lg shadow-lg">
//               {AVAILABLE_REACTIONS.map(reaction => (
//                 <button
//                   key={reaction}
//                   className="hover:scale-125 transition-transform p-1"
//                   onClick={() => {
//                     addReaction(message.id, reaction);
//                     setShowReactions(null);
//                   }}
//                 >
//                   {reaction}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm">
//       {/* Conversations List */}
//       <div className="w-80 border-r flex flex-col">
//         {/* Header */}
//         <div className="p-4 border-b">
//           <div className="flex items-center justify-between mb-3">
//             <h2 className="text-lg font-semibold">Chats</h2>
//             <Button
//               size="sm"
//               variant="ghost"
//               onClick={() => setShowNewConversation(true)}
//             >
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>
          
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input
//               placeholder="Search conversations..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9"
//             />
//           </div>
//         </div>
        
//         {/* Conversations */}
//         <ScrollArea className="flex-1">
//           {loading ? (
//             <div className="flex items-center justify-center p-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
//             </div>
//           ) : filteredConversations.length === 0 ? (
//             <div className="text-center p-8 text-gray-500">
//               No conversations yet
//             </div>
//           ) : (
//             <div className="divide-y">
//               {filteredConversations.map(conversation => {
//                 const isActive = activeConversation?.id === conversation.id;
//                 const lastMessage = conversation.Messages?.[0];
//                 const displayName = getConversationName(conversation);
                
//                 return (
//                   <div
//                     key={conversation.id}
//                     className={cn(
//                       "p-3 hover:bg-gray-50 cursor-pointer transition-colors",
//                       isActive && "bg-red-50"
//                     )}
//                     onClick={() => selectConversation(conversation.id)}
//                   >
//                     <div className="flex items-start gap-3">
//                       <Avatar className="h-10 w-10">
//                         <AvatarFallback>
//                           {getUserInitials(displayName)}
//                         </AvatarFallback>
//                       </Avatar>
                      
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium truncate">
//                             {displayName}
//                           </span>
//                           {lastMessage && (
//                             <span className="text-xs text-gray-500">
//                               {chatService.formatMessageTime(lastMessage.created_at)}
//                             </span>
//                           )}
//                         </div>
                        
//                         {lastMessage && (
//                           <p className="text-sm text-gray-600 truncate">
//                             {lastMessage.sender?.id === user?.id && 'You: '}
//                             {lastMessage.content || '[Attachment]'}
//                           </p>
//                         )}
                        
//                         {conversation.unread_count && conversation.unread_count > 0 && (
//                           <Badge className="mt-1" variant="destructive">
//                             {conversation.unread_count}
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </ScrollArea>
//       </div>
      
//       {/* Chat Area */}
//       {activeConversation ? (
//         <div className="flex-1 flex flex-col">
//           {/* Chat Header */}
//           <div className="p-4 border-b flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 className="lg:hidden"
//                 onClick={clearActiveConversation}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
              
//               <Avatar>
//                 <AvatarFallback>
//                   {getUserInitials(getConversationName(activeConversation))}
//                 </AvatarFallback>
//               </Avatar>
              
//               <div>
//                 <h3 className="font-semibold">{getConversationName(activeConversation)}</h3>
//                 {activeConversation.type === 'group' && (
//                   <p className="text-sm text-gray-500">
//                     {activeConversation.participants?.length} members
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button size="sm" variant="ghost">
//                   <MoreVertical className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 {activeConversation.type === 'group' && (
//                   <>
//                     <DropdownMenuItem>
//                       <UserPlus className="h-4 w-4 mr-2" />
//                       Add Members
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <Settings className="h-4 w-4 mr-2" />
//                       Group Settings
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                   </>
//                 )}
//                 <DropdownMenuItem className="text-red-600">
//                   Leave Conversation
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
          
//           {/* Messages */}
//           <ScrollArea className="flex-1" ref={scrollAreaRef}>
//             <div className="py-4">
//               {messagesLoading && messages.length === 0 ? (
//                 <div className="flex items-center justify-center p-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
//                 </div>
//               ) : (
//                 <>
//                   {messages.map(message => (
//                     <Message
//                       key={message.id}
//                       message={message}
//                       isOwn={message.sender_id === user?.id}
//                     />
//                   ))}
                  
//                   {/* Typing indicators */}
//                   {Array.from(typingUsers.values())
//                     .filter(t => t.conversationId === activeConversation.id)
//                     .map(typing => (
//                       <div key={typing.userId} className="px-4 py-2 text-sm text-gray-500">
//                         {typing.username} is typing...
//                       </div>
//                     ))
//                   }
                  
//                   <div ref={messagesEndRef} />
//                 </>
//               )}
//             </div>
//           </ScrollArea>
          
//           {/* Input Area */}
//           <div className="p-4 border-t">
//             {/* Reply indicator */}
//             {replyingTo && (
//               <div className="flex items-center justify-between mb-2 p-2 bg-gray-100 rounded">
//                 <div className="text-sm">
//                   <span className="text-gray-600">Replying to </span>
//                   <span className="font-medium">{replyingTo.sender?.username}</span>
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={() => setReplyingTo(null)}
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               </div>
//             )}
            
//             {/* Edit indicator */}
//             {editingMessage && (
//               <div className="flex items-center justify-between mb-2 p-2 bg-blue-50 rounded">
//                 <div className="text-sm text-blue-700">
//                   Editing message
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={() => {
//                     setEditingMessage(null);
//                     setMessageInput('');
//                   }}
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               </div>
//             )}
            
//             {/* Selected files */}
//             {selectedFiles.length > 0 && (
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {selectedFiles.map((file, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
//                   >
//                     <File className="h-3 w-3" />
//                     <span className="truncate max-w-[150px]">{file.name}</span>
//                     <button
//                       onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
//                       className="hover:text-red-600"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
            
//             <div className="flex items-center gap-2">
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 multiple
//                 className="hidden"
//                 onChange={(e) => {
//                   if (e.target.files) {
//                     setSelectedFiles(Array.from(e.target.files));
//                   }
//                 }}
//               />
              
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <Paperclip className="h-4 w-4" />
//               </Button>
              
//               <Input
//                 placeholder="Type a message..."
//                 value={messageInput}
//                 onChange={handleInputChange}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     if (editingMessage) {
//                       handleEditMessage();
//                     } else {
//                       handleSendMessage();
//                     }
//                   }
//                 }}
//                 className="flex-1"
//               />
              
//               <Button
//                 size="sm"
//                 onClick={editingMessage ? handleEditMessage : handleSendMessage}
//                 disabled={!messageInput.trim() && selectedFiles.length === 0}
//               >
//                 <Send className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center text-gray-500">
//           <div className="text-center">
//             <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
//             <p className="text-lg">Select a conversation to start chatting</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// src/components/chat/Chat.tsx

// import React, { useState, useEffect, useRef } from 'react';
// import { useChat } from '@/contexts/ChatContext';
// import { useAuth } from '@/hooks/useAuth';
// import { 
//   Send, 
//   Plus, 
//   Search, 
//   MoreVertical, 
//   Paperclip, 
//   Smile, 
//   Edit2, 
//   Trash2, 
//   Reply,
//   Forward,
//   Users,
//   X,
//   Check,
//   CheckCheck,
//   MessageCircle
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { toast } from 'sonner';
// import { format, isToday, isYesterday } from 'date-fns';
// import { Message, Conversation, AVAILABLE_REACTIONS } from '@/types/chat';
// import { User } from '@/types/user';

// export const Chat = () => {
//   const { user } = useAuth();
//   const {
//     conversations,
//     activeConversation,
//     messages,
//     unreadCount,
//     loading,
//     messagesLoading,
//     loadConversations,
//     createConversation,
//     selectConversation,
//     sendMessage,
//     editMessage,
//     deleteMessage,
//     addReaction,
//     removeReaction,
//     loadMoreMessages,
//     searchMessages,
//     clearActiveConversation,
//     refreshConversations
//   } = useChat();

//   const [messageInput, setMessageInput] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showCreateDialog, setShowCreateDialog] = useState(false);
//   const [createType, setCreateType] = useState<'direct' | 'group'>('direct');
//   const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
//   const [groupName, setGroupName] = useState('');
//   const [groupDescription, setGroupDescription] = useState('');
//   const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
//   const [editingContent, setEditingContent] = useState('');
//   const [replyingTo, setReplyingTo] = useState<Message | null>(null);
//   const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
//   const [availableUsers, setAvailableUsers] = useState<any[]>([]);
//   const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
//   const [userSearchQuery, setUserSearchQuery] = useState('');
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [userPage, setUserPage] = useState(1);
//   const [totalUserPages, setTotalUserPages] = useState(1);
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);

//   // Scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (messages.length > 0) {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   // Load available users for creating conversations
//   const loadAvailableUsers = async (page: number = 1, searchTerm: string = '') => {
//     try {
//       setLoadingUsers(true);
//       let allUsers: any[] = [];
//       let currentPage = 1;
//       let totalPages = 1;
      
//       // Load all pages to get all users (or you can implement lazy loading)
//       do {
//         const response = await fetch(
//           `https://aps2.zemenbank.com/ZAMS/api/auth?page=${currentPage}&limit=100`,
//           {
//             headers: {
//               'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
//             }
//           }
//         );
        
//         if (response.ok) {
//           const result = await response.json();
//           allUsers = [...allUsers, ...result.data];
//           totalPages = result.totalPages;
//           currentPage++;
//         } else {
//           break;
//         }
//       } while (currentPage <= totalPages);
      
//       // Filter out current user and apply search
//       let filteredUsers = allUsers.filter((u: any) => u.id !== user?.id);
      
//       // Apply search filter if search term exists
//       if (searchTerm) {
//         filteredUsers = filteredUsers.filter((u: any) => 
//           u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           u.role?.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
      
//       setAvailableUsers(filteredUsers);
//       setTotalUserPages(totalPages);
//     } catch (error) {
//       console.error('Failed to load users:', error);
//       toast.error('Failed to load users');
//       setAvailableUsers([]);
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   // Debounced user search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (showCreateDialog) {
//         loadAvailableUsers(1, userSearchQuery);
//       }
//     }, 300);
    
//     return () => clearTimeout(timer);
//   }, [userSearchQuery, showCreateDialog]);

//   // Get conversation display name
//   const getConversationDisplayName = (conv: Conversation): string => {
//     if (conv.name) return conv.name;
    
//     // For direct chats, find the other participant
//     if (conv.type === 'direct' && conv.participants) {
//       const otherParticipant = conv.participants.find(p => p.user_id !== user?.id);
//       return otherParticipant?.User?.username || 'Unknown User';
//     }
    
//     return 'Unknown Conversation';
//   };

//   // Get conversation participants for display
//   const getOtherParticipant = (conv: Conversation): User | undefined => {
//     if (conv.type === 'direct' && conv.participants) {
//       const participant = conv.participants.find(p => p.user_id !== user?.id);
//       return participant?.User;
//     }
//     return undefined;
//   };

//   // Handle send message
//   const handleSendMessage = async () => {
//     if (!messageInput.trim() && attachedFiles.length === 0) return;
//     if (!activeConversation) return;

//     try {
//       await sendMessage(
//         messageInput.trim(),
//         attachedFiles,
//         replyingTo?.id
//       );
//       setMessageInput('');
//       setReplyingTo(null);
//       setAttachedFiles([]);
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   };

//   // Handle create conversation
//   const handleCreateConversation = async () => {
//     if (createType === 'direct' && selectedUsers.length !== 1) {
//       toast.error('Please select exactly one user for direct chat');
//       return;
//     }
    
//     if (createType === 'group' && selectedUsers.length < 1) {
//       toast.error('Please select at least one user for group chat');
//       return;
//     }
    
//     if (createType === 'group' && !groupName.trim()) {
//       toast.error('Please enter a group name');
//       return;
//     }

//     try {
//       const conversation = await createConversation({
//         type: createType,
//         participant_ids: selectedUsers,
//         name: createType === 'group' ? groupName : undefined,
//         description: createType === 'group' ? groupDescription : undefined
//       });
      
//       setShowCreateDialog(false);
//       setSelectedUsers([]);
//       setGroupName('');
//       setGroupDescription('');
//       setCreateType('direct');
//       setUserSearchQuery('');
      
//       // Select the newly created conversation
//       await selectConversation(conversation.id);
//     } catch (error) {
//       console.error('Failed to create conversation:', error);
//     }
//   };

//   // Handle edit message
//   const handleEditMessage = async (messageId: string, content: string) => {
//     if (!content.trim()) return;
    
//     try {
//       await editMessage(messageId, content);
//       setEditingMessageId(null);
//       setEditingContent('');
//     } catch (error) {
//       console.error('Failed to edit message:', error);
//     }
//   };

//   // Handle delete message
//   const handleDeleteMessage = async (messageId: string) => {
//     if (confirm('Are you sure you want to delete this message?')) {
//       try {
//         await deleteMessage(messageId);
//       } catch (error) {
//         console.error('Failed to delete message:', error);
//       }
//     }
//   };

//   // Handle reaction
//   const handleReaction = async (messageId: string, reaction: string) => {
//     try {
//       // Check if user already has this reaction
//       const message = messages.find(m => m.id === messageId);
//       const existingReaction = message?.MessageReactions?.find(
//         r => r.user_id === user?.id && r.reaction === reaction
//       );
      
//       if (existingReaction) {
//         await removeReaction(messageId, reaction);
//       } else {
//         await addReaction(messageId, reaction);
//       }
      
//       setShowReactionPicker(null);
//     } catch (error) {
//       console.error('Failed to handle reaction:', error);
//     }
//   };

//   // Handle file selection
//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setAttachedFiles(prev => [...prev, ...files]);
//   };

//   // Format message time
//   const formatMessageTime = (date: string) => {
//     const messageDate = new Date(date);
//     if (isToday(messageDate)) {
//       return format(messageDate, 'HH:mm');
//     } else if (isYesterday(messageDate)) {
//       return `Yesterday ${format(messageDate, 'HH:mm')}`;
//     } else {
//       return format(messageDate, 'dd/MM/yyyy HH:mm');
//     }
//   };

//   // Get user initials
//   const getUserInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Filter conversations based on search
//   const filteredConversations = conversations.filter(conv => {
//     if (!searchQuery) return true;
    
//     const conversationName = getConversationDisplayName(conv);
//     return conversationName.toLowerCase().includes(searchQuery.toLowerCase());
//   });

//   return (
//     <div className="flex h-full bg-white rounded-lg shadow-sm">
//       {/* Conversations List */}
//       <div className="w-80 border-r flex flex-col">
//         {/* Header */}
//         <div className="p-4 border-b">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold">Messages</h2>
//             <Button
//               size="sm"
//               variant="ghost"
//               onClick={() => {
//                 loadAvailableUsers();
//                 setShowCreateDialog(true);
//               }}
//               className="h-8 w-8 p-0"
//             >
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>
          
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input
//               placeholder="Search conversations..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9"
//             />
//           </div>
//         </div>

//         {/* Conversations List */}
//         <ScrollArea className="flex-1">
//           {loading ? (
//             <div className="p-4 text-center text-gray-500">Loading...</div>
//           ) : filteredConversations.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">
//               {searchQuery ? 'No conversations found' : 'No conversations yet'}
//             </div>
//           ) : (
//             <div className="divide-y">
//               {filteredConversations.map((conv) => {
//                 const displayName = getConversationDisplayName(conv);
//                 const lastMessage = conv.Messages?.[0];
//                 const isActive = activeConversation?.id === conv.id;
                
//                 return (
//                   <div
//                     key={conv.id}
//                     onClick={() => selectConversation(conv.id)}
//                     className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
//                       isActive ? 'bg-blue-50' : ''
//                     }`}
//                   >
//                     <div className="flex items-start space-x-3">
//                       <Avatar className="h-10 w-10">
//                         <AvatarFallback>
//                           {getUserInitials(displayName)}
//                         </AvatarFallback>
//                       </Avatar>
                      
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between">
//                           <p className="font-medium truncate">{displayName}</p>
//                           {lastMessage && (
//                             <span className="text-xs text-gray-500">
//                               {formatMessageTime(lastMessage.created_at)}
//                             </span>
//                           )}
//                         </div>
                        
//                         {lastMessage && (
//                           <p className="text-sm text-gray-600 truncate">
//                             {lastMessage.sender_id === user?.id && 'You: '}
//                             {lastMessage.content || '[Attachment]'}
//                           </p>
//                         )}
                        
//                         {conv.unread_count && conv.unread_count > 0 && (
//                           <Badge variant="destructive" className="mt-1">
//                             {conv.unread_count}
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </ScrollArea>
//       </div>

//       {/* Chat Area */}
//       {activeConversation ? (
//         <div className="flex-1 flex flex-col">
//           {/* Chat Header */}
//           <div className="p-4 border-b flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <Avatar className="h-10 w-10">
//                 <AvatarFallback>
//                   {getUserInitials(getConversationDisplayName(activeConversation))}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="font-medium">
//                   {getConversationDisplayName(activeConversation)}
//                 </p>
//                 {activeConversation.type === 'group' && (
//                   <p className="text-sm text-gray-500">
//                     {activeConversation.participants?.length} members
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-2">
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={clearActiveConversation}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <ScrollArea className="flex-1 p-4" ref={messagesContainerRef}>
//             {messagesLoading ? (
//               <div className="text-center text-gray-500">Loading messages...</div>
//             ) : messages.length === 0 ? (
//               <div className="text-center text-gray-500">No messages yet. Start a conversation!</div>
//             ) : (
//               <div className="space-y-4">
//                 {messages.map((message) => {
//                   const isOwnMessage = message.sender_id === user?.id;
//                   const isEditing = editingMessageId === message.id;
                  
//                   return (
//                     <div
//                       key={message.id}
//                       className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
//                     >
//                       <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
//                         <div className="flex items-end space-x-2">
//                           {!isOwnMessage && (
//                             <Avatar className="h-8 w-8">
//                               <AvatarFallback>
//                                 {getUserInitials(message.sender?.username || 'U')}
//                               </AvatarFallback>
//                             </Avatar>
//                           )}
                          
//                           <div>
//                             {!isOwnMessage && (
//                               <p className="text-xs text-gray-500 mb-1">
//                                 {message.sender?.username}
//                               </p>
//                             )}
                            
//                             <div
//                               className={`rounded-lg px-3 py-2 ${
//                                 isOwnMessage 
//                                   ? 'bg-blue-600 text-white' 
//                                   : 'bg-gray-100 text-gray-900'
//                               }`}
//                             >
//                               {isEditing ? (
//                                 <div className="space-y-2">
//                                   <Textarea
//                                     value={editingContent}
//                                     onChange={(e) => setEditingContent(e.target.value)}
//                                     className="min-h-[60px] bg-white text-black"
//                                     autoFocus
//                                   />
//                                   <div className="flex space-x-2">
//                                     <Button
//                                       size="sm"
//                                       onClick={() => handleEditMessage(message.id, editingContent)}
//                                     >
//                                       <Check className="h-3 w-3" />
//                                     </Button>
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       onClick={() => {
//                                         setEditingMessageId(null);
//                                         setEditingContent('');
//                                       }}
//                                     >
//                                       <X className="h-3 w-3" />
//                                     </Button>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <>
//                                   {message.parent_message_id && message.parentMessage && (
//                                     <div className={`border-l-2 pl-2 mb-2 text-xs ${
//                                       isOwnMessage ? 'border-blue-400' : 'border-gray-300'
//                                     }`}>
//                                       <p className="font-medium">
//                                         {message.parentMessage.sender?.username}
//                                       </p>
//                                       <p className="opacity-75 truncate">
//                                         {message.parentMessage.content || '[Attachment]'}
//                                       </p>
//                                     </div>
//                                   )}
                                  
//                                   <p className="whitespace-pre-wrap break-words">
//                                     {message.is_deleted ? '[Message deleted]' : (message.content || '[Attachment]')}
//                                   </p>
                                  
//                                   {message.is_edited && !message.is_deleted && (
//                                     <p className={`text-xs mt-1 ${
//                                       isOwnMessage ? 'text-blue-200' : 'text-gray-500'
//                                     }`}>
//                                       (edited)
//                                     </p>
//                                   )}
//                                 </>
//                               )}
//                             </div>
                            
//                             {/* Message Reactions */}
//                             {message.MessageReactions && message.MessageReactions.length > 0 && (
//                               <div className="flex flex-wrap gap-1 mt-1">
//                                 {Object.entries(
//                                   message.MessageReactions.reduce((acc, r) => {
//                                     acc[r.reaction] = (acc[r.reaction] || 0) + 1;
//                                     return acc;
//                                   }, {} as Record<string, number>)
//                                 ).map(([reaction, count]) => (
//                                   <button
//                                     key={reaction}
//                                     onClick={() => handleReaction(message.id, reaction)}
//                                     className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${
//                                       message.MessageReactions?.some(
//                                         r => r.user_id === user?.id && r.reaction === reaction
//                                       )
//                                         ? 'bg-blue-100 text-blue-600'
//                                         : 'bg-gray-100 text-gray-600'
//                                     }`}
//                                   >
//                                     <span>{reaction}</span>
//                                     {count > 1 && <span>{count}</span>}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
                            
//                             <div className="flex items-center mt-1 space-x-2">
//                               <span className="text-xs text-gray-500">
//                                 {formatMessageTime(message.created_at)}
//                               </span>
                              
//                               {isOwnMessage && message.MessageReadStatuses?.some(rs => rs.is_read) && (
//                                 <CheckCheck className="h-3 w-3 text-blue-500" />
//                               )}
                              
//                               {!message.is_deleted && (
//                                 <div className="flex items-center space-x-1">
//                                   {/* Reaction Button */}
//                                   <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                       <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
//                                         <Smile className="h-3 w-3" />
//                                       </Button>
//                                     </DropdownMenuTrigger>
//                                     <DropdownMenuContent className="grid grid-cols-6 gap-1 p-2">
//                                       {AVAILABLE_REACTIONS.map(reaction => (
//                                         <button
//                                           key={reaction}
//                                           onClick={() => handleReaction(message.id, reaction)}
//                                           className="p-1 hover:bg-gray-100 rounded"
//                                         >
//                                           {reaction}
//                                         </button>
//                                       ))}
//                                     </DropdownMenuContent>
//                                   </DropdownMenu>
                                  
//                                   {/* Reply Button */}
//                                   {!isOwnMessage && (
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       className="h-6 px-2"
//                                       onClick={() => setReplyingTo(message)}
//                                     >
//                                       <Reply className="h-3 w-3" />
//                                     </Button>
//                                   )}
                                  
//                                   {/* Edit/Delete for own messages */}
//                                   {isOwnMessage && !isEditing && (
//                                     <DropdownMenu>
//                                       <DropdownMenuTrigger asChild>
//                                         <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
//                                           <MoreVertical className="h-3 w-3" />
//                                         </Button>
//                                       </DropdownMenuTrigger>
//                                       <DropdownMenuContent>
//                                         <DropdownMenuItem
//                                           onClick={() => {
//                                             setEditingMessageId(message.id);
//                                             setEditingContent(message.content || '');
//                                           }}
//                                         >
//                                           <Edit2 className="h-4 w-4 mr-2" />
//                                           Edit
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem
//                                           onClick={() => handleDeleteMessage(message.id)}
//                                           className="text-red-600"
//                                         >
//                                           <Trash2 className="h-4 w-4 mr-2" />
//                                           Delete
//                                         </DropdownMenuItem>
//                                       </DropdownMenuContent>
//                                     </DropdownMenu>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div ref={messagesEndRef} />
//               </div>
//             )}
//           </ScrollArea>

//           {/* Message Input */}
//           <div className="p-4 border-t">
//             {replyingTo && (
//               <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
//                 <div className="flex-1">
//                   <p className="text-xs text-gray-500">Replying to {replyingTo.sender?.username}</p>
//                   <p className="text-sm truncate">{replyingTo.content || '[Attachment]'}</p>
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={() => setReplyingTo(null)}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             )}
            
//             {attachedFiles.length > 0 && (
//               <div className="mb-2 p-2 bg-gray-50 rounded-lg">
//                 <p className="text-xs text-gray-500 mb-1">Attached files:</p>
//                 {attachedFiles.map((file, index) => (
//                   <div key={index} className="flex items-center justify-between">
//                     <p className="text-sm">{file.name}</p>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
            
//             <div className="flex items-center space-x-2">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileSelect}
//                 multiple
//                 className="hidden"
//               />
              
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <Paperclip className="h-4 w-4" />
//               </Button>
              
//               <Textarea
//                 placeholder="Type a message..."
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSendMessage();
//                   }
//                 }}
//                 className="flex-1 min-h-[40px] max-h-[120px] resize-none"
//               />
              
//               <Button
//                 onClick={handleSendMessage}
//                 disabled={!messageInput.trim() && attachedFiles.length === 0}
//               >
//                 <Send className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No conversation selected
//             </h3>
//             <p className="text-gray-500 mb-4">
//               Choose a conversation from the list or start a new one
//             </p>
//             <Button
//               onClick={() => {
//                 setShowCreateDialog(true);
//                 setUserSearchQuery('');
//                 loadAvailableUsers();
//               }}
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Start New Conversation
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Create Conversation Dialog */}
//       <Dialog open={showCreateDialog} onOpenChange={(open) => {
//         setShowCreateDialog(open);
//         if (!open) {
//           // Reset form when dialog closes
//           setSelectedUsers([]);
//           setGroupName('');
//           setGroupDescription('');
//           setCreateType('direct');
//           setUserSearchQuery('');
//         }
//       }}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Create New Conversation</DialogTitle>
//             <DialogDescription>
//               Start a direct message or create a group chat
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             {/* Type Selection */}
//             <div className="flex space-x-2">
//               <Button
//                 variant={createType === 'direct' ? 'default' : 'outline'}
//                 onClick={() => {
//                   setCreateType('direct');
//                   setSelectedUsers([]);
//                 }}
//                 className="flex-1"
//               >
//                 Direct Message
//               </Button>
//               <Button
//                 variant={createType === 'group' ? 'default' : 'outline'}
//                 onClick={() => {
//                   setCreateType('group');
//                   setSelectedUsers([]);
//                 }}
//                 className="flex-1"
//               >
//                 Group Chat
//               </Button>
//             </div>
            
//             {/* Group Name (for group chats) */}
//             {createType === 'group' && (
//               <>
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">
//                     Group Name
//                   </label>
//                   <Input
//                     placeholder="Enter group name"
//                     value={groupName}
//                     onChange={(e) => setGroupName(e.target.value)}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">
//                     Description (optional)
//                   </label>
//                   <Textarea
//                     placeholder="Enter group description"
//                     value={groupDescription}
//                     onChange={(e) => setGroupDescription(e.target.value)}
//                   />
//                 </div>
//               </>
//             )}
            
//             {/* User Selection */}
//             <div>
//               <label className="text-sm font-medium mb-1 block">
//                 Select {createType === 'direct' ? 'User' : 'Members'}
//               </label>
              
//               {/* User Search Input */}
//               <div className="mb-2">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                   <Input
//                     placeholder="Search users by name, email, department, or role..."
//                     value={userSearchQuery}
//                     onChange={(e) => setUserSearchQuery(e.target.value)}
//                     className="pl-9"
//                   />
//                 </div>
//               </div>
              
//               <ScrollArea className="h-[200px] border rounded-lg p-2">
//                 {loadingUsers ? (
//                   <div className="text-center text-gray-500 py-4">
//                     <div className="flex flex-col items-center space-y-2">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                       <p>Loading users...</p>
//                     </div>
//                   </div>
//                 ) : availableUsers.length === 0 ? (
//                   <div className="text-center text-gray-500 py-4">
//                     {userSearchQuery ? 'No users found matching your search' : 'No users available'}
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     {availableUsers.map((availableUser) => (
//                       <div
//                         key={availableUser.id}
//                         className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
//                           selectedUsers.includes(availableUser.id) ? 'bg-blue-50' : ''
//                         }`}
//                         onClick={() => {
//                           if (createType === 'direct') {
//                             setSelectedUsers([availableUser.id]);
//                           } else {
//                             setSelectedUsers(prev =>
//                               prev.includes(availableUser.id)
//                                 ? prev.filter(id => id !== availableUser.id)
//                                 : [...prev, availableUser.id]
//                             );
//                           }
//                         }}
//                       >
//                         <Avatar className="h-8 w-8">
//                           <AvatarFallback>
//                             {getUserInitials(availableUser.username || availableUser.email)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1">
//                           <p className="font-medium">{availableUser.username}</p>
//                           <p className="text-sm text-gray-500">{availableUser.email}</p>
//                           <div className="flex items-center space-x-2 text-xs text-gray-400">
//                             <span>{availableUser.department}</span>
//                             <span>•</span>
//                             <span>{availableUser.role}</span>
//                             {availableUser.branch && (
//                               <>
//                                 <span>•</span>
//                                 <span>{availableUser.branch.branch_name}</span>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                         {selectedUsers.includes(availableUser.id) && (
//                           <Check className="h-4 w-4 text-blue-600" />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </ScrollArea>
              
//               {!loadingUsers && availableUsers.length > 0 && (
//                 <p className="text-xs text-gray-500 mt-2">
//                   Showing {availableUsers.length} user{availableUsers.length !== 1 ? 's' : ''}
//                   {userSearchQuery && ` matching "${userSearchQuery}"`}
//                 </p>
//               )}
//             </div>
            
//             {selectedUsers.length > 0 && (
//               <div className="text-sm text-gray-500">
//                 {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
//               </div>
//             )}
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => {
//               setShowCreateDialog(false);
//               setSelectedUsers([]);
//               setGroupName('');
//               setGroupDescription('');
//               setCreateType('direct');
//               setUserSearchQuery('');
//             }}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleCreateConversation}
//               disabled={
//                 selectedUsers.length === 0 ||
//                 (createType === 'group' && !groupName.trim())
//               }
//             >
//               Create
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };





// src/components/chat/Chat.tsx

// import React, { useState, useEffect, useRef } from 'react';
// import { useChat } from '@/contexts/ChatContext';
// import { useAuth } from '@/hooks/useAuth';
// import { 
//   Send, 
//   Plus, 
//   Search, 
//   MoreVertical, 
//   Paperclip, 
//   Smile, 
//   Edit2, 
//   Trash2, 
//   Reply,
//   Forward,
//   Users,
//   X,
//   Check,
//   CheckCheck,
//   MessageCircle
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { toast } from 'sonner';
// import { format, isToday, isYesterday } from 'date-fns';
// import { Message, Conversation, AVAILABLE_REACTIONS } from '@/types/chat';
// import { User } from '@/types/user';

// export const Chat = () => {
//   const { user } = useAuth();
//   const {
//     conversations,
//     activeConversation,
//     messages,
//     unreadCount,
//     loading,
//     messagesLoading,
//     loadConversations,
//     createConversation,
//     selectConversation,
//     sendMessage,
//     editMessage,
//     deleteMessage,
//     addReaction,
//     removeReaction,
//     loadMoreMessages,
//     searchMessages,
//     clearActiveConversation,
//     refreshConversations
//   } = useChat();

//   const [messageInput, setMessageInput] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showCreateDialog, setShowCreateDialog] = useState(false);
//   const [createType, setCreateType] = useState<'direct' | 'group'>('direct');
//   const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
//   const [groupName, setGroupName] = useState('');
//   const [groupDescription, setGroupDescription] = useState('');
//   const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
//   const [editingContent, setEditingContent] = useState('');
//   const [replyingTo, setReplyingTo] = useState<Message | null>(null);
//   const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
//   const [availableUsers, setAvailableUsers] = useState<any[]>([]);
//   const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
//   const [userSearchQuery, setUserSearchQuery] = useState('');
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [userPage, setUserPage] = useState(1);
//   const [totalUserPages, setTotalUserPages] = useState(1);
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);

//   // Scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (messages.length > 0) {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   // Load available users for creating conversations
//   const loadAvailableUsers = async (page: number = 1, searchTerm: string = '') => {
//     try {
//       setLoadingUsers(true);
//       let allUsers: any[] = [];
//       let currentPage = 1;
//       let totalPages = 1;
      
//       // Load all pages to get all users (or you can implement lazy loading)
//       do {
//         const response = await fetch(
//           `https://aps2.zemenbank.com/ZAMS/api/auth?page=${currentPage}&limit=100`,
//           {
//             headers: {
//               'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
//             }
//           }
//         );
        
//         if (response.ok) {
//           const result = await response.json();
//           allUsers = [...allUsers, ...result.data];
//           totalPages = result.totalPages;
//           currentPage++;
//         } else {
//           break;
//         }
//       } while (currentPage <= totalPages);
      
//       // Filter out current user and apply search
//       let filteredUsers = allUsers.filter((u: any) => u.id !== user?.id);
      
//       // Apply search filter if search term exists
//       if (searchTerm) {
//         filteredUsers = filteredUsers.filter((u: any) => 
//           u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           u.role?.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
      
//       setAvailableUsers(filteredUsers);
//       setTotalUserPages(totalPages);
//     } catch (error) {
//       console.error('Failed to load users:', error);
//       toast.error('Failed to load users');
//       setAvailableUsers([]);
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   // Debounced user search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (showCreateDialog) {
//         loadAvailableUsers(1, userSearchQuery);
//       }
//     }, 300);
    
//     return () => clearTimeout(timer);
//   }, [userSearchQuery, showCreateDialog]);

//   // Get conversation display name
//   const getConversationDisplayName = (conv: Conversation): string => {
//     if (conv.name) return conv.name;
    
//     // For direct chats, find the other participant
//     if (conv.type === 'direct' && conv.participants) {
//       const otherParticipant = conv.participants.find(p => p.user_id !== user?.id);
//       return otherParticipant?.User?.username || 'Unknown User';
//     }
    
//     return 'Unknown Conversation';
//   };

//   // Get conversation participants for display
//   const getOtherParticipant = (conv: Conversation): User | undefined => {
//     if (conv.type === 'direct' && conv.participants) {
//       const participant = conv.participants.find(p => p.user_id !== user?.id);
//       return participant?.User;
//     }
//     return undefined;
//   };

//   // Handle send message
//   const handleSendMessage = async () => {
//     if (!messageInput.trim() && attachedFiles.length === 0) return;
//     if (!activeConversation) return;

//     try {
//       await sendMessage(
//         messageInput.trim(),
//         attachedFiles,
//         replyingTo?.id
//       );
//       setMessageInput('');
//       setReplyingTo(null);
//       setAttachedFiles([]);
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   };

//   // Handle create conversation
//   const handleCreateConversation = async () => {
//     if (createType === 'direct' && selectedUsers.length !== 1) {
//       toast.error('Please select exactly one user for direct chat');
//       return;
//     }
    
//     if (createType === 'group' && selectedUsers.length < 1) {
//       toast.error('Please select at least one user for group chat');
//       return;
//     }
    
//     if (createType === 'group' && !groupName.trim()) {
//       toast.error('Please enter a group name');
//       return;
//     }

//     try {
//       const conversation = await createConversation({
//         type: createType,
//         participant_ids: selectedUsers,
//         name: createType === 'group' ? groupName : undefined,
//         description: createType === 'group' ? groupDescription : undefined
//       });
      
//       setShowCreateDialog(false);
//       setSelectedUsers([]);
//       setGroupName('');
//       setGroupDescription('');
//       setCreateType('direct');
//       setUserSearchQuery('');
      
//       // Select the newly created conversation
//       await selectConversation(conversation.id);
//     } catch (error) {
//       console.error('Failed to create conversation:', error);
//     }
//   };

//   // Handle edit message
//   const handleEditMessage = async (messageId: string, content: string) => {
//     if (!content.trim()) return;
    
//     try {
//       await editMessage(messageId, content);
//       setEditingMessageId(null);
//       setEditingContent('');
//     } catch (error) {
//       console.error('Failed to edit message:', error);
//     }
//   };

//   // Handle delete message
//   const handleDeleteMessage = async (messageId: string) => {
//     if (confirm('Are you sure you want to delete this message?')) {
//       try {
//         await deleteMessage(messageId);
//       } catch (error) {
//         console.error('Failed to delete message:', error);
//       }
//     }
//   };

//   // Handle reaction
//   const handleReaction = async (messageId: string, reaction: string) => {
//     try {
//       // Check if user already has this reaction
//       const message = messages.find(m => m.id === messageId);
//       const existingReaction = message?.MessageReactions?.find(
//         r => r.user_id === user?.id && r.reaction === reaction
//       );
      
//       if (existingReaction) {
//         await removeReaction(messageId, reaction);
//       } else {
//         await addReaction(messageId, reaction);
//       }
      
//       setShowReactionPicker(null);
//     } catch (error) {
//       console.error('Failed to handle reaction:', error);
//     }
//   };

//   // Handle file selection
//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setAttachedFiles(prev => [...prev, ...files]);
//   };

//   // Format message time with proper error handling
//   const formatMessageTime = (date: string | null | undefined) => {
//     if (!date) return '';
    
//     try {
//       const messageDate = new Date(date);
      
//       // Check if date is valid
//       if (isNaN(messageDate.getTime())) {
//         console.warn('Invalid date:', date);
//         return '';
//       }
      
//       if (isToday(messageDate)) {
//         return format(messageDate, 'HH:mm');
//       } else if (isYesterday(messageDate)) {
//         return `Yesterday ${format(messageDate, 'HH:mm')}`;
//       } else {
//         return format(messageDate, 'dd/MM/yyyy HH:mm');
//       }
//     } catch (error) {
//       console.error('Error formatting date:', date, error);
//       return '';
//     }
//   };

//   // Get user initials
//   const getUserInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Filter conversations based on search
//   const filteredConversations = conversations.filter(conv => {
//     if (!searchQuery) return true;
    
//     const conversationName = getConversationDisplayName(conv);
//     return conversationName.toLowerCase().includes(searchQuery.toLowerCase());
//   });

//   return (
//     <div className="flex h-full bg-white rounded-lg shadow-sm">
//       {/* Conversations List */}
//       <div className="w-80 border-r flex flex-col">
//         {/* Header */}
//         <div className="p-4 border-b">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold">Messages</h2>
//             <Button
//               size="sm"
//               variant="ghost"
//               onClick={() => {
//                 loadAvailableUsers();
//                 setShowCreateDialog(true);
//               }}
//               className="h-8 w-8 p-0"
//             >
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>
          
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input
//               placeholder="Search conversations..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9"
//             />
//           </div>
//         </div>

//         {/* Conversations List */}
//         <ScrollArea className="flex-1">
//           {loading ? (
//             <div className="p-4 text-center text-gray-500">Loading...</div>
//           ) : filteredConversations.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">
//               {searchQuery ? 'No conversations found' : 'No conversations yet'}
//             </div>
//           ) : (
//             <div className="divide-y">
//               {filteredConversations.map((conv) => {
//                 const displayName = getConversationDisplayName(conv);
//                 const lastMessage = conv.Messages?.[0];
//                 const isActive = activeConversation?.id === conv.id;
                
//                 return (
//                   <div
//                     key={conv.id}
//                     onClick={() => selectConversation(conv.id)}
//                     className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
//                       isActive ? 'bg-blue-50' : ''
//                     }`}
//                   >
//                     <div className="flex items-start space-x-3">
//                       <Avatar className="h-10 w-10">
//                         <AvatarFallback>
//                           {getUserInitials(displayName)}
//                         </AvatarFallback>
//                       </Avatar>
                      
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between">
//                           <p className="font-medium truncate">{displayName}</p>
//                           {lastMessage && lastMessage.created_at && (
//                             <span className="text-xs text-gray-500">
//                               {formatMessageTime(lastMessage.created_at)}
//                             </span>
//                           )}
//                         </div>
                        
//                         {lastMessage && (
//                           <p className="text-sm text-gray-600 truncate">
//                             {lastMessage.sender_id === user?.id && 'You: '}
//                             {lastMessage.content || '[Attachment]'}
//                           </p>
//                         )}
                        
//                         {conv.unread_count && conv.unread_count > 0 && (
//                           <Badge variant="destructive" className="mt-1">
//                             {conv.unread_count}
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </ScrollArea>
//       </div>

//       {/* Chat Area */}
//       {activeConversation ? (
//         <div className="flex-1 flex flex-col">
//           {/* Chat Header */}
//           <div className="p-4 border-b flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <Avatar className="h-10 w-10">
//                 <AvatarFallback>
//                   {getUserInitials(getConversationDisplayName(activeConversation))}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="font-medium">
//                   {getConversationDisplayName(activeConversation)}
//                 </p>
//                 {activeConversation.type === 'group' && (
//                   <p className="text-sm text-gray-500">
//                     {activeConversation.participants?.length} members
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-2">
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={clearActiveConversation}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <ScrollArea className="flex-1 p-4" ref={messagesContainerRef}>
//             {messagesLoading ? (
//               <div className="text-center text-gray-500">Loading messages...</div>
//             ) : messages.length === 0 ? (
//               <div className="text-center text-gray-500">No messages yet. Start a conversation!</div>
//             ) : (
//               <div className="space-y-4">
//                 {messages.map((message) => {
//                   const isOwnMessage = message.sender_id === user?.id;
//                   const isEditing = editingMessageId === message.id;
                  
//                   return (
//                     <div
//                       key={message.id}
//                       className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
//                     >
//                       <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
//                         <div className="flex items-end space-x-2">
//                           {!isOwnMessage && (
//                             <Avatar className="h-8 w-8">
//                               <AvatarFallback>
//                                 {getUserInitials(message.sender?.username || 'U')}
//                               </AvatarFallback>
//                             </Avatar>
//                           )}
                          
//                           <div>
//                             {!isOwnMessage && (
//                               <p className="text-xs text-gray-500 mb-1">
//                                 {message.sender?.username}
//                               </p>
//                             )}
                            
//                             <div
//                               className={`rounded-lg px-3 py-2 ${
//                                 isOwnMessage 
//                                   ? 'bg-blue-600 text-white' 
//                                   : 'bg-gray-100 text-gray-900'
//                               }`}
//                             >
//                               {isEditing ? (
//                                 <div className="space-y-2">
//                                   <Textarea
//                                     value={editingContent}
//                                     onChange={(e) => setEditingContent(e.target.value)}
//                                     className="min-h-[60px] bg-white text-black"
//                                     autoFocus
//                                   />
//                                   <div className="flex space-x-2">
//                                     <Button
//                                       size="sm"
//                                       onClick={() => handleEditMessage(message.id, editingContent)}
//                                     >
//                                       <Check className="h-3 w-3" />
//                                     </Button>
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       onClick={() => {
//                                         setEditingMessageId(null);
//                                         setEditingContent('');
//                                       }}
//                                     >
//                                       <X className="h-3 w-3" />
//                                     </Button>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <>
//                                   {message.parent_message_id && message.parentMessage && (
//                                     <div className={`border-l-2 pl-2 mb-2 text-xs ${
//                                       isOwnMessage ? 'border-blue-400' : 'border-gray-300'
//                                     }`}>
//                                       <p className="font-medium">
//                                         {message.parentMessage.sender?.username}
//                                       </p>
//                                       <p className="opacity-75 truncate">
//                                         {message.parentMessage.content || '[Attachment]'}
//                                       </p>
//                                     </div>
//                                   )}
                                  
//                                   <p className="whitespace-pre-wrap break-words">
//                                     {message.is_deleted ? '[Message deleted]' : (message.content || '[Attachment]')}
//                                   </p>
                                  
//                                   {message.is_edited && !message.is_deleted && (
//                                     <p className={`text-xs mt-1 ${
//                                       isOwnMessage ? 'text-blue-200' : 'text-gray-500'
//                                     }`}>
//                                       (edited)
//                                     </p>
//                                   )}
//                                 </>
//                               )}
//                             </div>
                            
//                             {/* Message Reactions */}
//                             {message.MessageReactions && message.MessageReactions.length > 0 && (
//                               <div className="flex flex-wrap gap-1 mt-1">
//                                 {Object.entries(
//                                   message.MessageReactions.reduce((acc, r) => {
//                                     acc[r.reaction] = (acc[r.reaction] || 0) + 1;
//                                     return acc;
//                                   }, {} as Record<string, number>)
//                                 ).map(([reaction, count]) => (
//                                   <button
//                                     key={reaction}
//                                     onClick={() => handleReaction(message.id, reaction)}
//                                     className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${
//                                       message.MessageReactions?.some(
//                                         r => r.user_id === user?.id && r.reaction === reaction
//                                       )
//                                         ? 'bg-blue-100 text-blue-600'
//                                         : 'bg-gray-100 text-gray-600'
//                                     }`}
//                                   >
//                                     <span>{reaction}</span>
//                                     {count > 1 && <span>{count}</span>}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
                            
//                             <div className="flex items-center mt-1 space-x-2">
//                               <span className="text-xs text-gray-500">
//                                 {message.created_at ? formatMessageTime(message.created_at) : ''}
//                               </span>
                              
//                               {isOwnMessage && message.MessageReadStatuses?.some(rs => rs.is_read) && (
//                                 <CheckCheck className="h-3 w-3 text-blue-500" />
//                               )}
                              
//                               {!message.is_deleted && (
//                                 <div className="flex items-center space-x-1">
//                                   {/* Reaction Button */}
//                                   <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                       <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
//                                         <Smile className="h-3 w-3" />
//                                       </Button>
//                                     </DropdownMenuTrigger>
//                                     <DropdownMenuContent className="grid grid-cols-6 gap-1 p-2">
//                                       {AVAILABLE_REACTIONS.map(reaction => (
//                                         <button
//                                           key={reaction}
//                                           onClick={() => handleReaction(message.id, reaction)}
//                                           className="p-1 hover:bg-gray-100 rounded"
//                                         >
//                                           {reaction}
//                                         </button>
//                                       ))}
//                                     </DropdownMenuContent>
//                                   </DropdownMenu>
                                  
//                                   {/* Reply Button */}
//                                   {!isOwnMessage && (
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       className="h-6 px-2"
//                                       onClick={() => setReplyingTo(message)}
//                                     >
//                                       <Reply className="h-3 w-3" />
//                                     </Button>
//                                   )}
                                  
//                                   {/* Edit/Delete for own messages */}
//                                   {isOwnMessage && !isEditing && (
//                                     <DropdownMenu>
//                                       <DropdownMenuTrigger asChild>
//                                         <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
//                                           <MoreVertical className="h-3 w-3" />
//                                         </Button>
//                                       </DropdownMenuTrigger>
//                                       <DropdownMenuContent>
//                                         <DropdownMenuItem
//                                           onClick={() => {
//                                             setEditingMessageId(message.id);
//                                             setEditingContent(message.content || '');
//                                           }}
//                                         >
//                                           <Edit2 className="h-4 w-4 mr-2" />
//                                           Edit
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem
//                                           onClick={() => handleDeleteMessage(message.id)}
//                                           className="text-red-600"
//                                         >
//                                           <Trash2 className="h-4 w-4 mr-2" />
//                                           Delete
//                                         </DropdownMenuItem>
//                                       </DropdownMenuContent>
//                                     </DropdownMenu>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div ref={messagesEndRef} />
//               </div>
//             )}
//           </ScrollArea>

//           {/* Message Input */}
//           <div className="p-4 border-t">
//             {replyingTo && (
//               <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
//                 <div className="flex-1">
//                   <p className="text-xs text-gray-500">Replying to {replyingTo.sender?.username}</p>
//                   <p className="text-sm truncate">{replyingTo.content || '[Attachment]'}</p>
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={() => setReplyingTo(null)}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             )}
            
//             {attachedFiles.length > 0 && (
//               <div className="mb-2 p-2 bg-gray-50 rounded-lg">
//                 <p className="text-xs text-gray-500 mb-1">Attached files:</p>
//                 {attachedFiles.map((file, index) => (
//                   <div key={index} className="flex items-center justify-between">
//                     <p className="text-sm">{file.name}</p>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
            
//             <div className="flex items-center space-x-2">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileSelect}
//                 multiple
//                 className="hidden"
//               />
              
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <Paperclip className="h-4 w-4" />
//               </Button>
              
//               <Textarea
//                 placeholder="Type a message..."
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSendMessage();
//                   }
//                 }}
//                 className="flex-1 min-h-[40px] max-h-[120px] resize-none"
//               />
              
//               <Button
//                 onClick={handleSendMessage}
//                 disabled={!messageInput.trim() && attachedFiles.length === 0}
//               >
//                 <Send className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No conversation selected
//             </h3>
//             <p className="text-gray-500 mb-4">
//               Choose a conversation from the list or start a new one
//             </p>
//             <Button
//               onClick={() => {
//                 setShowCreateDialog(true);
//                 setUserSearchQuery('');
//                 loadAvailableUsers();
//               }}
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Start New Conversation
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Create Conversation Dialog */}
//       <Dialog open={showCreateDialog} onOpenChange={(open) => {
//         setShowCreateDialog(open);
//         if (!open) {
//           // Reset form when dialog closes
//           setSelectedUsers([]);
//           setGroupName('');
//           setGroupDescription('');
//           setCreateType('direct');
//           setUserSearchQuery('');
//         }
//       }}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Create New Conversation</DialogTitle>
//             <DialogDescription>
//               Start a direct message or create a group chat
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             {/* Type Selection */}
//             <div className="flex space-x-2">
//               <Button
//                 variant={createType === 'direct' ? 'default' : 'outline'}
//                 onClick={() => {
//                   setCreateType('direct');
//                   setSelectedUsers([]);
//                 }}
//                 className="flex-1"
//               >
//                 Direct Message
//               </Button>
//               <Button
//                 variant={createType === 'group' ? 'default' : 'outline'}
//                 onClick={() => {
//                   setCreateType('group');
//                   setSelectedUsers([]);
//                 }}
//                 className="flex-1"
//               >
//                 Group Chat
//               </Button>
//             </div>
            
//             {/* Group Name (for group chats) */}
//             {createType === 'group' && (
//               <>
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">
//                     Group Name
//                   </label>
//                   <Input
//                     placeholder="Enter group name"
//                     value={groupName}
//                     onChange={(e) => setGroupName(e.target.value)}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">
//                     Description (optional)
//                   </label>
//                   <Textarea
//                     placeholder="Enter group description"
//                     value={groupDescription}
//                     onChange={(e) => setGroupDescription(e.target.value)}
//                   />
//                 </div>
//               </>
//             )}
            
//             {/* User Selection */}
//             <div>
//               <label className="text-sm font-medium mb-1 block">
//                 Select {createType === 'direct' ? 'User' : 'Members'}
//               </label>
              
//               {/* User Search Input */}
//               <div className="mb-2">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                   <Input
//                     placeholder="Search users by name, email, department, or role..."
//                     value={userSearchQuery}
//                     onChange={(e) => setUserSearchQuery(e.target.value)}
//                     className="pl-9"
//                   />
//                 </div>
//               </div>
              
//               <ScrollArea className="h-[200px] border rounded-lg p-2">
//                 {loadingUsers ? (
//                   <div className="text-center text-gray-500 py-4">
//                     <div className="flex flex-col items-center space-y-2">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                       <p>Loading users...</p>
//                     </div>
//                   </div>
//                 ) : availableUsers.length === 0 ? (
//                   <div className="text-center text-gray-500 py-4">
//                     {userSearchQuery ? 'No users found matching your search' : 'No users available'}
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     {availableUsers.map((availableUser) => (
//                       <div
//                         key={availableUser.id}
//                         className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
//                           selectedUsers.includes(availableUser.id) ? 'bg-blue-50' : ''
//                         }`}
//                         onClick={() => {
//                           if (createType === 'direct') {
//                             setSelectedUsers([availableUser.id]);
//                           } else {
//                             setSelectedUsers(prev =>
//                               prev.includes(availableUser.id)
//                                 ? prev.filter(id => id !== availableUser.id)
//                                 : [...prev, availableUser.id]
//                             );
//                           }
//                         }}
//                       >
//                         <Avatar className="h-8 w-8">
//                           <AvatarFallback>
//                             {getUserInitials(availableUser.username || availableUser.email)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1">
//                           <p className="font-medium">{availableUser.username}</p>
//                           <p className="text-sm text-gray-500">{availableUser.email}</p>
//                           <div className="flex items-center space-x-2 text-xs text-gray-400">
//                             <span>{availableUser.department}</span>
//                             <span>•</span>
//                             <span>{availableUser.role}</span>
//                             {availableUser.branch && (
//                               <>
//                                 <span>•</span>
//                                 <span>{availableUser.branch.branch_name}</span>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                         {selectedUsers.includes(availableUser.id) && (
//                           <Check className="h-4 w-4 text-blue-600" />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </ScrollArea>
              
//               {!loadingUsers && availableUsers.length > 0 && (
//                 <p className="text-xs text-gray-500 mt-2">
//                   Showing {availableUsers.length} user{availableUsers.length !== 1 ? 's' : ''}
//                   {userSearchQuery && ` matching "${userSearchQuery}"`}
//                 </p>
//               )}
//             </div>
            
//             {selectedUsers.length > 0 && (
//               <div className="text-sm text-gray-500">
//                 {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
//               </div>
//             )}
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => {
//               setShowCreateDialog(false);
//               setSelectedUsers([]);
//               setGroupName('');
//               setGroupDescription('');
//               setCreateType('direct');
//               setUserSearchQuery('');
//             }}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleCreateConversation}
//               disabled={
//                 selectedUsers.length === 0 ||
//                 (createType === 'group' && !groupName.trim())
//               }
//             >
//               Create
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

























































// src/components/chat/Chat.tsx

// import React, { useState, useEffect, useRef } from 'react';
// import { useChat } from '@/contexts/ChatContext';
// import { useAuth } from '@/hooks/useAuth';
// import { 
//   Send, 
//   Plus, 
//   Search, 
//   MoreVertical, 
//   Paperclip, 
//   Smile, 
//   Edit2, 
//   Trash2, 
//   Reply,
//   Forward,
//   Users,
//   X,
//   Check,
//   CheckCheck,
//   MessageCircle,
//   AlertTriangle,
//   Download,
//   FileText,
//   Image as ImageIcon
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { toast } from 'sonner';
// import { format, isToday, isYesterday } from 'date-fns';

// // Import types from chat.ts
// import type { Message, Conversation, User, MessageAttachment } from '@/types/chat';
// import { AVAILABLE_REACTIONS } from '@/types/chat';

// export const Chat = () => {
//   const { user } = useAuth();
//   const {
//     conversations,
//     activeConversation,
//     messages,
//     unreadCount,
//     loading,
//     messagesLoading,
//     loadConversations,
//     createConversation,
//     selectConversation,
//     sendMessage,
//     editMessage,
//     deleteMessage,
//     addReaction,
//     removeReaction,
//     loadMoreMessages,
//     searchMessages,
//     clearActiveConversation,
//     refreshConversations
//   } = useChat();

//   const [messageInput, setMessageInput] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showCreateDialog, setShowCreateDialog] = useState(false);
//   const [createType, setCreateType] = useState<'direct' | 'group'>('direct');
//   const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
//   const [groupName, setGroupName] = useState('');
//   const [groupDescription, setGroupDescription] = useState('');
//   const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
//   const [editingContent, setEditingContent] = useState('');
//   const [replyingTo, setReplyingTo] = useState<Message | null>(null);
//   const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
//   const [availableUsers, setAvailableUsers] = useState<any[]>([]);
//   const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
//   const [userSearchQuery, setUserSearchQuery] = useState('');
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [userPage, setUserPage] = useState(1);
//   const [totalUserPages, setTotalUserPages] = useState(1);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
//   const [showForwardDialog, setShowForwardDialog] = useState(false);
//   const [messageToForward, setMessageToForward] = useState<Message | null>(null);
//   const [selectedConversationsForForward, setSelectedConversationsForForward] = useState<string[]>([]);
//   const [forwardAdditionalContent, setForwardAdditionalContent] = useState('');
//   const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
//   const [showAddMembersDialog, setShowAddMembersDialog] = useState(false);
//   const [selectedMembersToAdd, setSelectedMembersToAdd] = useState<string[]>([]);
//   const [showMembersDialog, setShowMembersDialog] = useState(false);
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);

//   // Scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (messages.length > 0) {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   // Load available users for creating conversations
//   const loadAvailableUsers = async (page: number = 1, searchTerm: string = '') => {
//     try {
//       setLoadingUsers(true);
//       let allUsers: any[] = [];
//       let currentPage = 1;
//       let totalPages = 1;
      
//       // Load all pages to get all users (or you can implement lazy loading)
//       do {
//         const response = await fetch(
//           `https://aps2.zemenbank.com/ZAMS/api/auth?page=${currentPage}&limit=100`,
//           {
//             headers: {
//               'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
//             }
//           }
//         );
        
//         if (response.ok) {
//           const result = await response.json();
//           allUsers = [...allUsers, ...result.data];
//           totalPages = result.totalPages;
//           currentPage++;
//         } else {
//           break;
//         }
//       } while (currentPage <= totalPages);
      
//       // Filter out current user and apply search
//       let filteredUsers = allUsers.filter((u: any) => u.id !== user?.id);
      
//       // Apply search filter if search term exists
//       if (searchTerm) {
//         filteredUsers = filteredUsers.filter((u: any) => 
//           u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           u.role?.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
      
//       setAvailableUsers(filteredUsers);
//       setTotalUserPages(totalPages);
//     } catch (error) {
//       console.error('Failed to load users:', error);
//       toast.error('Failed to load users');
//       setAvailableUsers([]);
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   // Debounced user search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (showCreateDialog || showAddMembersDialog) {
//         loadAvailableUsers(1, userSearchQuery);
//       }
//     }, 300);
    
//     return () => clearTimeout(timer);
//   }, [userSearchQuery, showCreateDialog, showAddMembersDialog]);

//   // Handle file selection
//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files) {
//       setAttachedFiles(prev => [...prev, ...Array.from(files)]);
//     }
//   };

//   // Forward message function
//   const forwardMessage = async (messageId: string, conversationIds: string[], additionalContent: string = '') => {
//     try {
//       const response = await fetch(`https://aps2.zemenbank.com/ZAMS/api/chat/messages/${messageId}/forward`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
//         },
//         body: JSON.stringify({
//           conversation_ids: conversationIds,
//           additional_content: additionalContent
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to forward message');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error forwarding message:', error);
//       throw error;
//     }
//   };

//   // Handle add members to group
//   const handleAddMembers = async () => {
//     if (!activeConversation || selectedMembersToAdd.length === 0) return;

//     try {
//       const response = await fetch(`https://aps2.zemenbank.com/ZAMS/api/chat/conversations/${activeConversation.id}/members`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
//         },
//         body: JSON.stringify({
//           user_ids: selectedMembersToAdd
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add members');
//       }

//       setShowAddMembersDialog(false);
//       setSelectedMembersToAdd([]);
//       toast.success(`${selectedMembersToAdd.length} member(s) added successfully`);
      
//       // Refresh the conversation to get updated participants
//       if (activeConversation) {
//         await selectConversation(activeConversation.id);
//       }
//     } catch (error) {
//       console.error('Failed to add members:', error);
//       toast.error('Failed to add members');
//     }
//   };

//   // Get conversation display name - fixed for actual API structure
//   const getConversationDisplayName = (conv: Conversation): string => {
//     if (conv.name) return conv.name;
    
//     // For direct chats, find the other participant from participants array
//     if (conv.type === 'direct' && conv.participants) {
//       const otherParticipant = conv.participants.find(p => p.id !== user?.id);
//       if (otherParticipant?.username) {
//         return otherParticipant.username;
//       }
//     }
    
//     return 'Unknown User';
//   };

//   // Get conversation participants for display
//   const getOtherParticipant = (conv: Conversation): User | undefined => {
//     if (conv.type === 'direct' && conv.participants) {
//       return conv.participants.find(p => p.id !== user?.id);
//     }
//     return undefined;
//   };

//   // Check if current user is admin of the conversation
//   const isUserAdmin = (conv: Conversation): boolean => {
//     if (!conv.participants || !user) return false;
//     const currentUserParticipant = conv.participants.find(p => p.id === user.id);
//     return currentUserParticipant?.ConversationParticipant?.role === 'admin' || conv.created_by === user.id;
//   };

//   // Handle send message
//   const handleSendMessage = async () => {
//     if (!messageInput.trim() && attachedFiles.length === 0) return;
//     if (!activeConversation) return;

//     try {
//       await sendMessage(
//         messageInput.trim(),
//         attachedFiles,
//         replyingTo?.id
//       );
//       setMessageInput('');
//       setReplyingTo(null);
//       setAttachedFiles([]);
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   };

//   // Handle create conversation
//   const handleCreateConversation = async () => {
//     if (createType === 'direct' && selectedUsers.length !== 1) {
//       toast.error('Please select exactly one user for direct chat');
//       return;
//     }
    
//     if (createType === 'group' && selectedUsers.length < 1) {
//       toast.error('Please select at least one user for group chat');
//       return;
//     }
    
//     if (createType === 'group' && !groupName.trim()) {
//       toast.error('Please enter a group name');
//       return;
//     }

//     try {
//       const conversation = await createConversation({
//         type: createType,
//         participant_ids: selectedUsers,
//         name: createType === 'group' ? groupName : undefined,
//         description: createType === 'group' ? groupDescription : undefined
//       });
      
//       setShowCreateDialog(false);
//       setSelectedUsers([]);
//       setGroupName('');
//       setGroupDescription('');
//       setCreateType('direct');
//       setUserSearchQuery('');
      
//       // Select the newly created conversation
//       await selectConversation(conversation.id);
//     } catch (error) {
//       console.error('Failed to create conversation:', error);
//     }
//   };

//   // Handle edit message
//   const handleEditMessage = async (messageId: string, content: string) => {
//     if (!content.trim()) return;
    
//     try {
//       await editMessage(messageId, content);
//       setEditingMessageId(null);
//       setEditingContent('');
//     } catch (error) {
//       console.error('Failed to edit message:', error);
//     }
//   };

//   // Handle delete message with better UI
//   const handleDeleteMessage = async (messageId: string) => {
//     setMessageToDelete(messageId);
//     setShowDeleteDialog(true);
//   };

//   const confirmDeleteMessage = async () => {
//     if (!messageToDelete) return;
    
//     try {
//       await deleteMessage(messageToDelete);
//       setShowDeleteDialog(false);
//       setMessageToDelete(null);
//       toast.success('Message deleted successfully');
//     } catch (error) {
//       console.error('Failed to delete message:', error);
//       toast.error('Failed to delete message');
//     }
//   };

//   // Handle forward message
//   const handleForwardMessage = (message: Message) => {
//     setMessageToForward(message);
//     setSelectedConversationsForForward([]);
//     setForwardAdditionalContent('');
//     setShowForwardDialog(true);
//   };

//   const confirmForwardMessage = async () => {
//     if (!messageToForward || selectedConversationsForForward.length === 0) return;
    
//     try {
//       await forwardMessage(
//         messageToForward.id,
//         selectedConversationsForForward,
//         forwardAdditionalContent
//       );
//       setShowForwardDialog(false);
//       setMessageToForward(null);
//       setSelectedConversationsForForward([]);
//       setForwardAdditionalContent('');
//       toast.success(`Message forwarded to ${selectedConversationsForForward.length} conversation(s)`);
//     } catch (error) {
//       console.error('Failed to forward message:', error);
//       toast.error('Failed to forward message');
//     }
//   };

//   // Handle reaction
//   const handleReaction = async (messageId: string, reaction: string) => {
//     try {
//       // Check if user already has this reaction
//       const message = messages.find(m => m.id === messageId);
//       const existingReaction = message?.MessageReactions?.find(
//         r => r.user_id === user?.id && r.reaction === reaction
//       );
      
//       if (existingReaction) {
//         await removeReaction(messageId, reaction);
//       } else {
//         await addReaction(messageId, reaction);
//       }
      
//       setShowReactionPicker(null);
//     } catch (error) {
//       console.error('Failed to handle reaction:', error);
//     }
//   };

//   // Get attachment URL
//   const getAttachmentUrl = (attachmentId: string) => {
//     const token = localStorage.getItem('auth_token');
//     return `https://aps2.zemenbank.com/ZAMS/api/chat/attachments/${attachmentId}/download?token=${token}`;
//   };

//   // Check if attachment is an image
//   const isImageAttachment = (attachment: any) => {
//     return attachment.mime_type?.startsWith('image/') || 
//            attachment.file_type?.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
//   };

//   // Format message time with proper error handling
//   const formatMessageTime = (date: string | null | undefined) => {
//     if (!date) return '';
    
//     try {
//       const messageDate = new Date(date);
      
//       // Check if date is valid
//       if (isNaN(messageDate.getTime())) {
//         console.warn('Invalid date:', date);
//         return '';
//       }
      
//       if (isToday(messageDate)) {
//         return format(messageDate, 'HH:mm');
//       } else if (isYesterday(messageDate)) {
//         return `Yesterday ${format(messageDate, 'HH:mm')}`;
//       } else {
//         return format(messageDate, 'dd/MM/yyyy HH:mm');
//       }
//     } catch (error) {
//       console.error('Error formatting date:', date, error);
//       return '';
//     }
//   };

//   // Get user initials
//   const getUserInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Filter conversations based on search
//   const filteredConversations = conversations.filter(conv => {
//     if (!searchQuery) return true;
    
//     const conversationName = getConversationDisplayName(conv);
//     return conversationName.toLowerCase().includes(searchQuery.toLowerCase());
//   });

//   return (
//     <div className="flex h-full bg-white rounded-lg shadow-sm">
//       {/* Conversations List */}
//       <div className="w-80 border-r flex flex-col">
//         {/* Header */}
//         <div className="p-4 border-b">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold">Messages</h2>
//             <Button
//               size="sm"
//               variant="ghost"
//               onClick={() => {
//                 loadAvailableUsers();
//                 setShowCreateDialog(true);
//               }}
//               className="h-8 w-8 p-0"
//             >
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>
          
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input
//               placeholder="Search conversations..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9"
//             />
//           </div>
//         </div>

//         {/* Conversations List */}
//         <ScrollArea className="flex-1">
//           {loading ? (
//             <div className="p-4 text-center text-gray-500">Loading...</div>
//           ) : filteredConversations.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">
//               {searchQuery ? 'No conversations found' : 'No conversations yet'}
//             </div>
//           ) : (
//             <div className="divide-y">
//               {filteredConversations.map((conv) => {
//                 const displayName = getConversationDisplayName(conv);
//                 const lastMessage = conv.Messages?.[0];
//                 const isActive = activeConversation?.id === conv.id;
                
//                 return (
//                   <div
//                     key={conv.id}
//                     onClick={() => selectConversation(conv.id)}
//                     className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
//                       isActive ? 'bg-blue-50' : ''
//                     }`}
//                   >
//                     <div className="flex items-start space-x-3">
//                       <Avatar className="h-10 w-10">
//                         <AvatarFallback>
//                           {getUserInitials(displayName)}
//                         </AvatarFallback>
//                       </Avatar>
                      
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between">
//                           <p className="font-medium truncate">{displayName}</p>
//                           {lastMessage && lastMessage.created_at && (
//                             <span className="text-xs text-gray-500">
//                               {formatMessageTime(lastMessage.created_at)}
//                             </span>
//                           )}
//                         </div>
                        
//                         {lastMessage && (
//                           <p className="text-sm text-gray-600 truncate">
//                             {lastMessage.sender_id === user?.id && 'You: '}
//                             {lastMessage.content || (
//                               lastMessage.MessageAttachments && lastMessage.MessageAttachments.length > 0 
//                                 ? `📎 ${lastMessage.MessageAttachments[0].file_name}` 
//                                 : (lastMessage.message_type === 'document' ? '📎 Document' : '[Attachment]')
//                             )}
//                           </p>
//                         )}
                        
//                         {conv.unread_count && conv.unread_count > 0 && (
//                           <Badge variant="destructive" className="mt-1">
//                             {conv.unread_count}
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </ScrollArea>
//       </div>

//       {/* Chat Area */}
//       {activeConversation ? (
//         <div className="flex-1 flex flex-col">
//           {/* Chat Header */}
//           <div className="p-4 border-b flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <Avatar className="h-10 w-10">
//                 <AvatarFallback>
//                   {getUserInitials(getConversationDisplayName(activeConversation))}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="font-medium">
//                   {getConversationDisplayName(activeConversation)}
//                 </p>
//                 {activeConversation.type === 'group' && (
//                   <p className="text-sm text-gray-500">
//                     {activeConversation.participants?.length} members
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-2">
//               {activeConversation.type === 'group' && (
//                 <>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => setShowMembersDialog(true)}
//                   >
//                     <Users className="h-4 w-4" />
//                   </Button>
//                   {isUserAdmin(activeConversation) && (
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => {
//                         loadAvailableUsers();
//                         setShowAddMembersDialog(true);
//                       }}
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </>
//               )}
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={clearActiveConversation}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <ScrollArea className="flex-1 p-4" ref={messagesContainerRef}>
//             {messagesLoading ? (
//               <div className="text-center text-gray-500">Loading messages...</div>
//             ) : messages.length === 0 ? (
//               <div className="text-center text-gray-500">No messages yet. Start a conversation!</div>
//             ) : (
//               <div className="space-y-4">
//                 {messages.map((message) => {
//                   const isOwnMessage = message.sender_id === user?.id;
//                   const isEditing = editingMessageId === message.id;
                  
//                   return (
//                     <div
//                       key={message.id}
//                       className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
//                     >
//                       <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
//                         <div className="flex items-end space-x-2">
//                           {!isOwnMessage && (
//                             <Avatar className="h-8 w-8">
//                               <AvatarFallback>
//                                 {getUserInitials(message.sender?.username || 'U')}
//                               </AvatarFallback>
//                             </Avatar>
//                           )}
                          
//                           <div>
//                             {!isOwnMessage && (
//                               <p className="text-xs text-gray-500 mb-1">
//                                 {message.sender?.username}
//                               </p>
//                             )}
                            
//                             <div
//                               className={`rounded-lg px-3 py-2 ${
//                                 isOwnMessage 
//                                   ? 'bg-blue-600 text-white' 
//                                   : 'bg-gray-100 text-gray-900'
//                               }`}
//                             >
//                               {isEditing ? (
//                                 <div className="space-y-2">
//                                   <Textarea
//                                     value={editingContent}
//                                     onChange={(e) => setEditingContent(e.target.value)}
//                                     className="min-h-[60px] bg-white text-black"
//                                     autoFocus
//                                   />
//                                   <div className="flex space-x-2">
//                                     <Button
//                                       size="sm"
//                                       onClick={() => handleEditMessage(message.id, editingContent)}
//                                     >
//                                       <Check className="h-3 w-3" />
//                                     </Button>
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       onClick={() => {
//                                         setEditingMessageId(null);
//                                         setEditingContent('');
//                                       }}
//                                     >
//                                       <X className="h-3 w-3" />
//                                     </Button>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <>
//                                   {message.parent_message_id && message.parentMessage && (
//                                     <div className={`border-l-2 pl-2 mb-2 text-xs ${
//                                       isOwnMessage ? 'border-blue-400' : 'border-gray-300'
//                                     }`}>
//                                       <p className="font-medium">
//                                         {message.parentMessage.sender?.username}
//                                       </p>
//                                       <p className="opacity-75 truncate">
//                                         {message.parentMessage.content || '[Attachment]'}
//                                       </p>
//                                     </div>
//                                   )}
                                  
//                                   <p className="whitespace-pre-wrap break-words">
//                                     {message.is_deleted ? '[Message deleted]' : (
//                                       message.content || (
//                                         message.MessageAttachments && message.MessageAttachments.length > 0 
//                                           ? `📎 ${message.MessageAttachments[0].file_name}` 
//                                           : '[Attachment]'
//                                       )
//                                     )}
//                                   </p>
                                  
//                                   {/* Display file attachments */}
//                                   {message.MessageAttachments && message.MessageAttachments.length > 0 && (
//                                     <div className="mt-2 space-y-1">
//                                       {message.MessageAttachments.map((attachment) => (
//                                         <div key={attachment.id} className="flex items-center space-x-2">
//                                           {attachment.mime_type?.startsWith('image/') ? (
//                                             <div 
//                                               className="cursor-pointer"
//                                               onClick={() => setShowImagePreview(getAttachmentUrl(attachment.id))}
//                                             >
//                                               <img 
//                                                 src={getAttachmentUrl(attachment.id)} 
//                                                 alt={attachment.file_name}
//                                                 className="max-w-xs max-h-48 rounded cursor-pointer hover:opacity-80"
//                                               />
//                                             </div>
//                                           ) : (
//                                             <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
//                                               <FileText className="h-4 w-4 text-gray-500" />
//                                               <span className="text-sm">{attachment.file_name}</span>
//                                               <Button
//                                                 size="sm"
//                                                 variant="ghost"
//                                                 onClick={() => window.open(getAttachmentUrl(attachment.id), '_blank')}
//                                                 className="h-6 px-2"
//                                               >
//                                                 <Download className="h-3 w-3" />
//                                               </Button>
//                                             </div>
//                                           )}
//                                         </div>
//                                       ))}
//                                     </div>
//                                   )}
                                  
//                                   {message.is_edited && !message.is_deleted && (
//                                     <p className={`text-xs mt-1 ${
//                                       isOwnMessage ? 'text-blue-200' : 'text-gray-500'
//                                     }`}>
//                                       (edited)
//                                     </p>
//                                   )}
//                                 </>
//                               )}
//                             </div>
                            
//                             {/* Message Reactions */}
//                             {message.MessageReactions && message.MessageReactions.length > 0 && (
//                               <div className="flex flex-wrap gap-1 mt-1">
//                                 {Object.entries(
//                                   message.MessageReactions.reduce((acc, r) => {
//                                     acc[r.reaction] = (acc[r.reaction] || 0) + 1;
//                                     return acc;
//                                   }, {} as Record<string, number>)
//                                 ).map(([reaction, count]) => (
//                                   <button
//                                     key={reaction}
//                                     onClick={() => handleReaction(message.id, reaction)}
//                                     className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${
//                                       message.MessageReactions?.some(
//                                         r => r.user_id === user?.id && r.reaction === reaction
//                                       )
//                                         ? 'bg-blue-100 text-blue-600'
//                                         : 'bg-gray-100 text-gray-600'
//                                     }`}
//                                   >
//                                     <span>{reaction}</span>
//                                     {count > 1 && <span>{count}</span>}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
                            
//                             <div className="flex items-center mt-1 space-x-2">
//                               <span className="text-xs text-gray-500">
//                                 {message.created_at ? formatMessageTime(message.created_at) : ''}
//                               </span>
                              
//                               {isOwnMessage && message.MessageReadStatuses?.some(rs => rs.is_read) && (
//                                 <CheckCheck className="h-3 w-3 text-blue-500" />
//                               )}
                              
//                               {!message.is_deleted && (
//                                 <div className="flex items-center space-x-1">
//                                   {/* Reaction Button */}
//                                   <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                       <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
//                                         <Smile className="h-3 w-3" />
//                                       </Button>
//                                     </DropdownMenuTrigger>
//                                     <DropdownMenuContent className="grid grid-cols-6 gap-1 p-2">
//                                       {AVAILABLE_REACTIONS.map(reaction => (
//                                         <button
//                                           key={reaction}
//                                           onClick={() => handleReaction(message.id, reaction)}
//                                           className="p-1 hover:bg-gray-100 rounded"
//                                         >
//                                           {reaction}
//                                         </button>
//                                       ))}
//                                     </DropdownMenuContent>
//                                   </DropdownMenu>
                                  
//                                   {/* Reply Button */}
//                                   {!isOwnMessage && (
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       className="h-6 px-2"
//                                       onClick={() => setReplyingTo(message)}
//                                     >
//                                       <Reply className="h-3 w-3" />
//                                     </Button>
//                                   )}
                                  
//                                   {/* Forward Button */}
//                                   <Button
//                                     size="sm"
//                                     variant="ghost"
//                                     className="h-6 px-2"
//                                     onClick={() => handleForwardMessage(message)}
//                                   >
//                                     <Forward className="h-3 w-3" />
//                                   </Button>
                                  
//                                   {/* Edit/Delete for own messages */}
//                                   {isOwnMessage && !isEditing && (
//                                     <DropdownMenu>
//                                       <DropdownMenuTrigger asChild>
//                                         <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
//                                           <MoreVertical className="h-3 w-3" />
//                                         </Button>
//                                       </DropdownMenuTrigger>
//                                       <DropdownMenuContent>
//                                         <DropdownMenuItem
//                                           onClick={() => {
//                                             setEditingMessageId(message.id);
//                                             setEditingContent(message.content || '');
//                                           }}
//                                         >
//                                           <Edit2 className="h-4 w-4 mr-2" />
//                                           Edit
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem
//                                           onClick={() => handleForwardMessage(message)}
//                                         >
//                                           <Forward className="h-4 w-4 mr-2" />
//                                           Forward
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem
//                                           onClick={() => handleDeleteMessage(message.id)}
//                                           className="text-red-600"
//                                         >
//                                           <Trash2 className="h-4 w-4 mr-2" />
//                                           Delete
//                                         </DropdownMenuItem>
//                                       </DropdownMenuContent>
//                                     </DropdownMenu>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div ref={messagesEndRef} />
//               </div>
//             )}
//           </ScrollArea>

//           {/* Message Input */}
//           <div className="p-4 border-t">
//             {replyingTo && (
//               <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
//                 <div className="flex-1">
//                   <p className="text-xs text-gray-500">Replying to {replyingTo.sender?.username}</p>
//                   <p className="text-sm truncate">{replyingTo.content || '[Attachment]'}</p>
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={() => setReplyingTo(null)}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             )}
            
//             {attachedFiles.length > 0 && (
//               <div className="mb-2 p-2 bg-gray-50 rounded-lg">
//                 <p className="text-xs text-gray-500 mb-1">Attached files:</p>
//                 {attachedFiles.map((file, index) => (
//                   <div key={index} className="flex items-center justify-between">
//                     <p className="text-sm">{file.name}</p>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
            
//             <div className="flex items-center space-x-2">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileSelect}
//                 multiple
//                 className="hidden"
//               />
              
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <Paperclip className="h-4 w-4" />
//               </Button>
              
//               <Textarea
//                 placeholder="Type a message..."
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSendMessage();
//                   }
//                 }}
//                 className="flex-1 min-h-[40px] max-h-[120px] resize-none"
//               />
              
//               <Button
//                 onClick={handleSendMessage}
//                 disabled={!messageInput.trim() && attachedFiles.length === 0}
//               >
//                 <Send className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No conversation selected
//             </h3>
//             <p className="text-gray-500 mb-4">
//               Choose a conversation from the list or start a new one
//             </p>
//             <Button
//               onClick={() => {
//                 setShowCreateDialog(true);
//                 setUserSearchQuery('');
//                 loadAvailableUsers();
//               }}
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Start New Conversation
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Create Conversation Dialog */}
//       <Dialog open={showCreateDialog} onOpenChange={(open) => {
//         setShowCreateDialog(open);
//         if (!open) {
//           // Reset form when dialog closes
//           setSelectedUsers([]);
//           setGroupName('');
//           setGroupDescription('');
//           setCreateType('direct');
//           setUserSearchQuery('');
//         }
//       }}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Create New Conversation</DialogTitle>
//             <DialogDescription>
//               Start a direct message or create a group chat
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             {/* Type Selection */}
//             <div className="flex space-x-2">
//               <Button
//                 variant={createType === 'direct' ? 'default' : 'outline'}
//                 onClick={() => {
//                   setCreateType('direct');
//                   setSelectedUsers([]);
//                 }}
//                 className="flex-1"
//               >
//                 Direct Message
//               </Button>
//               <Button
//                 variant={createType === 'group' ? 'default' : 'outline'}
//                 onClick={() => {
//                   setCreateType('group');
//                   setSelectedUsers([]);
//                 }}
//                 className="flex-1"
//               >
//                 Group Chat
//               </Button>
//             </div>
            
//             {/* Group Name (for group chats) */}
//             {createType === 'group' && (
//               <>
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">
//                     Group Name
//                   </label>
//                   <Input
//                     placeholder="Enter group name"
//                     value={groupName}
//                     onChange={(e) => setGroupName(e.target.value)}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">
//                     Description (optional)
//                   </label>
//                   <Textarea
//                     placeholder="Enter group description"
//                     value={groupDescription}
//                     onChange={(e) => setGroupDescription(e.target.value)}
//                   />
//                 </div>
//               </>
//             )}
            
//             {/* User Selection */}
//             <div>
//               <label className="text-sm font-medium mb-1 block">
//                 Select {createType === 'direct' ? 'User' : 'Members'}
//               </label>
              
//               {/* User Search Input */}
//               <div className="mb-2">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                   <Input
//                     placeholder="Search users by name, email, department, or role..."
//                     value={userSearchQuery}
//                     onChange={(e) => setUserSearchQuery(e.target.value)}
//                     className="pl-9"
//                   />
//                 </div>
//               </div>
              
//               <ScrollArea className="h-[200px] border rounded-lg p-2">
//                 {loadingUsers ? (
//                   <div className="text-center text-gray-500 py-4">
//                     <div className="flex flex-col items-center space-y-2">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                       <p>Loading users...</p>
//                     </div>
//                   </div>
//                 ) : availableUsers.length === 0 ? (
//                   <div className="text-center text-gray-500 py-4">
//                     {userSearchQuery ? 'No users found matching your search' : 'No users available'}
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     {availableUsers.map((availableUser) => (
//                       <div
//                         key={availableUser.id}
//                         className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
//                           selectedUsers.includes(availableUser.id) ? 'bg-blue-50' : ''
//                         }`}
//                         onClick={() => {
//                           if (createType === 'direct') {
//                             setSelectedUsers([availableUser.id]);
//                           } else {
//                             setSelectedUsers(prev =>
//                               prev.includes(availableUser.id)
//                                 ? prev.filter(id => id !== availableUser.id)
//                                 : [...prev, availableUser.id]
//                             );
//                           }
//                         }}
//                       >
//                         <Avatar className="h-8 w-8">
//                           <AvatarFallback>
//                             {getUserInitials(availableUser.username || availableUser.email)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1">
//                           <p className="font-medium">{availableUser.username}</p>
//                           <p className="text-sm text-gray-500">{availableUser.email}</p>
//                           <div className="flex items-center space-x-2 text-xs text-gray-400">
//                             <span>{availableUser.department}</span>
//                             <span>•</span>
//                             <span>{availableUser.role}</span>
//                             {availableUser.branch && (
//                               <>
//                                 <span>•</span>
//                                 <span>{availableUser.branch.branch_name}</span>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                         {selectedUsers.includes(availableUser.id) && (
//                           <Check className="h-4 w-4 text-blue-600" />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </ScrollArea>
              
//               {!loadingUsers && availableUsers.length > 0 && (
//                 <p className="text-xs text-gray-500 mt-2">
//                   Showing {availableUsers.length} user{availableUsers.length !== 1 ? 's' : ''}
//                   {userSearchQuery && ` matching "${userSearchQuery}"`}
//                 </p>
//               )}
//             </div>
            
//             {selectedUsers.length > 0 && (
//               <div className="text-sm text-gray-500">
//                 {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
//               </div>
//             )}
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => {
//               setShowCreateDialog(false);
//               setSelectedUsers([]);
//               setGroupName('');
//               setGroupDescription('');
//               setCreateType('direct');
//               setUserSearchQuery('');
//             }}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleCreateConversation}
//               disabled={
//                 selectedUsers.length === 0 ||
//                 (createType === 'group' && !groupName.trim())
//               }
//             >
//               Create
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Message</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete this message? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => {
//               setShowDeleteDialog(false);
//               setMessageToDelete(null);
//             }}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction 
//               onClick={confirmDeleteMessage}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Forward Message Dialog */}
//       <Dialog open={showForwardDialog} onOpenChange={(open) => {
//         setShowForwardDialog(open);
//         if (!open) {
//           setMessageToForward(null);
//           setSelectedConversationsForForward([]);
//           setForwardAdditionalContent('');
//         }
//       }}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Forward Message</DialogTitle>
//             <DialogDescription>
//               Select conversations to forward this message to
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             {/* Message Preview */}
//             {messageToForward && (
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm font-medium mb-1">{messageToForward.sender?.username}</p>
//                 <p className="text-sm">{messageToForward.content || '[Attachment]'}</p>
//               </div>
//             )}
            
//             {/* Additional Content */}
//             <div>
//               <label className="text-sm font-medium mb-1 block">
//                 Additional message (optional)
//               </label>
//               <Textarea
//                 placeholder="Add a message..."
//                 value={forwardAdditionalContent}
//                 onChange={(e) => setForwardAdditionalContent(e.target.value)}
//                 className="min-h-[60px]"
//               />
//             </div>
            
//             {/* Conversation Selection */}
//             <div>
//               <label className="text-sm font-medium mb-1 block">
//                 Select conversations
//               </label>
//               <ScrollArea className="h-[200px] border rounded-lg p-2">
//                 {conversations.length === 0 ? (
//                   <div className="text-center text-gray-500 py-4">
//                     No conversations available
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     {conversations.filter(conv => conv.id !== activeConversation?.id).map((conv) => (
//                       <div
//                         key={conv.id}
//                         className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
//                       >
//                         <Checkbox
//                           checked={selectedConversationsForForward.includes(conv.id)}
//                           onCheckedChange={(checked) => {
//                             if (checked) {
//                               setSelectedConversationsForForward(prev => [...prev, conv.id]);
//                             } else {
//                               setSelectedConversationsForForward(prev => 
//                                 prev.filter(id => id !== conv.id)
//                               );
//                             }
//                           }}
//                         />
//                         <Avatar className="h-8 w-8">
//                           <AvatarFallback>
//                             {getUserInitials(getConversationDisplayName(conv))}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1">
//                           <p className="font-medium">{getConversationDisplayName(conv)}</p>
//                           {conv.type === 'group' && (
//                             <p className="text-xs text-gray-500">Group • {conv.participants?.length} members</p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </ScrollArea>
//             </div>
            
//             {selectedConversationsForForward.length > 0 && (
//               <div className="text-sm text-gray-500">
//                 {selectedConversationsForForward.length} conversation{selectedConversationsForForward.length > 1 ? 's' : ''} selected
//               </div>
//             )}
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowForwardDialog(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={confirmForwardMessage}
//               disabled={selectedConversationsForForward.length === 0}
//             >
//               Forward
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Image Preview Dialog */}
//       <Dialog open={!!showImagePreview} onOpenChange={(open) => !open && setShowImagePreview(null)}>
//         <DialogContent className="max-w-4xl">
//           <div className="relative">
//             <Button
//               variant="ghost"
//               className="absolute top-2 right-2 z-10"
//               onClick={() => setShowImagePreview(null)}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//             {showImagePreview && (
//               <img 
//                 src={showImagePreview} 
//                 alt="Preview" 
//                 className="w-full h-auto max-h-[80vh] object-contain"
//               />
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* View Members Dialog */}
//       <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Group Members</DialogTitle>
//             <DialogDescription>
//               {activeConversation?.participants?.length} members in this group
//             </DialogDescription>
//           </DialogHeader>
          
//           <ScrollArea className="h-[300px] p-4">
//             <div className="space-y-2">
//               {activeConversation?.participants?.map((participant) => (
//                 <div key={participant.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
//                   <Avatar className="h-10 w-10">
//                     <AvatarFallback>
//                       {getUserInitials(participant.username)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <p className="font-medium">{participant.username}</p>
//                     <p className="text-sm text-gray-500">{participant.email}</p>
//                   </div>
//                   {participant.ConversationParticipant?.role === 'admin' && (
//                     <Badge variant="default">Admin</Badge>
//                   )}
//                   {participant.id === activeConversation.created_by && (
//                     <Badge variant="secondary">Creator</Badge>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowMembersDialog(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add Members Dialog (for group admins) */}
//       <Dialog open={showAddMembersDialog} onOpenChange={(open) => {
//         setShowAddMembersDialog(open);
//         if (!open) {
//           setSelectedMembersToAdd([]);
//           setUserSearchQuery('');
//         }
//       }}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Add Members to Group</DialogTitle>
//             <DialogDescription>
//               Select users to add to this group
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             {/* User Search */}
//             <div>
//               <div className="relative mb-2">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <Input
//                   placeholder="Search users..."
//                   value={userSearchQuery}
//                   onChange={(e) => setUserSearchQuery(e.target.value)}
//                   className="pl-9"
//                 />
//               </div>
//             </div>
            
//             {/* User List */}
//             <ScrollArea className="h-[250px] border rounded-lg p-2">
//               {loadingUsers ? (
//                 <div className="text-center text-gray-500 py-4">
//                   <div className="flex flex-col items-center space-y-2">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                     <p>Loading users...</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {availableUsers
//                     .filter(u => {
//                       // Filter out users already in the group
//                       const isInGroup = activeConversation?.participants?.some(p => p.id === u.id);
//                       return !isInGroup;
//                     })
//                     .map((availableUser) => (
//                       <div
//                         key={availableUser.id}
//                         className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
//                           selectedMembersToAdd.includes(availableUser.id) ? 'bg-blue-50' : ''
//                         }`}
//                         onClick={() => {
//                           setSelectedMembersToAdd(prev =>
//                             prev.includes(availableUser.id)
//                               ? prev.filter(id => id !== availableUser.id)
//                               : [...prev, availableUser.id]
//                           );
//                         }}
//                       >
//                         <Checkbox
//                           checked={selectedMembersToAdd.includes(availableUser.id)}
//                           onCheckedChange={() => {}}
//                         />
//                         <Avatar className="h-8 w-8">
//                           <AvatarFallback>
//                             {getUserInitials(availableUser.username)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1">
//                           <p className="font-medium">{availableUser.username}</p>
//                           <p className="text-sm text-gray-500">{availableUser.email}</p>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               )}
//             </ScrollArea>
            
//             {selectedMembersToAdd.length > 0 && (
//               <div className="text-sm text-gray-500">
//                 {selectedMembersToAdd.length} user{selectedMembersToAdd.length !== 1 ? 's' : ''} selected
//               </div>
//             )}
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowAddMembersDialog(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAddMembers}
//               disabled={selectedMembersToAdd.length === 0}
//             >
//               Add Members
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };











import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { 
  Send, 
  Plus, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Edit2, 
  Trash2, 
  Reply,
  Forward,
  Users,
  X,
  Check,
  CheckCheck,
  MessageCircle,
  AlertTriangle,
  Download,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { format, isToday, isYesterday } from 'date-fns';

// Import types from chat.ts
import type { Message, Conversation, User, MessageAttachment } from '@/types/chat';
import { AVAILABLE_REACTIONS } from '@/types/chat';

export const Chat = () => {
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    messages,
    unreadCount,
    loading,
    messagesLoading,
    loadConversations,
    createConversation,
    selectConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    loadMoreMessages,
    searchMessages,
    clearActiveConversation,
    refreshConversations
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createType, setCreateType] = useState<'direct' | 'group'>('direct');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [messageToForward, setMessageToForward] = useState<Message | null>(null);
  const [selectedConversationsForForward, setSelectedConversationsForForward] = useState<string[]>([]);
  const [forwardAdditionalContent, setForwardAdditionalContent] = useState('');
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const [showAddMembersDialog, setShowAddMembersDialog] = useState(false);
  const [selectedMembersToAdd, setSelectedMembersToAdd] = useState<string[]>([]);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-scroll to bottom when conversation changes
  useEffect(() => {
    if (activeConversation && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [activeConversation]);

  // Load available users for creating conversations
  const loadAvailableUsers = async (page: number = 1, searchTerm: string = '') => {
    try {
      setLoadingUsers(true);
      let allUsers: any[] = [];
      let currentPage = 1;
      let totalPages = 1;
      
      // Load all pages to get all users (or you can implement lazy loading)
      do {
        const response = await fetch(
          `https://aps2.zemenbank.com/ZAMS/api/auth?page=${currentPage}&limit=100`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          }
        );
        
        if (response.ok) {
          const result = await response.json();
          allUsers = [...allUsers, ...result.data];
          totalPages = result.totalPages;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);
      
      // Filter out current user and apply search
      let filteredUsers = allUsers.filter((u: any) => u.id !== user?.id);
      
      // Apply search filter if search term exists
      if (searchTerm) {
        filteredUsers = filteredUsers.filter((u: any) => 
          u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.role?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setAvailableUsers(filteredUsers);
      setTotalUserPages(totalPages);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
      setAvailableUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Debounced user search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showCreateDialog || showAddMembersDialog) {
        loadAvailableUsers(1, userSearchQuery);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [userSearchQuery, showCreateDialog, showAddMembersDialog]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  // Forward message function
  const forwardMessage = async (messageId: string, conversationIds: string[], additionalContent: string = '') => {
    try {
      const response = await fetch(`https://aps2.zemenbank.com/ZAMS/api/chat/messages/${messageId}/forward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          conversation_ids: conversationIds,
          additional_content: additionalContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to forward message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error forwarding message:', error);
      throw error;
    }
  };

  // Handle add members to group
  const handleAddMembers = async () => {
    if (!activeConversation || selectedMembersToAdd.length === 0) return;

    try {
      const response = await fetch(`https://aps2.zemenbank.com/ZAMS/api/chat/conversations/${activeConversation.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          user_ids: selectedMembersToAdd
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add members');
      }

      setShowAddMembersDialog(false);
      setSelectedMembersToAdd([]);
      toast.success(`${selectedMembersToAdd.length} member(s) added successfully`);
      
      // Refresh the conversation to get updated participants
      if (activeConversation) {
        await selectConversation(activeConversation.id);
      }
    } catch (error) {
      console.error('Failed to add members:', error);
      toast.error('Failed to add members');
    }
  };

  // Get conversation display name - fixed for actual API structure
  const getConversationDisplayName = (conv: Conversation): string => {
    if (conv.name) return conv.name;
    
    // For direct chats, find the other participant from participants array
    if (conv.type === 'direct' && conv.participants) {
      const otherParticipant = conv.participants.find(p => p.id !== user?.id);
      if (otherParticipant?.username) {
        return otherParticipant.username;
      }
    }
    
    return 'Unknown User';
  };

  // Get conversation participants for display
  const getOtherParticipant = (conv: Conversation): User | undefined => {
    if (conv.type === 'direct' && conv.participants) {
      return conv.participants.find(p => p.id !== user?.id);
    }
    return undefined;
  };

  // Check if current user is admin of the conversation
  const isUserAdmin = (conv: Conversation): boolean => {
    if (!conv.participants || !user) return false;
    const currentUserParticipant = conv.participants.find(p => p.id === user.id);
    return currentUserParticipant?.ConversationParticipant?.role === 'admin' || conv.created_by === user.id;
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() && attachedFiles.length === 0) return;
    if (!activeConversation) return;

    try {
      await sendMessage(
        messageInput.trim(),
        attachedFiles,
        replyingTo?.id
      );
      setMessageInput('');
      setReplyingTo(null);
      setAttachedFiles([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle create conversation
  const handleCreateConversation = async () => {
    if (createType === 'direct' && selectedUsers.length !== 1) {
      toast.error('Please select exactly one user for direct chat');
      return;
    }
    
    if (createType === 'group' && selectedUsers.length < 1) {
      toast.error('Please select at least one user for group chat');
      return;
    }
    
    if (createType === 'group' && !groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    try {
      const conversation = await createConversation({
        type: createType,
        participant_ids: selectedUsers,
        name: createType === 'group' ? groupName : undefined,
        description: createType === 'group' ? groupDescription : undefined
      });
      
      setShowCreateDialog(false);
      setSelectedUsers([]);
      setGroupName('');
      setGroupDescription('');
      setCreateType('direct');
      setUserSearchQuery('');
      
      // Select the newly created conversation
      await selectConversation(conversation.id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  // Handle edit message
  const handleEditMessage = async (messageId: string, content: string) => {
    if (!content.trim()) return;
    
    try {
      await editMessage(messageId, content);
      setEditingMessageId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  // Handle delete message with better UI
  const handleDeleteMessage = async (messageId: string) => {
    setMessageToDelete(messageId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    
    try {
      await deleteMessage(messageToDelete);
      setShowDeleteDialog(false);
      setMessageToDelete(null);
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Handle forward message
  const handleForwardMessage = (message: Message) => {
    setMessageToForward(message);
    setSelectedConversationsForForward([]);
    setForwardAdditionalContent('');
    setShowForwardDialog(true);
  };

  const confirmForwardMessage = async () => {
    if (!messageToForward || selectedConversationsForForward.length === 0) return;
    
    try {
      await forwardMessage(
        messageToForward.id,
        selectedConversationsForForward,
        forwardAdditionalContent
      );
      setShowForwardDialog(false);
      setMessageToForward(null);
      setSelectedConversationsForForward([]);
      setForwardAdditionalContent('');
      toast.success(`Message forwarded to ${selectedConversationsForForward.length} conversation(s)`);
    } catch (error) {
      console.error('Failed to forward message:', error);
      toast.error('Failed to forward message');
    }
  };

  // Handle reaction
  const handleReaction = async (messageId: string, reaction: string) => {
    try {
      // Check if user already has this reaction
      const message = messages.find(m => m.id === messageId);
      const existingReaction = message?.MessageReactions?.find(
        r => r.user_id === user?.id && r.reaction === reaction
      );
      
      if (existingReaction) {
        await removeReaction(messageId, reaction);
      } else {
        await addReaction(messageId, reaction);
      }
      
      setShowReactionPicker(null);
    } catch (error) {
      console.error('Failed to handle reaction:', error);
    }
  };

  // Get attachment URL (keeping your original working method)
  const getAttachmentUrl = (attachmentId: string) => {
    const token = localStorage.getItem('auth_token');
    return `https://aps2.zemenbank.com/ZAMS/api/chat/attachments/${attachmentId}/download?token=${token}`;
  };

  // Check if attachment is an image
  const isImageAttachment = (attachment: any) => {
    return attachment.mime_type?.startsWith('image/') || 
           attachment.file_type?.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
  };

  // Format message time with Telegram-style display
  const formatMessageTime = (date: string | null | undefined) => {
    if (!date) return '';
    
    try {
      const messageDate = new Date(date);
      
      // Check if date is valid
      if (isNaN(messageDate.getTime())) {
        console.warn('Invalid date:', date);
        return '';
      }
      
      if (isToday(messageDate)) {
        return format(messageDate, 'HH:mm');
      } else if (isYesterday(messageDate)) {
        return format(messageDate, 'HH:mm');
      } else {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays < 7) {
          return format(messageDate, 'EEE HH:mm'); // Mon 14:30
        } else {
          return format(messageDate, 'dd/MM HH:mm'); // 15/03 14:30
        }
      }
    } catch (error) {
      console.error('Error formatting date:', date, error);
      return '';
    }
  };

  // Format conversation list time (more compact)
  const formatConversationTime = (date: string | null | undefined) => {
    if (!date) return '';
    
    try {
      const messageDate = new Date(date);
      
      if (isNaN(messageDate.getTime())) {
        return '';
      }
      
      if (isToday(messageDate)) {
        return format(messageDate, 'HH:mm');
      } else if (isYesterday(messageDate)) {
        return 'Yesterday';
      } else {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays < 7) {
          return format(messageDate, 'EEE'); // Mon, Tue, etc.
        } else {
          return format(messageDate, 'dd/MM'); // 15/03
        }
      }
    } catch (error) {
      return '';
    }
  };

  // Get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const conversationName = getConversationDisplayName(conv);
    return conversationName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                loadAvailableUsers();
                setShowCreateDialog(true);
              }}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversations List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conv) => {
                const displayName = getConversationDisplayName(conv);
                const lastMessage = conv.Messages?.[0];
                const isActive = activeConversation?.id === conv.id;
                
                return (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      isActive ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getUserInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{displayName}</p>
                          {lastMessage && lastMessage.createdAt && (
                            <span className="text-xs text-gray-500">
                              {formatConversationTime(lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        
                        {lastMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            {lastMessage.sender_id === user?.id && 'You: '}
                            {lastMessage.content || (
                              lastMessage.MessageAttachments && lastMessage.MessageAttachments.length > 0 
                                ? `📎 ${lastMessage.MessageAttachments[0].file_name}` 
                                : (lastMessage.message_type === 'document' ? '📎 Document' : '[Attachment]')
                            )}
                          </p>
                        )}
                        
                        {conv.unread_count && conv.unread_count > 0 && (
                          <Badge variant="destructive" className="mt-1">
                            {conv.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col h-screen">
          {/* Fixed Chat Header */}
          <div className="p-4 border-b bg-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {getUserInitials(getConversationDisplayName(activeConversation))}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {getConversationDisplayName(activeConversation)}
                </p>
                {activeConversation.type === 'group' && (
                  <p className="text-sm text-gray-500">
                    {activeConversation.participants?.length} members
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {activeConversation.type === 'group' && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowMembersDialog(true)}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                  {isUserAdmin(activeConversation) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        loadAvailableUsers();
                        setShowAddMembersDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={clearActiveConversation}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-white" ref={messagesContainerRef}>
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">Loading messages...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">No messages yet. Start a conversation!</div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.sender_id === user?.id;
                  const isEditing = editingMessageId === message.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-end space-x-2">
                          {!isOwnMessage && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getUserInitials(message.sender?.username || 'U')}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className="flex-1">
                            {!isOwnMessage && (
                              <p className="text-xs text-gray-500 mb-1 ml-1">
                                {message.sender?.username}
                              </p>
                            )}
                            
                            <div className="relative">
                              <div
                                className={`rounded-2xl px-3 py-2 ${
                                  isOwnMessage 
                                    ? 'bg-blue-600 text-white rounded-br-md' 
                                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                }`}
                              >
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <Textarea
                                      value={editingContent}
                                      onChange={(e) => setEditingContent(e.target.value)}
                                      className="min-h-[60px] bg-white text-black"
                                      autoFocus
                                    />
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleEditMessage(message.id, editingContent)}
                                      >
                                        <Check className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          setEditingMessageId(null);
                                          setEditingContent('');
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {message.parent_message_id && message.parentMessage && (
                                      <div className={`border-l-2 pl-2 mb-2 text-xs ${
                                        isOwnMessage ? 'border-blue-400' : 'border-gray-300'
                                      }`}>
                                        <p className="font-medium">
                                          {message.parentMessage.sender?.username}
                                        </p>
                                        <p className="opacity-75 truncate">
                                          {message.parentMessage.content || '[Attachment]'}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {/* Message content with inline timestamp */}
                                    <div className="flex items-end gap-2">
                                      {message.content && (
                                        <p className="whitespace-pre-wrap break-words flex-1">
                                          {message.is_deleted ? '[Message deleted]' : message.content}
                                        </p>
                                      )}
                                      
                                      {/* Timestamp - ALWAYS SHOW */}
                                      <span className={`text-xs flex-shrink-0 ${
                                        isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                                      } flex items-center gap-1`}>
                                        <span>{formatMessageTime(message.createdAt)}</span>
                                        {isOwnMessage && message.MessageReadStatuses?.some(rs => rs.is_read) && (
                                          <CheckCheck className="h-3 w-3" />
                                        )}
                                      </span>
                                    </div>
                                    
                                    {message.is_edited && !message.is_deleted && (
                                      <p className={`text-xs mt-1 ${
                                        isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                                      }`}>
                                        (edited)
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>
                              
                              {/* Actions on hover */}
                              {!message.is_deleted && !isEditing && (
                                <div className={`absolute top-0 ${isOwnMessage ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-white shadow-lg rounded-lg p-1`}>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                        <Smile className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="grid grid-cols-6 gap-1 p-2">
                                      {AVAILABLE_REACTIONS.map(reaction => (
                                        <button
                                          key={reaction}
                                          onClick={() => handleReaction(message.id, reaction)}
                                          className="p-1 hover:bg-gray-100 rounded"
                                        >
                                          {reaction}
                                        </button>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() => setReplyingTo(message)}
                                  >
                                    <Reply className="h-3 w-3" />
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleForwardMessage(message)}
                                  >
                                    <Forward className="h-3 w-3" />
                                  </Button>
                                  
                                  {isOwnMessage && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                          <MoreVertical className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setEditingMessageId(message.id);
                                            setEditingContent(message.content || '');
                                          }}
                                        >
                                          <Edit2 className="h-4 w-4 mr-2" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleForwardMessage(message)}
                                        >
                                          <Forward className="h-4 w-4 mr-2" />
                                          Forward
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleDeleteMessage(message.id)}
                                          className="text-red-600"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* File attachments outside message bubble */}
                            {!isEditing && message.MessageAttachments && message.MessageAttachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.MessageAttachments.map((attachment) => (
                                  <div key={attachment.id}>
                                    {attachment.mime_type?.startsWith('image/') ? (
                                      <div 
                                        className="cursor-pointer max-w-xs"
                                        onClick={() => setShowImagePreview(getAttachmentUrl(attachment.id))}
                                      >
                                        <img 
                                          src={getAttachmentUrl(attachment.id)} 
                                          alt={attachment.file_name}
                                          className="max-w-full h-auto max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        />
                                      </div>
                                    ) : (
                                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-w-xs">
                                        <div className="flex items-center space-x-3">
                                          <div className="bg-blue-100 rounded-lg p-2">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{attachment.file_name}</p>
                                            <p className="text-xs text-gray-500">
                                              {attachment.file_size ? `${(attachment.file_size / 1024).toFixed(1)} KB` : 'Unknown size'}
                                            </p>
                                          </div>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => window.open(getAttachmentUrl(attachment.id), '_blank')}
                                            className="h-8 w-8 p-0 hover:bg-blue-50"
                                            title="Download file"
                                          >
                                            <Download className="h-4 w-4 text-blue-600" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                                
                                {/* Timestamp for attachment-only messages */}
                                {!message.content && (
                                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mt-1`}>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <span>{formatMessageTime(message.createdAt)}</span>
                                      {isOwnMessage && message.MessageReadStatuses?.some(rs => rs.is_read) && (
                                        <CheckCheck className="h-3 w-3" />
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Message Reactions */}
                            {message.MessageReactions && message.MessageReactions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.entries(
                                  message.MessageReactions.reduce((acc, r) => {
                                    acc[r.reaction] = (acc[r.reaction] || 0) + 1;
                                    return acc;
                                  }, {} as Record<string, number>)
                                ).map(([reaction, count]) => (
                                  <button
                                    key={reaction}
                                    onClick={() => handleReaction(message.id, reaction)}
                                    className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${
                                      message.MessageReactions?.some(
                                        r => r.user_id === user?.id && r.reaction === reaction
                                      )
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    <span>{reaction}</span>
                                    {count > 1 && <span>{count}</span>}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Fixed Message Input Footer */}
          <div className="p-4 border-t bg-white flex-shrink-0">
            {replyingTo && (
              <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Replying to {replyingTo.sender?.username}</p>
                  <p className="text-sm truncate">{replyingTo.content || '[Attachment]'}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingTo(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {attachedFiles.length > 0 && (
              <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Attached files:</p>
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <p className="text-sm">{file.name}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                className="hidden"
              />
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Textarea
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 min-h-[40px] max-h-[120px] resize-none"
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() && attachedFiles.length === 0}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center h-screen bg-white">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No conversation selected
            </h3>
            <p className="text-gray-500 mb-4">
              Choose a conversation from the list or start a new one
            </p>
            <Button
              onClick={() => {
                setShowCreateDialog(true);
                setUserSearchQuery('');
                loadAvailableUsers();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Conversation
            </Button>
          </div>
        </div>
      )}

      {/* All your existing dialogs remain the same */}
      {/* Create Conversation Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) {
          setSelectedUsers([]);
          setGroupName('');
          setGroupDescription('');
          setCreateType('direct');
          setUserSearchQuery('');
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Conversation</DialogTitle>
            <DialogDescription>
              Start a direct message or create a group chat
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Type Selection */}
            <div className="flex space-x-2">
              <Button
                variant={createType === 'direct' ? 'default' : 'outline'}
                onClick={() => {
                  setCreateType('direct');
                  setSelectedUsers([]);
                }}
                className="flex-1"
              >
                Direct Message
              </Button>
              <Button
                variant={createType === 'group' ? 'default' : 'outline'}
                onClick={() => {
                  setCreateType('group');
                  setSelectedUsers([]);
                }}
                className="flex-1"
              >
                Group Chat
              </Button>
            </div>
            
            {/* Group Name (for group chats) */}
            {createType === 'group' && (
              <>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Group Name
                  </label>
                  <Input
                    placeholder="Enter group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Description (optional)
                  </label>
                  <Textarea
                    placeholder="Enter group description"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                  />
                </div>
              </>
            )}
            
            {/* User Selection */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Select {createType === 'direct' ? 'User' : 'Members'}
              </label>
              
              {/* User Search Input */}
              <div className="mb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users by name, email, department, or role..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <ScrollArea className="h-[200px] border rounded-lg p-2">
                {loadingUsers ? (
                  <div className="text-center text-gray-500 py-4">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <p>Loading users...</p>
                    </div>
                  </div>
                ) : availableUsers.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    {userSearchQuery ? 'No users found matching your search' : 'No users available'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableUsers.map((availableUser) => (
                      <div
                        key={availableUser.id}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedUsers.includes(availableUser.id) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          if (createType === 'direct') {
                            setSelectedUsers([availableUser.id]);
                          } else {
                            setSelectedUsers(prev =>
                              prev.includes(availableUser.id)
                                ? prev.filter(id => id !== availableUser.id)
                                : [...prev, availableUser.id]
                            );
                          }
                        }}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getUserInitials(availableUser.username || availableUser.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{availableUser.username}</p>
                          <p className="text-sm text-gray-500">{availableUser.email}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{availableUser.department}</span>
                            <span>•</span>
                            <span>{availableUser.role}</span>
                            {availableUser.branch && (
                              <>
                                <span>•</span>
                                <span>{availableUser.branch.branch_name}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {selectedUsers.includes(availableUser.id) && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              {!loadingUsers && availableUsers.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Showing {availableUsers.length} user{availableUsers.length !== 1 ? 's' : ''}
                  {userSearchQuery && ` matching "${userSearchQuery}"`}
                </p>
              )}
            </div>
            
            {selectedUsers.length > 0 && (
              <div className="text-sm text-gray-500">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setSelectedUsers([]);
              setGroupName('');
              setGroupDescription('');
              setCreateType('direct');
              setUserSearchQuery('');
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateConversation}
              disabled={
                selectedUsers.length === 0 ||
                (createType === 'group' && !groupName.trim())
              }
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setMessageToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteMessage}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Forward Message Dialog */}
      <Dialog open={showForwardDialog} onOpenChange={(open) => {
        setShowForwardDialog(open);
        if (!open) {
          setMessageToForward(null);
          setSelectedConversationsForForward([]);
          setForwardAdditionalContent('');
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Forward Message</DialogTitle>
            <DialogDescription>
              Select conversations to forward this message to
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {messageToForward && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-1">{messageToForward.sender?.username}</p>
                <p className="text-sm">{messageToForward.content || '[Attachment]'}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Additional message (optional)
              </label>
              <Textarea
                placeholder="Add a message..."
                value={forwardAdditionalContent}
                onChange={(e) => setForwardAdditionalContent(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Select conversations
              </label>
              <ScrollArea className="h-[200px] border rounded-lg p-2">
                {conversations.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No conversations available
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.filter(conv => conv.id !== activeConversation?.id).map((conv) => (
                      <div
                        key={conv.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <Checkbox
                          checked={selectedConversationsForForward.includes(conv.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedConversationsForForward(prev => [...prev, conv.id]);
                            } else {
                              setSelectedConversationsForForward(prev => 
                                prev.filter(id => id !== conv.id)
                              );
                            }
                          }}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getUserInitials(getConversationDisplayName(conv))}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{getConversationDisplayName(conv)}</p>
                          {conv.type === 'group' && (
                            <p className="text-xs text-gray-500">Group • {conv.participants?.length} members</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            
            {selectedConversationsForForward.length > 0 && (
              <div className="text-sm text-gray-500">
                {selectedConversationsForForward.length} conversation{selectedConversationsForForward.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForwardDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmForwardMessage}
              disabled={selectedConversationsForForward.length === 0}
            >
              Forward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!showImagePreview} onOpenChange={(open) => !open && setShowImagePreview(null)}>
        <DialogContent className="max-w-4xl">
          <div className="relative">
            <Button
              variant="ghost"
              className="absolute top-2 right-2 z-10"
              onClick={() => setShowImagePreview(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            {showImagePreview && (
              <img 
                src={showImagePreview} 
                alt="Preview" 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Group Members</DialogTitle>
            <DialogDescription>
              {activeConversation?.participants?.length} members in this group
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[300px] p-4">
            <div className="space-y-2">
              {activeConversation?.participants?.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getUserInitials(participant.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{participant.username}</p>
                    <p className="text-sm text-gray-500">{participant.email}</p>
                  </div>
                  {participant.ConversationParticipant?.role === 'admin' && (
                    <Badge variant="default">Admin</Badge>
                  )}
                  {participant.id === activeConversation.created_by && (
                    <Badge variant="secondary">Creator</Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMembersDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Members Dialog (for group admins) */}
      <Dialog open={showAddMembersDialog} onOpenChange={(open) => {
        setShowAddMembersDialog(open);
        if (!open) {
          setSelectedMembersToAdd([]);
          setUserSearchQuery('');
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Members to Group</DialogTitle>
            <DialogDescription>
              Select users to add to this group
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <ScrollArea className="h-[250px] border rounded-lg p-2">
              {loadingUsers ? (
                <div className="text-center text-gray-500 py-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p>Loading users...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableUsers
                    .filter(u => {
                      const isInGroup = activeConversation?.participants?.some(p => p.id === u.id);
                      return !isInGroup;
                    })
                    .map((availableUser) => (
                      <div
                        key={availableUser.id}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedMembersToAdd.includes(availableUser.id) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          setSelectedMembersToAdd(prev =>
                            prev.includes(availableUser.id)
                              ? prev.filter(id => id !== availableUser.id)
                              : [...prev, availableUser.id]
                          );
                        }}
                      >
                        <Checkbox
                          checked={selectedMembersToAdd.includes(availableUser.id)}
                          onCheckedChange={() => {}}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getUserInitials(availableUser.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{availableUser.username}</p>
                          <p className="text-sm text-gray-500">{availableUser.email}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </ScrollArea>
            
            {selectedMembersToAdd.length > 0 && (
              <div className="text-sm text-gray-500">
                {selectedMembersToAdd.length} user{selectedMembersToAdd.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMembersDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMembers}
              disabled={selectedMembersToAdd.length === 0}
            >
              Add Members
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
