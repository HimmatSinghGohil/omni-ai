export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
}

export interface AIRequest {
  id: string;
  userId: string;
  toolType: ToolType;
  input: Record<string, any>;
  output?: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  creditsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

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

export interface GeneratedAsset {
  id: string;
  userId: string;
  toolType: ToolType;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document' | 'text';
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalCreditsIssued: number;
  creditsUsed: number;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
}
