import { test, expect } from '../../utils/test-setup';

test.describe('Negative Path UI', () => {
  test('Intentional failure to trigger Jira bug logging', async ({ page }) => {
    // Navigate to a valid page
    await page.goto('http://uitestingplayground.com/');

    // Intentionally wait for an element that does not exist to simulate a timeout/failure
    const nonExistentElement = page.locator('#this-element-will-never-exist');

    // We expect this to fail
    await expect(nonExistentElement).toBeVisible({ timeout: 3000 });
  });
});
