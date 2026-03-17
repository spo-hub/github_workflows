import { test, expect } from '@playwright/test';

test.describe('App Component', () => {
  test('should display app title', async ({ page }) => {
    await page.goto('/');

    const title = page.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).toContainText('frontend-app');
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/frontend-app/);
  });
});
