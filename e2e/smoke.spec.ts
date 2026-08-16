import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();
const password = process.env.E2E_TEST_PASSWORD;

function requireE2EPassword() {
  expect(password, 'E2E_TEST_PASSWORD GitHub secret must be configured').toBeTruthy();
  return password as string;
}

async function createE2EUser(prefix: string) {
  const email = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  const user = await prisma.user.create({
    data: {
      name: 'E2E Test User',
      email,
      passwordHash: await hashPassword(requireE2EPassword()),
      credits: 100,
    },
    select: { id: true, email: true, credits: true },
  });
  return user;
}

async function login(baseURL: string, email: string) {
  const response = await fetch(`${baseURL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: requireE2EPassword() }),
  });
  return response;
}

test.afterAll(async () => {
  await prisma.$disconnect();
});

test('production app responds', async ({ page }) => {
  const response = await page.goto('/');
  expect(response).not.toBeNull();
  expect(response?.ok()).toBeTruthy();
});

test('chat page responds without server error', async ({ page }) => {
  const response = await page.goto('/chat');
  expect(response).not.toBeNull();
  expect(response?.status()).toBeLessThan(500);
});

test('authenticated chat deducts one credit and records usage/ledger', async ({ request }) => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL;
  expect(baseURL).toBeTruthy();

  const created = await createE2EUser('e2e-credit');
  try {
    const loginResponse = await login(baseURL as string, created.email);
    expect(loginResponse.status).toBe(200);
    const loggedIn = await loginResponse.json();
    const token = loggedIn.token as string;
    expect(token).toBeTruthy();
    expect(loggedIn.user.credits).toBe(100);

    const before = await prisma.user.findUnique({ where: { id: created.id }, select: { credits: true } });
    expect(before?.credits).toBe(100);

    const chat = await request.post(`${baseURL}/api/ai/chat`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { input: 'E2E credit accounting test' },
    });
    expect(chat.status()).toBe(200);
    const chatBody = await chat.json();
    expect(chatBody.success).toBeTruthy();
    expect(chatBody.data?.result).toBeTruthy();
    expect(chatBody.data?.creditsRemaining).toBe(99);

    const after = await prisma.user.findUnique({ where: { id: created.id }, select: { credits: true } });
    expect(after?.credits).toBe(99);

    const usage = await prisma.usage.findMany({ where: { userId: created.id }, orderBy: { createdAt: 'desc' } });
    expect(usage.length).toBeGreaterThanOrEqual(1);
    expect(usage[0].requests).toBe(1);
    expect(['GROQ', 'GOOGLE', 'OPENAI']).toContain(usage[0].provider);

    const ledger = await prisma.creditLedger.findMany({ where: { userId: created.id }, orderBy: { createdAt: 'desc' } });
    expect(ledger.length).toBeGreaterThanOrEqual(1);
    expect(ledger[0].amount).toBe(-1);
    expect(ledger[0].provider).toBe(usage[0].provider);
  } finally {
    await prisma.user.delete({ where: { id: created.id } }).catch(() => undefined);
  }
});

test('chat rate limit returns 429 without consuming credits', async ({ request }) => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL;
  expect(baseURL).toBeTruthy();

  const created = await createE2EUser('e2e-rate');
  try {
    const loginResponse = await login(baseURL as string, created.email);
    expect(loginResponse.status).toBe(200);
    const loggedIn = await loginResponse.json();
    const token = loggedIn.token as string;
    expect(token).toBeTruthy();

    // The limiter runs before input validation, so invalid requests exercise Redis
    // without calling an AI provider or consuming credits.
    let lastStatus = 0;
    let rateLimited = false;
    for (let i = 0; i < 31; i += 1) {
      const response = await request.post(`${baseURL}/api/ai/chat`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { input: '' },
      });
      lastStatus = response.status();
      if (lastStatus === 429) {
        rateLimited = true;
        expect(response.headers()['retry-after']).toBeTruthy();
        expect(response.headers()['x-ratelimit-limit']).toBe('30');
        break;
      }
      expect(lastStatus).toBe(400);
    }

    expect(rateLimited).toBeTruthy();
    expect(lastStatus).toBe(429);

    const user = await prisma.user.findUnique({ where: { id: created.id }, select: { credits: true } });
    expect(user?.credits).toBe(100);
  } finally {
    await prisma.user.delete({ where: { id: created.id } }).catch(() => undefined);
  }
});
