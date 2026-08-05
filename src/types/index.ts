// Application types

export type ToolType = 
  | 'chat'
  | 'study'
  | 'voice'
  | 'image-generator'
  | 'video-generator'
  | 'coding-assistant'
  | 'business-assistant'
  | 'pdf-assistant'
  | 'translator'
  | 'resume-builder';

export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface AIRequest {
  id: string;
  userId: string;
  toolType: ToolType;
  input: Record<string, string>;
  output?: Record<string, string>;
  status: 'pending' | 'completed' | 'failed';
  creditsUsed: number;
  createdAt: Date;
}

export interface GeneratedAsset {
  id: string;
  userId: string;
  toolType: ToolType;
  fileName: string;
  fileUrl: string;
  fileType: string;
  createdAt: Date;
}
