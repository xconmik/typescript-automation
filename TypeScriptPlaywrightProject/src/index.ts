import { chromium, Browser, Page } from 'playwright';
import { readCSV, Lead } from './csv';
import { getZoomInfoData, getEmailPattern } from './scraper';
import { fillBuildata } from './buildata';
import winston from 'winston';
import fs from 'fs';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'automation.log' })
  ]
});

const AUTH_FILE = 'auth.json';
const CSV_FILE = 'leads.csv';
const MAX_RETRIES = 3;

async function ensureAuth(context: any, page: Page) {
  if (!fs.existsSync(AUTH_FILE)) {
    logger.info('No auth.json found. Please log in to Buildata.');
    await page.goto('https://buildata.pharosiq.com/login', { waitUntil: 'networkidle' });
    logger.info('Waiting for manual login...');
    await page.waitForSelector('text=Contacts', { timeout: 0 });
    await context.storageState({ path: AUTH_FILE });
    logger.info('Auth session saved.');
  }
}

async function main() {
  const browser: Browser = await chromium.launch({ headless: false, slowMo: 40 });
  let context;
  if (fs.existsSync(AUTH_FILE)) {
    context = await browser.newContext({ storageState: AUTH_FILE });
  } else {
    context = await browser.newContext();
  }
  const page = await context.newPage();
  await ensureAuth(context, page);
  const leads: Lead[] = await readCSV(CSV_FILE, logger);
  // Configure automation rules before processing leads
  await page.goto('https://buildata.pharosiq.com/contacts', { waitUntil: 'networkidle' });
  await import('./buildata').then(m => m.configureAutomationRules(page, logger));
  for (const lead of leads) {
    let zoom: any = undefined, emailPattern: string = '';
    let success = false;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        zoom = await getZoomInfoData(page, lead.domain, logger);
        emailPattern = await getEmailPattern(page, lead.domain, logger);
        if (!zoom.phone && !zoom.headquarters && !zoom.employees && !zoom.revenue) {
          throw new Error('ZoomInfo data missing');
        }
        if (emailPattern === 'unknown') {
          throw new Error('Email pattern not found');
        }
        success = true;
        break;
      } catch (err) {
        logger.warn(`Retry ${attempt} for ${lead.domain}: ${err}`);
        if (attempt === MAX_RETRIES) {
          logger.error(`Failed to process ${lead.domain} after ${MAX_RETRIES} attempts.`);
        } else {
          await page.waitForTimeout(1000 * attempt);
        }
      }
    }
    if (success && zoom) {
      await fillBuildata(page, lead, zoom, emailPattern, logger);
      await page.waitForTimeout(1500);
    } else {
      logger.error(`Skipping lead ${lead.domain} due to missing data.`);
    }
  }
  await browser.close();
}

main().catch((err) => {
  logger.error(`Fatal error: ${err}`);
  process.exit(1);
});
