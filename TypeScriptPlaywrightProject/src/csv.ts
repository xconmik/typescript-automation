import fs from 'fs';
import csv from 'csv-parser';
import { Logger } from 'winston';

export type Lead = {
  company: string;
  domain: string;
};

export async function readCSV(path: string, logger: Logger): Promise<Lead[]> {
  return new Promise((resolve, reject) => {
    const results: Lead[] = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (row) => {
        if (!row.company_name || !row.domain) {
          logger.warn(`Invalid row: ${JSON.stringify(row)}`);
          return;
        }
        results.push({
          company: row.company_name,
          domain: row.domain
        });
      })
      .on('end', () => {
        logger.info(`Loaded ${results.length} leads from CSV.`);
        resolve(results);
      })
      .on('error', (err) => {
        logger.error(`CSV read error: ${err}`);
        reject(err);
      });
  });
}
