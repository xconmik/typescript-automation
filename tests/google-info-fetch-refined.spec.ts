import { test, expect, chromium, devices } from '@playwright/test';

// Helper to extract info from Google search result snippets
async function extractZoomInfo(page) {
  // Wait for search results
  await page.waitForSelector('div.g, div.tF2Cxc', { timeout: 10000 });
  // Get all result snippets
  const snippets = await page.$$eval('div.g, div.tF2Cxc', nodes => nodes.map(n => n.innerText));
  // Try to extract info from all snippets
  let phone = '', headquarters = '', employees = '', revenue = '';
  for (const text of snippets) {
    if (!phone) phone = text.match(/Phone: ([+\d\-() ]{7,})/i)?.[1] || '';
    if (!headquarters) headquarters = text.match(/Headquarters: ([^\n]+)/i)?.[1] || '';
    if (!employees) employees = text.match(/Employees: ([\d,]+)/i)?.[1] || '';
    if (!revenue) revenue = text.match(/Revenue: ([^\n]+)/i)?.[1] || '';
  }
  return { phone, headquarters, employees, revenue };
}

async function extractRocketReachEmailPattern(page) {
  await page.waitForSelector('div.g, div.tF2Cxc', { timeout: 10000 });
  const snippets = await page.$$eval('div.g, div.tF2Cxc', nodes => nodes.map(n => n.innerText));
  for (const text of snippets) {
    const match = text.match(/([\w{}\.]+@[\w.]+) \((\d+)%\)/);
    if (match) return { pattern: match[1], percent: match[2] };
  }
  return { pattern: '', percent: '' };
}

test('Google ZoomInfo: fetch company info (refined)', async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({
    ...devices['Desktop Chrome'],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  const page = await context.newPage();
  const domain = 'facebook.com';
  await page.goto(`https://www.google.com/search?q=site:zoominfo.com+${domain}`);
  // Accept cookies if present
  try { await page.click('button:has-text("Accept all")', { timeout: 3000 }); } catch {}
  const info = await extractZoomInfo(page);
  console.log('ZoomInfo:', info);
  // Don't fail if not found, just print
  await browser.close();
});

test('Google RocketReach: fetch email pattern (refined)', async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({
    ...devices['Desktop Chrome'],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  const page = await context.newPage();
  const domain = 'facebook.com';
  await page.goto(`https://www.google.com/search?q=site:rocketreach.co+${domain}`);
  try { await page.click('button:has-text("Accept all")', { timeout: 3000 }); } catch {}
  const info = await extractRocketReachEmailPattern(page);
  console.log('RocketReach:', info);
  await browser.close();
});
