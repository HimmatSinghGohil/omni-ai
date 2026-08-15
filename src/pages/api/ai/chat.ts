import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { orchestrateRequest } from '@/lib/orchestrator';
import { verifyToken } from '@/lib/auth';

const CHAT_CREDIT_COST = 1;

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

  // Atomically reserve one credit so concurrent requests cannot overspend the balance.
  const reserved = await prisma.user.updateMany({
    where: { id: user.userId, credits: { gte: CHAT_CREDIT_COST } },
    data: { credits: { decrement: CHAT_CREDIT_COST } },
  });

  if (reserved.count !== 1) {
    return res.status(402).json({ success: false, error: 'Insufficient credits' });
  }

  let result;
  try {
    result = await orchestrateRequest({
      userId: user.userId,
      toolType: 'chat',
      input,
      model: typeof req.body?.model === 'string' ? req.body.model : undefined,
    });
  } catch (error) {
    await prisma.user.update({
      where: { id: user.userId },
      data: { credits: { increment: CHAT_CREDIT_COST } },
    });
    return res.status(500).json({ success: false, error: 'AI request failed' });
  }

  if (!result.success) {
    await prisma.user.update({
      where: { id: user.userId },
      data: { credits: { increment: CHAT_CREDIT_COST } },
    });
    return res.status(502).json(result);
  }

  const provider = result.data.provider;
  const model = result.data.model;

  await prisma.$transaction([
    prisma.creditLedger.create({
      data: {
        userId: user.userId,
        amount: -CHAT_CREDIT_COST,
        reason: `AI chat (${provider}/${model})`,
      },
    }),
    prisma.usage.create({
      data: {
        userId: user.userId,
        provider,
        model,
        requests: 1,
        promptTokens: 0,
        completionTokens: 0,
        totalCost: 0,
      },
    }),
  ]);

  const currentUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { credits: true },
  });

  return res.status(200).json({
    ...result,
    data: {
      ...result.data,
      creditsRemaining: currentUser?.credits ?? 0,
    },
  });
}
