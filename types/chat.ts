export interface Attachment {
  id: string;
  type: "image" | "document";
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface Message {
  id: string;
  text: string;
  type: "sent" | "received";
  timestamp: Date;
  showTip?: boolean;
  attachments?: Attachment[];
}

export interface Chat {
  id: string;
  vendorName: string;
  vendorId: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
  avatar?: string;
}

export interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
}
