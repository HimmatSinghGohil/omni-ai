import type { NextApiRequest, NextApiResponse } from 'next';
import { orchestrateRequest } from '@/lib/orchestrator';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, error: 'Authentication required' });

  const user = await verifyToken(token);
  if (!user) return res.status(401).json({ success: false, error: 'Invalid or expired token' });

  const input = typeof req.body?.input === 'string' ? req.body.input.trim() : '';
  if (!input) return res.status(400).json({ success: false, error: 'input is required' });
  if (input.length > 20000) return res.status(400).json({ success: false, error: 'input is too long' });

  const result = await orchestrateRequest({
    userId: user.userId,
    toolType: 'chat',
    input,
    model: typeof req.body?.model === 'string' ? req.body.model : undefined,
  });

  return res.status(result.success ? 200 : 500).json(result);
}
