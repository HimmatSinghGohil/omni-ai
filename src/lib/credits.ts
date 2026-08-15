import { prisma } from '@/lib/db';

export async function spendCredits(userId: string, amount: number, reason: string) {
  if (!Number.isInteger(amount) || amount <= 0) throw new Error('Invalid credit amount');
  return prisma.$transaction(async (tx) => {
    const result = await tx.user.updateMany({ where: { id: userId, credits: { gte: amount } }, data: { credits: { decrement: amount } } });
    if (result.count !== 1) throw new Error('INSUFFICIENT_CREDITS');
    await tx.creditLedger.create({ data: { userId, amount: -amount, reason } });
    return tx.user.findUniqueOrThrow({ where: { id: userId }, select: { credits: true } });
  });
}

export async function addCredits(userId: string, amount: number, reason: string) {
  if (!Number.isInteger(amount) || amount <= 0) throw new Error('Invalid credit amount');
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({ where: { id: userId }, data: { credits: { increment: amount } }, select: { credits: true } });
    await tx.creditLedger.create({ data: { userId, amount, reason } });
    return user;
  });
}
