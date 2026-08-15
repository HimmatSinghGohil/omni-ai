import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { signToken } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().email().max(320),
  password: z.string().min(8).max(128),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] ?? req.socket.remoteAddress ?? 'unknown';
  if (!(await rateLimit(`register:${ip}`, 5, 3600)).success) return res.status(429).json({ success: false, error: 'Too many attempts' });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'Invalid registration data' });
  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return res.status(409).json({ success: false, error: 'Email already registered' });
  const user = await prisma.user.create({ data: { name: parsed.data.name, email, passwordHash: await hashPassword(parsed.data.password) }, select: { id: true, email: true, name: true, role: true, plan: true, credits: true } });
  const token = await signToken({ userId: user.id, email: user.email });
  return res.status(201).json({ success: true, user, token });
}
