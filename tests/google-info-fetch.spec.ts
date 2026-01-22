import { test, expect, chromium } from '@playwright/test';

// Helper to extract info from Google search results
async function extractZoomInfo(page) {
  // Try to find info in the search results
  const text = await page.textContent('body');
  // Use regex or heuristics to extract phone, headquarters, employees, revenue
  // (This is a simple example, real selectors/regex may need to be more robust)
  const phone = text.match(/Phone: ([+\d\-() ]{7,})/i)?.[1] || '';
  const headquarters = text.match(/Headquarters: ([^\n]+)/i)?.[1] || '';
  const employees = text.match(/Employees: ([\d,]+)/i)?.[1] || '';
  const revenue = text.match(/Revenue: ([^\n]+)/i)?.[1] || '';
  return { phone, headquarters, employees, revenue };
}

async function extractRocketReachEmailPattern(page) {
  const text = await page.textContent('body');
  // Try to find the highest percentage email pattern
  // Example: "{first}.{last}@domain.com (97%)"
  const match = text.match(/([\w{}\.]+@[\w.]+) \((\d+)%\)/);
  return match ? { pattern: match[1], percent: match[2] } : { pattern: '', percent: '' };
}

test('Google ZoomInfo: fetch company info', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const domain = 'facebook.com';
  await page.goto(`https://www.google.com/search?q=site:zoominfo.com+${domain}`);
  const info = await extractZoomInfo(page);
  console.log('ZoomInfo:', info);
  expect(info.phone.length).toBeGreaterThan(0);
  expect(info.headquarters.length).toBeGreaterThan(0);
  expect(info.employees.length).toBeGreaterThan(0);
  expect(info.revenue.length).toBeGreaterThan(0);
  await browser.close();
});

test('Google RocketReach: fetch email pattern', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const domain = 'facebook.com';
  await page.goto(`https://www.google.com/search?q=site:rocketreach.co+${domain}`);
  const info = await extractRocketReachEmailPattern(page);
  console.log('RocketReach:', info);
  expect(info.pattern.length).toBeGreaterThan(0);
  expect(info.percent.length).toBeGreaterThan(0);
  await browser.close();
});
