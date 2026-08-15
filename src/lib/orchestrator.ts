import OpenAI from 'openai';

export type ToolType =
  | 'chat'
  | 'study'
  | 'coding-assistant'
  | 'business-assistant'
  | 'pdf-assistant'
  | 'translator'
  | 'resume-builder';

export type OrchestratorRequest = {
  userId: string;
  toolType: ToolType;
  input: string;
  model?: string;
};

const getClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
  return new OpenAI({ apiKey });
};

const systemPrompts: Record<ToolType, string> = {
  chat: 'You are Omni AI, a helpful general-purpose assistant.',
  study: 'You are a patient study assistant. Explain concepts clearly and encourage learning.',
  'coding-assistant': 'You are an expert software engineer. Give correct, secure, maintainable solutions.',
  'business-assistant': 'You are a practical business assistant. Give clear, actionable advice.',
  'pdf-assistant': 'You help users understand and work with document content. Be precise and structured.',
  translator: 'You are a professional translator. Preserve meaning, tone, and formatting.',
  'resume-builder': 'You are a professional resume assistant. Produce concise, ATS-friendly content.',
};

export async function orchestrateRequest(request: OrchestratorRequest) {
  try {
    if (!request.input?.trim()) {
      return { success: false, error: 'Input is required' };
    }

    const client = getClient();
    const model = request.model || process.env.OPENAI_MODEL || 'gpt-5-mini';

    const response = await client.responses.create({
      model,
      instructions: systemPrompts[request.toolType],
      input: request.input,
    });

    return {
      success: true,
      data: {
        toolType: request.toolType,
        result: response.output_text,
        model,
        responseId: response.id,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Request processing failed',
    };
  }
}
