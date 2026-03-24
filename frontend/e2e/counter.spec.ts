import { test, expect } from '@playwright/test';

test.describe('Counter Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to counter page before each test
    // Adjust URL based on your routing

    await page.goto('/');
    // If counter is on a separate route:
    // await page.goto('/counter');
  });

  test('should display initial count of 0', async ({ page }) => {
    const countDisplay = page.getByTestId('count-display');
    await expect(countDisplay).toHaveText('0');
  });

  test('should increment count when increment button is clicked', async ({ page }) => {
    // Fin and click increment button
    const incrementBtn = page.getByTestId('increment-btn');
    await incrementBtn.click();

    // Verify count increased
    const countDisplay = page.getByTestId('count-display');
    await expect(countDisplay).toHaveText('1');
  });

  test('should decrement count when decrement button is clicked', async ({ page }) => {
    const decrementBtn = page.getByTestId('decrement-btn');
    await decrementBtn.click();

    const countDisplay = page.getByTestId('count-display');
    await expect(countDisplay).toHaveText('-1');
  });

  test('should rest count to 0 when rest button is clicked', async ({ page }) => {
    const incrementBtn = page.getByTestId('increment-btn');
    await incrementBtn.click();
    await incrementBtn.click();
    await incrementBtn.click();

    const countDisplay = page.getByTestId('count-display');
    await expect(countDisplay).toHaveText('3');

    const resetBtn = page.getByTestId('reset-btn');
    await resetBtn.click();

    await expect(countDisplay).toHaveText('0');
  });

  test('should handle multiple operation correctly', async ({ page }) => {
    const incrementBtn = page.getByTestId('increment-btn');
    const decrementBtn = page.getByTestId('decrement-btn');
    const countDisplay = page.getByTestId('count-display');

    await incrementBtn.click();
    await incrementBtn.click();
    await incrementBtn.click();
    await expect(countDisplay).toHaveText('3');

    await decrementBtn.click();
    await expect(countDisplay).toHaveText('2');

    await incrementBtn.click();
    await expect(countDisplay).toHaveText('3');
  });
});
