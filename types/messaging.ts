export interface MessageRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  userMessage: string;
  partnerName?: string;
  weddingDate?: Date;
  weddingLocation?: string;
  status: "pending" | "sent" | "delivered" | "read";
  createdAt: Date;
  sentAt?: Date;
}

export interface MessageFlowData {
  vendorId: string;
  vendorName: string;
  step: number;
  partnerName?: string;
  weddingDate?: Date;
  weddingLocation?: string;
  userMessage?: string;
  isGeneratedMessage?: boolean;
}
