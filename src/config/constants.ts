export const TOOLS = {
  CHAT: 'chat',
  STUDY: 'study',
  VOICE: 'voice',
  IMAGE_GENERATOR: 'image-generator',
  VIDEO_GENERATOR: 'video-generator',
  CODING_ASSISTANT: 'coding-assistant',
  BUSINESS_ASSISTANT: 'business-assistant',
  PDF_ASSISTANT: 'pdf-assistant',
  TRANSLATOR: 'translator',
  RESUME_BUILDER: 'resume-builder',
} as const;

export const CREDIT_COSTS = {
  [TOOLS.CHAT]: 1,
  [TOOLS.STUDY]: 1,
  [TOOLS.VOICE]: 2,
  [TOOLS.IMAGE_GENERATOR]: 5,
  [TOOLS.VIDEO_GENERATOR]: 20,
  [TOOLS.CODING_ASSISTANT]: 2,
  [TOOLS.BUSINESS_ASSISTANT]: 2,
  [TOOLS.PDF_ASSISTANT]: 3,
  [TOOLS.TRANSLATOR]: 1,
  [TOOLS.RESUME_BUILDER]: 3,
} as const;

export const RATE_LIMITS = {
  [TOOLS.CHAT]: { requests: 100, window: 3600 },
  [TOOLS.STUDY]: { requests: 100, window: 3600 },
  [TOOLS.VOICE]: { requests: 50, window: 3600 },
  [TOOLS.IMAGE_GENERATOR]: { requests: 20, window: 3600 },
  [TOOLS.VIDEO_GENERATOR]: { requests: 5, window: 86400 },
  [TOOLS.CODING_ASSISTANT]: { requests: 100, window: 3600 },
  [TOOLS.BUSINESS_ASSISTANT]: { requests: 50, window: 3600 },
  [TOOLS.PDF_ASSISTANT]: { requests: 30, window: 3600 },
  [TOOLS.TRANSLATOR]: { requests: 100, window: 3600 },
  [TOOLS.RESUME_BUILDER]: { requests: 10, window: 3600 },
} as const;

export const API_ENDPOINTS = {
  ORCHESTRATOR: '/api/orchestrator',
  CHAT: '/api/tools/chat',
  STUDY: '/api/tools/study',
  VOICE: '/api/tools/voice',
  IMAGE_GENERATOR: '/api/tools/image-generator',
  VIDEO_GENERATOR: '/api/tools/video-generator',
  CODING_ASSISTANT: '/api/tools/coding-assistant',
  BUSINESS_ASSISTANT: '/api/tools/business-assistant',
  PDF_ASSISTANT: '/api/tools/pdf-assistant',
  TRANSLATOR: '/api/tools/translator',
  RESUME_BUILDER: '/api/tools/resume-builder',
} as const;
