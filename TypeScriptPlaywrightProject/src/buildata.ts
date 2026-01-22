export async function configureAutomationRules(page: Page, logger: Logger) {
  try {
    await page.goto('https://buildata.pharosiq.com/automation-rules', { waitUntil: 'networkidle' });
    // Set Invalid Email Limit = 5
    const invalidLimitInput = 'input[type="number"]';
    await page.click(invalidLimitInput);
    await page.keyboard.press('Control+A');
    await page.keyboard.type('5');
    await page.waitForTimeout(300);

    // Set Verifalia Invalid Action → Skip Company
    try {
      await page.click('text=Skip Company');
    } catch {
      await page.click('div[role="combobox"]');
      await page.click('text=Skip Company');
    }
    await page.waitForTimeout(500);

    // Proofpoint Protected → checked
    const proofpoint = 'text=Proofpoint Protected';
    const proofpointInput = 'xpath=//label[contains(., "Proofpoint Protected")]/input';
    if (!(await page.isChecked(proofpointInput))) {
      await page.click(proofpoint);
    }

    // Catch-all Restricted → unchecked
    const catchAllInput = 'xpath=//label[contains(., "Catch-all Restricted")]/input';
    if (await page.isChecked(catchAllInput)) {
      await page.click('text=Catch-all Restricted');
    }

    // Generic Restricted → unchecked
    const genericInput = 'xpath=//label[contains(., "Generic Restricted")]/input';
    if (await page.isChecked(genericInput)) {
      await page.click('text=Generic Restricted');
    }

    // Wait for Blazor auto-save
    await page.waitForTimeout(2000);

    // Optional: verify value
    const value = await page.inputValue(invalidLimitInput);
    logger.info(`Invalid email limit set to: ${value}`);
  } catch (err) {
    logger.error(`configureAutomationRules failed: ${err}`);
  }
}
import { Page } from 'playwright';
import { Lead } from './csv';
import { ZoomInfoData } from './scraper';
import { Logger } from 'winston';

export async function typeSlow(page: Page, selector: string, value: string, logger: Logger) {
  try {
    await page.click(selector);
    for (const char of value) {
      await page.keyboard.type(char);
      await page.waitForTimeout(40 + Math.random() * 40);
    }
  } catch (err) {
    logger.error(`typeSlow failed for selector ${selector}: ${err}`);
  }
}

export async function fillBuildata(page: Page, lead: Lead, zoom: ZoomInfoData, emailPattern: string, logger: Logger) {
  try {
    await page.click('text=Add Contact');
    await typeSlow(page, 'input[name="domain"]', lead.domain, logger);
    await typeSlow(page, 'input[name="phone"]', zoom.phone, logger);
    await typeSlow(page, 'input[name="headquarters"]', zoom.headquarters, logger);
    await typeSlow(page, 'input[name="employees"]', zoom.employees, logger);
    await typeSlow(page, 'input[name="revenue"]', zoom.revenue, logger);
    await typeSlow(page, 'input[name="emailPattern"]', emailPattern, logger);
    await page.click('button:has-text("Save")');
  } catch (err) {
    logger.error(`fillBuildata failed: ${err}`);
  }
}
