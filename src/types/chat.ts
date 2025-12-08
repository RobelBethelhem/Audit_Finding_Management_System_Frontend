// // src/types/chat.ts - FIXED for username only
// import { User } from './user';

// export interface Conversation {
//   id: string;
//   name: string | null;
//   type: 'direct' | 'group';
//   description: string | null;
//   avatar?: string | null;
//   created_by: string;
//   is_active: boolean;
//   last_message_at: string | null;
//   created_at: string;
//   updated_at: string;
//   unread_count?: number;
//   participants?: ConversationParticipant[];
//   Messages?: Message[];
// }

// export interface ConversationParticipant {
//   id: string;
//   conversation_id: string;
//   user_id: string;
//   role: 'admin' | 'member';
//   joined_at: string;
//   last_read_at: string | null;
//   is_muted: boolean;
//   is_active: boolean;
//   User?: User;
// }

// export interface Message {
//   id: string;
//   conversation_id: string;
//   sender_id: string;
//   content: string | null;
//   message_type: 'text' | 'file' | 'image' | 'document';
//   parent_message_id: string | null;
//   is_edited: boolean;
//   edited_at: string | null;
//   is_deleted: boolean;
//   deleted_at: string | null;
//   created_at: string;
//   updated_at: string;
//   sender?: User;
//   MessageAttachments?: MessageAttachment[];
//   MessageReactions?: MessageReaction[];
//   parentMessage?: Message;
//   MessageReadStatuses?: MessageReadStatus[];
// }

// export interface MessageAttachment {
//   id: string;
//   message_id: string;
//   file_name: string;
//   file_path: string;
//   file_type: string | null;
//   file_size: number | null;
//   mime_type: string | null;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
// }

// export interface MessageReaction {
//   id: string;
//   message_id: string;
//   user_id: string;
//   reaction: string;
//   created_at: string;
//   updated_at: string;
//   User?: User;
// }

// export interface MessageReadStatus {
//   id: string;
//   message_id: string;
//   user_id: string;
//   is_read: boolean;
//   read_at: string | null;
//   created_at: string;
//   updated_at: string;
// }

// export interface CreateConversationDto {
//   name?: string;
//   type: 'direct' | 'group';
//   participant_ids: string[];
//   description?: string;
// }

// export interface SendMessageDto {
//   content: string;
//   parent_message_id?: string;
//   files?: File[];
// }

// export interface ForwardMessageDto {
//   conversation_ids: string[];
//   additional_content?: string;
// }

// export interface AddReactionDto {
//   reaction: string;
// }

// export interface TypingIndicator {
//   conversationId: string;
//   userId: string;
//   username: string;
//   // Removed firstName and lastName
// }

// export interface OnlineStatus {
//   [userId: string]: boolean;
// }

// export const AVAILABLE_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡', '👏', '🔥', '🎉', '👀', '🤔', '💯'] as const;
// export type ReactionType = typeof AVAILABLE_REACTIONS[number];
















// // src/types/chat.ts

// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   first_name?: string;
//   last_name?: string;
//   role?: string;
//   branch_id?: string;
//   is_active?: boolean;
// }

// export interface Conversation {
//   id: string;
//   name?: string;
//   type: 'direct' | 'group';
//   description?: string;
//   created_by: string;
//   last_message_at?: string;
//   created_at: string;
//   updated_at: string;
//   participants?: User[];
//   Messages?: Message[];
//   unread_count?: number;
//   ConversationParticipants?: ConversationParticipant[];
// }

// export interface ConversationParticipant {
//   id: string;
//   conversation_id: string;
//   user_id: string;
//   role: 'admin' | 'member';
//   joined_at: string;
//   is_muted: boolean;
//   is_active: boolean;
// }

