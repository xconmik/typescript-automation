# Next.js MongoDB History Logging

This project scaffolds a Next.js API for logging automation history to MongoDB, with Playwright integration.

## Files
- `models/HistoryLog.ts`: MongoDB schema for history logs, with indexes for fast search/filtering.
- `lib/mongodb.ts`: Connection helper for MongoDB.
- `pages/api/history.ts`: API route for GET/POST history logs.
- `.env.example`: Add your MongoDB connection string as `MONGODB_URI`.
- `playwright-history-example.js`: Example code for logging from Playwright.

## Setup
1. Ensure you have MongoDB installed locally or use a cloud provider like MongoDB Atlas.
2. Copy `.env.example` to `.env` and set your MongoDB URI:
   ```env
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   ```
3. Install dependencies:
   ```bash
   npm install mongoose
   ```
4. Start your Next.js app:
   ```bash
   npm run dev
   ```
5. Use the Playwright example to POST logs to `/api/history`.

## Usage
- GET `/api/history`: Fetch latest 500 logs, sorted by date.
- POST `/api/history`: Append a new log (append-only, never update).

## Best Practices
- History logs are append-only and immutable.
- Use indexes for fast search/filtering.
- Optionally add TTL, run_id, screenshot_url for advanced features.

---
Replace placeholders and adjust for your production environment as needed.
