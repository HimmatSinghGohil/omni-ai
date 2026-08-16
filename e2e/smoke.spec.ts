import { test, expect } from '@playwright/test';

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
