import { test, expect } from '@playwright/test';

import { mockUsers, mockUser } from './fixtures/mock-data';

test.describe('User list with API Mocking ', () => {
  test('should display loading state initially', async ({ page }) => {
    // Mock API to delay response
    await page.route('**/api/users', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/');

    const loading = page.getByTestId('loading-spinner');
    await expect(loading).toBeVisible();
  });

  test('should display users from mocked API', async ({ page }) => {
    // Use a function-based URL matcher
    await page.route(
      (url) => url.href.includes('/api/users'),
      (route) => {
        const method = route.request().method();
        console.log('✅ Intercepted:', method, route.request().url());

        // Handle CORS preflight
        if (method === 'OPTIONS') {
          route.fulfill({
            status: 204,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: '',
          });
          return;
        }

        // Handle GET request
        route.fulfill({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
          ]),
        });
      }
    );

    await page.goto('/');

    // Wait for users to load
    await expect(page.getByTestId('user-card-1')).toBeVisible();

    await expect(page.getByTestId('user-name').first()).toHaveText('John Doe');
    await expect(page.getByTestId('user-email').first()).toHaveText('john@example.com');
    await expect(page.getByTestId('user-role').first()).toHaveText('Admin');

    const userCards = page.locator('[data-testid^="user-card-"]');
    await expect(userCards).toHaveCount(3);
  });

  test('should display empty state when no users', async ({ page }) => {
    await page.route('**/api/users', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/');

    const emptyState = page.getByTestId('empty-state');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toHaveText('No users found.');
  });

  test('should display error message on API failure', async ({ page }) => {
    await page.route('**/api/users', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/');

    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Failed to load users');
  });

  test('should handle network timeout', async ({ page }) => {
    await page.route('**/api/users', (route) => {
      // Don't fulfill or continue -stimulates timeout
    });

    await page.goto('/');

    const loading = page.getByTestId('loading-spinner');
    await expect(loading).toBeVisible();
  });

  test('should delete user when delete button clicked', async ({ page }) => {
    await page.route('**/api/users', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, name: 'john Doe', email: 'john@example.com', role: 'Admin' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
          ]),
        });
      }
    });

    await page.route('**/api/users/1', (route) => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({
          status: 204,
        });
      }
    });

    await page.goto('/');

    await expect(page.getByTestId('user-card-1')).toBeVisible();

    // Mock dialog confirmation
    page.on('dialog', (dialog) => dialog.accept());

    await page.getByTestId('delete-btn-1').click();

    await expect(page.getByTestId('user-card-1')).not.toBeVisible();
    await expect(page.getByTestId('user-card-2')).toBeVisible();
  });

  test('should handle different response status codes', async ({ page }) => {
    await page.route('**/api/users', (route) => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Not Found' }),
      });
    });

    await page.goto('/');
    await expect(page.getByTestId('error-message')).toBeVisible();
  });

  test('should verify request headers', async ({ page }) => {
    let requestHeaders: Record<string, string> = {};

    await page.route('**/api/users', (route) => {
      // Capture request headers
      requestHeaders = route.request().headers();

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/');

    expect(requestHeaders['accept']).toContain('application/json');
  });

  test('should mock multiple API endpoints', async ({ page }) => {
    await page.route('**/api/users', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        ]),
      });
    });

    await page.route('**/api/users/1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Admin',
            bio: 'Software Engineer',
          }),
        });
      }
    });

    await page.goto('/');
    await expect(page.getByTestId('user-card-1')).toBeVisible();
  });
});
