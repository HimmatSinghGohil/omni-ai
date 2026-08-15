import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { signToken } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({ email: z.string().email().max(320), password: z.string().min(1).max(128) });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] ?? req.socket.remoteAddress ?? 'unknown';
  if (!(await rateLimit(`login:${ip}`, 10, 900)).success) return res.status(429).json({ success: false, error: 'Too many attempts' });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'Invalid credentials' });
  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) return res.status(401).json({ success: false, error: 'Invalid credentials' });
  const token = await signToken({ userId: user.id, email: user.email });
  return res.status(200).json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan, credits: user.credits }, token });
}
