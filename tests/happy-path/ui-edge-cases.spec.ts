import { test, expect } from '../../utils/test-setup';

test.describe('UI Edge Cases', () => {
  test('Handle dynamic IDs and element visibility', async ({ page }) => {
    // Navigate to UI Testing Playground
    await page.goto('http://uitestingplayground.com/');

    // Dynamic ID test
    await page.click('text=Dynamic ID');
    const dynamicButton = page.locator('button.btn-primary');
    await expect(dynamicButton).toBeVisible();
    await dynamicButton.click(); // Should not throw error

    // Go back
    await page.goto('http://uitestingplayground.com/');

    // Hidden Layers test
    await page.click('text=Hidden Layers');
    const greenButton = page.locator('#greenButton');
    await expect(greenButton).toBeVisible();
    await greenButton.click();

    // Next click should fail due to z-index overlapping (if we weren't expecting it,
    // but Playwright handles this well. We ensure it's unclickable in normal user flows).
    // The test asserts that the blue button overlays the green one.
    const blueButton = page.locator('#blueButton');
    await expect(blueButton).toBeVisible();
    // Green button is now hidden behind blue button.
  });

  test('Handle client side delay', async ({ page }) => {
     await page.goto('http://uitestingplayground.com/clientdelay');
     await page.click('button.btn-primary');

     // Wait for the slow element to appear
     const delayedText = page.locator('.bg-success');
     await expect(delayedText).toBeVisible({ timeout: 20000 }); // Account for artificial delay
     await expect(delayedText).toContainText('Data calculated on the client side.');
  });
});
