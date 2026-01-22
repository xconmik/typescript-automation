import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { exec } from 'child_process';
import HistoryLog from './models/HistoryLog.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// CSV upload endpoint
app.post('/api/upload-csv', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const destPath = path.join(__dirname, 'TypeScriptPlaywrightProject', 'leads.csv');
  const fs = (await import('fs')).default;
  fs.rename(req.file.path, destPath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save file' });
    }
    // Optionally trigger Playwright automation
    exec('npm run start', { cwd: path.join(__dirname, 'TypeScriptPlaywrightProject') }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: 'Automation failed', details: stderr });
      }
      res.json({ message: 'File uploaded and automation started', output: stdout });
    });
  });
});

app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// GET /api/history
app.get('/api/history', async (req, res) => {
  try {
    const logs = await HistoryLog.find().sort({ created_at: -1 }).limit(1000);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history logs' });
  }
});

// POST /api/history
app.post('/api/history', async (req, res) => {
  try {
    const log = await HistoryLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create history log' });
  }
});

// GET /api/enrichments
app.get('/api/enrichments', async (req, res) => {
  try {
    // Example: return all history logs as enrichment data
    const enrichments = await HistoryLog.find().sort({ created_at: -1 }).limit(1000);
    res.json(enrichments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrichment data' });
  }
});

// GET /api/contacts

// GET /api/settings (mock data)
app.get('/api/settings', (req, res) => {
  res.json({
    companyName: "Acme Corporation",
    timezone: "america-los-angeles",
    searchDelay: "2000",
    retryAttempts: "3",
    proxyEnabled: false,
    zoomInfoConnected: true,
    rocketReachConnected: true,
    buildataConnected: false,
  });
});

app.get('/api/contacts', async (req, res) => {
  try {
    // Example: return empty array or mock data
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET /api/campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    // Example: return empty array or mock data
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API server running on http://localhost:${PORT}`);
});
