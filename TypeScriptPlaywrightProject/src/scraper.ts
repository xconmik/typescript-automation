import { Page } from 'playwright';
import { Logger } from 'winston';

export type ZoomInfoData = {
  phone: string;
  headquarters: string;
  employees: string;
  revenue: string;
};

export async function getZoomInfoData(page: Page, domain: string, logger: Logger): Promise<ZoomInfoData> {
  try {
    await page.goto(`https://www.google.com/search?q=${domain}+zoominfo`, { waitUntil: 'domcontentloaded' });
    const text = await page.textContent('body');
    return {
      phone: extract(text, /Phone:\s*([+\d\s-]+)/),
      headquarters: extract(text, /Headquarters:\s*(.*)/),
      employees: extract(text, /Employees:\s*([\d,]+)/),
      revenue: extract(text, /Revenue:\s*(\$[\d,.A-Z]+)/)
    };
  } catch (err) {
    logger.error(`ZoomInfo scrape failed for ${domain}: ${err}`);
    return { phone: '', headquarters: '', employees: '', revenue: '' };
  }
}

export async function getEmailPattern(page: Page, domain: string, logger: Logger): Promise<string> {
  try {
    await page.goto(`https://www.google.com/search?q=${domain}+rocketreach`, { waitUntil: 'domcontentloaded' });
    const text = await page.textContent('body');
    const patterns = [
      /\{first\}\.\{last\}@/,
      /\{f\}\{last\}@/,
      /\{first\}@/,
      /\{first\}_\{last\}@/
    ];
    for (const p of patterns) {
      if (text?.match(p)) return p.source;
    }
    return 'unknown';
  } catch (err) {
    logger.error(`RocketReach scrape failed for ${domain}: ${err}`);
    return 'unknown';
  }
}

function extract(text: string | null, regex: RegExp) {
  if (!text) return '';
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}
