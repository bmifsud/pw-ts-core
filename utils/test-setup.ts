import { test as base } from '@playwright/test';
import { server } from './msw/server';

// Extend basic test by providing a setup for MSW
export const test = base.extend<{ worker: void }>({
  worker: [async ({}, use) => {
    const isMock = process.env.MOCK_API === 'true';
    if (isMock) {
       server.listen({ onUnhandledRequest: 'bypass' });
    }

    await use();

    if (isMock) {
        server.resetHandlers();
        server.close();
    }
  }, { auto: true }], // Automatically run for every test
});

export { expect } from '@playwright/test';
