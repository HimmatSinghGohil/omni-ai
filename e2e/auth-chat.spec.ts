import { test, expect } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL;
const testPassword = process.env.E2E_TEST_PASSWORD;

test.describe('authenticated production chat flow', () => {
  test.skip(!baseURL || !testPassword, 'Requires PLAYWRIGHT_TEST_BASE_URL and E2E_TEST_PASSWORD');

  test('registers, logs in, and receives an AI response', async ({ page }) => {
    const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

    const registration = await page.request.post(`${baseURL}/api/auth/register`, {
      data: { name: 'OMNI-AI E2E', email, password: testPassword },
    });
    const registered = await registration.json();
    expect(registration.status(), `registration failed: ${JSON.stringify(registered)}`).toBe(201);
    expect(registered.token).toBeTruthy();

    const login = await page.request.post(`${baseURL}/api/auth/login`, {
      data: { email, password: testPassword },
    });
    const loggedIn = await login.json();
    expect(login.status(), `login failed: ${JSON.stringify(loggedIn)}`).toBe(200);
    expect(loggedIn.token).toBeTruthy();

    await page.goto('/chat');
    await page.evaluate((token) => localStorage.setItem('omni_ai_token', token), loggedIn.token);
    await page.reload();

    await expect(page).toHaveURL(/\/chat$/);
    await expect(page.getByRole('heading', { name: 'OMNI-AI' })).toBeVisible();

    await page.getByPlaceholder('Message OMNI-AI…').fill('Reply with exactly: E2E_OK');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('E2E_OK', { exact: false })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText('AI request failed', { exact: false })).toHaveCount(0);
  });
});
