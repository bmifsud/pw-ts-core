import { test, expect } from '../../utils/test-setup';

test.describe('Negative Path API (Mocked Errors)', () => {
  test('Handle 500 Internal Server Error with network latency from mock', async ({ request }) => {
    // This will hit the MSW mock defined in handlers.ts
    const response = await request.get('https://api.example.com/data-500');

    // We expect the mock to return 500
    expect(response.status()).toBe(500);
    const body = await response.json();
    expect(body.message).toBe("Internal Server Error");

    // In a real framework we might validate retry logic here, but for this prototype
    // we'll just confirm we can gracefully intercept and assert on server errors.
  });

  test('Handle 404 Not Found from mock', async ({ request }) => {
     // Hit the MSW mock for 404
     const response = await request.get('https://api.example.com/data-404');

     expect(response.status()).toBe(404);
     const body = await response.json();
     expect(body.message).toBe("Not Found");
  });
});
