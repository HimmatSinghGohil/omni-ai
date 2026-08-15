import { test, expect } from '@playwright/test';

test('production app responds', async ({ page }) => {
  const response = await page.goto('/');
  expect(response).not.toBeNull();
  expect(response?.ok()).toBeTruthy();
});