// export interface Message {
//   id: string;
//   conversation_id: string;
//   sender_id: string;
//   content: string;
//   message_type: 'text' | 'image' | 'document' | 'audio' | 'video';
//   parent_message_id?: string;
//   is_edited: boolean;
//   edited_at?: string;
//   is_deleted: boolean;
//   deleted_at?: string;
//   created_at: string;
//   updated_at: string;
//   sender?: User;
//   parentMessage?: Message;
//   MessageAttachments?: MessageAttachment[];
//   MessageReactions?: MessageReaction[];
//   MessageReadStatuses?: MessageReadStatus[];
// }

// export interface MessageAttachment {
//   id: string;
//   message_id: string;
//   file_name: string;
//   file_path: string;
//   file_type: string;
//   file_size: number;
//   mime_type: string;
//   is_active: boolean;
//   created_at: string;
// }

// export interface MessageReaction {
//   id: string;
//   message_id: string;
//   user_id: string;
//   reaction: string;
//   created_at: string;
//   User?: User;
// }

// export interface MessageReadStatus {
//   id: string;
//   message_id: string;
//   user_id: string;
//   is_read: boolean;
//   read_at?: string;
//   created_at: string;
// }

// export interface CreateConversationDto {
//   type: 'direct' | 'group';
//   participant_ids: string[];
//   name?: string;
//   description?: string;
// }

// export interface SendMessageDto {
//   content?: string;
//   files?: File[];
//   parent_message_id?: string;
// }

// export interface ForwardMessageDto {
//   conversation_ids: string[];
//   additional_content?: string;
// }

// export interface AddReactionDto {
//   reaction: string;
// }

// export interface TypingIndicator {
//   conversationId: string;
//   userId: string;
//   username: string;
//   firstName?: string;
//   lastName?: string;
// }

// export interface OnlineStatus {
//   [userId: string]: boolean;
// }

// export const AVAILABLE_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡', '👏', '🔥', '🎉', '👀', '🤔', '💯'] as const;

// export type ReactionType = typeof AVAILABLE_REACTIONS[number];



// src/types/chat.ts - Fixed based on actual API response

export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  department?: string;
  branch_id?: string;
  is_active?: boolean;
  branch?: any;
  type?: string;
  supervisor?: string | null;
}

export interface Conversation {
  id: string;
  name: string | null;
  type: 'direct' | 'group';
  description: string | null;
  avatar?: string | null;
  created_by: string;
  is_active: boolean;
  last_message_at: string | null;
  createdAt: string;
  updated_at: string;
  unread_count?: number;
  // The participants array contains User objects with nested ConversationParticipant
  participants?: Array<User & {
    ConversationParticipant?: {
      role: 'admin' | 'member';
      is_muted: boolean;
    }
  }>;
  Messages?: Message[];
  ConversationParticipants?: ConversationParticipant[];
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  last_read_at: string | null;
  is_muted: boolean;
  is_active: boolean;
  createdAt: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  message_type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'file';
  parent_message_id: string | null;
  is_edited: boolean;
  edited_at: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  createdAt: string;
  updated_at: string;
  sender?: User;
  parentMessage?: Message;
  MessageAttachments?: MessageAttachment[];
  MessageReactions?: MessageReaction[];
  MessageReadStatuses?: MessageReadStatus[];
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  mime_type: string | null;
  is_active: boolean;
  createdAt: string;
  updated_at: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
  createdAt: string;
  updated_at: string;
  User?: User;
}

export interface MessageReadStatus {
  id: string;
  message_id: string;
  user_id: string;
  is_read: boolean;
  read_at: string | null;
  createdAt: string;
  updated_at: string;
}

export interface CreateConversationDto {
  name?: string;
  type: 'direct' | 'group';
  participant_ids: string[];
  description?: string;
}

export interface SendMessageDto {
  content?: string;
  parent_message_id?: string;
  files?: File[];
}

export interface ForwardMessageDto {
  conversation_ids: string[];
  additional_content?: string;
}

export interface AddReactionDto {
  reaction: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  username: string;
}

export interface OnlineStatus {
  [userId: string]: boolean;
}

export const AVAILABLE_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡', '👏', '🔥', '🎉', '👀', '🤔', '💯'] as const;

export type ReactionType = typeof AVAILABLE_REACTIONS[number];