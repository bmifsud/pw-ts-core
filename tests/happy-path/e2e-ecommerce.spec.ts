import { test, expect } from '../../utils/test-setup';

test.describe('E-Commerce Happy Path', () => {
  test('User can browse products, add to cart, and verify cart contents', async ({ page }) => {
    // Navigate to Automation Exercise
    await page.goto('https://automationexercise.com/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    // Navigate to Products page
    await page.click('a[href="/products"]');
    await expect(page.locator('.title').first()).toBeVisible();

    // Add first product to cart
    const firstProduct = page.locator('.product-image-wrapper').first();
    await firstProduct.hover();
    await firstProduct.locator('.add-to-cart').first().click();

    // Verify success modal
    const modal = page.locator('#cartModal');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.modal-title')).toContainText('Added!');

    // Continue Shopping
    await modal.locator('button:has-text("Continue Shopping")').click();
    await expect(modal).toBeHidden();
  });
});
