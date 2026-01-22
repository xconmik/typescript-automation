# TypeScript Playwright Automation Project

This project automates web scraping and form filling using Playwright, with CSV input, Google search integration, and Buildata contacts auto-population.

## Features
- Read leads from CSV
- Scrape company data from Google (ZoomInfo, RocketReach)
- Normalize and validate data
- Auto-type into Buildata Contacts using Playwright
- Auth persistence (login session)
- Error handling, logging, and retry logic

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Place your `leads.csv` in the project root.
3. Run the automation:
   ```sh
   npm run start
   ```

## Project Structure
- `src/csv.ts` — CSV reading logic
- `src/scraper.ts` — Google scraping utilities
- `src/buildata.ts` — Playwright automation for Buildata
- `src/index.ts` — Main runner

## Requirements
- Node.js 18+
- Chrome/Chromium (Playwright will auto-install)

## Auth
- First run will prompt for login and save session to `auth.json`.

## Logging
- Logs are written to `automation.log` and console.

---

Replace placeholders and adjust selectors as needed for your environment.
