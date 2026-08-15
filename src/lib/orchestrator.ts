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

const systemPrompts: Record<ToolType, string> = {
  chat: 'You are Omni AI, a helpful general-purpose assistant.',
  study: 'You are a patient study assistant. Explain concepts clearly and encourage learning.',
  'coding-assistant': 'You are an expert software engineer. Give correct, secure, maintainable solutions.',
  'business-assistant': 'You are a practical business assistant. Give clear, actionable advice.',
  'pdf-assistant': 'You help users understand and work with document content. Be precise and structured.',
  translator: 'You are a professional translator. Preserve meaning, tone, and formatting.',
  'resume-builder': 'You are a professional resume assistant. Produce concise, ATS-friendly content.',
};

function cleanError(value: unknown) {
  if (value instanceof Error) return value.message;
  return typeof value === 'string' ? value : 'Provider request failed';
}

async function callGroq(input: string, system: string, model?: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured');

  const selectedModel = model || process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: input },
      ],
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error?.message || `Groq request failed (${response.status})`;
    throw new Error(message);
  }

  const result = data?.choices?.[0]?.message?.content;
  if (!result) throw new Error('Groq returned an empty response');

  return {
    result: String(result),
    model: selectedModel,
    responseId: data?.id,
    provider: 'groq' as const,
  };
}

async function callGemini(input: string, system: string, model?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const selectedModel = model || process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(selectedModel)}:generateContent`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: input }] }],
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error?.message || `Gemini request failed (${response.status})`;
    throw new Error(message);
  }

  const result = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || '')
    .join('')
    .trim();
  if (!result) throw new Error('Gemini returned an empty response');

  return {
    result,
    model: selectedModel,
    responseId: data?.responseId,
    provider: 'gemini' as const,
  };
}

export async function orchestrateRequest(request: OrchestratorRequest) {
  if (!request.input?.trim()) {
    return { success: false, error: 'Input is required' };
  }

  const system = systemPrompts[request.toolType];
  let groqError = '';

  // Primary provider: Groq. It exposes an OpenAI-compatible chat API.
  try {
    const response = await callGroq(request.input, system, request.model);
    return {
      success: true,
      data: {
        toolType: request.toolType,
        ...response,
      },
    };
  } catch (error) {
    groqError = cleanError(error);
  }

  // Fallback provider: Gemini. Keep the provider failure private unless both providers fail.
  try {
    const response = await callGemini(request.input, system, request.model);
    return {
      success: true,
      data: {
        toolType: request.toolType,
        ...response,
        fallback: true,
      },
    };
  } catch (error) {
    const geminiError = cleanError(error);
    return {
      success: false,
      error: `AI providers unavailable. Groq: ${groqError}. Gemini: ${geminiError}`,
    };
  }
}
