import { test, expect } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL;
const testPassword = process.env.E2E_TEST_PASSWORD;

test.describe('authenticated production chat flow', () => {
  test.skip(!baseURL || !testPassword, 'Requires PLAYWRIGHT_TEST_BASE_URL and E2E_TEST_PASSWORD');

  test('registers, logs in, and receives an AI response', async ({ page }) => {
    const email = `e2e-${Date.now()}@example.com`;

    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create OMNI-AI account' })).toBeVisible();
    await page.getByPlaceholder('Name').fill('OMNI-AI E2E');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(testPassword!);
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/login$/);

    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(testPassword!);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/chat$/);
    await expect(page.getByRole('heading', { name: 'OMNI-AI' })).toBeVisible();

    await page.getByPlaceholder('Message OMNI-AI…').fill('Reply with exactly: E2E_OK');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('E2E_OK', { exact: false })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText('AI request failed', { exact: false })).toHaveCount(0);
  });
});
