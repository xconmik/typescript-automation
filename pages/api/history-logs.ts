import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { HistoryLog } from '../../models/HistoryLog';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { action, details } = req.body;
    if (!action || !details) {
      return res.status(400).json({ error: 'Missing action or details' });
    }
    try {
      const client = await clientPromise;
      const db = client.db();
      const log: HistoryLog = {
        action,
        details,
        createdAt: new Date(),
      };
      const result = await db.collection('historylogs').insertOne(log);
      res.status(201).json({ _id: result.insertedId, ...log });
    } catch (error) {
      res.status(500).json({ error: 'Failed to log history' });
    }
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db();
      const logs = await db.collection('historylogs').find({}).sort({ createdAt: -1 }).toArray();
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
