// Example Playwright script to log actions to the Next.js API
import { test } from '@playwright/test';

const API_URL = 'http://localhost:3000/api/history-logs';

test('Log action to history', async ({ request }) => {
  const response = await request.post(API_URL, {
    data: {
      action: 'UserLogin',
      details: 'User logged in via Playwright test',
    },
  });
  console.log(await response.json());
});
