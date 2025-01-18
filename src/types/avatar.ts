export interface AvatarChatParams {
  userId: string;
  avatarId: string;
  message: string;
  threadId?: string;
  contextMessages?: any[];
}

export interface AvatarDocument {
  id: string;
  content: string;
  embedding: number[];
  avatarId: string;
} 