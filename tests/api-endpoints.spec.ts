import { test, expect, request } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('API Endpoints', () => {
  test('GET /api/history returns 200', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/history`);
    expect(response.status()).toBe(200);
    // Optionally, check response body:
    // const data = await response.json();
    // expect(data).toHaveProperty('yourExpectedProperty');
  });

  test('GET /api/history-logs returns 200', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/history-logs`);
    expect(response.status()).toBe(200);
    // Optionally, check response body:
    // const data = await response.json();
    // expect(Array.isArray(data)).toBe(true);
  });
});
