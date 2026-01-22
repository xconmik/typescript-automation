import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import HistoryLog from '../../models/HistoryLog';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const log = await HistoryLog.create(req.body);
    return res.status(201).json(log);
  }

  if (req.method === 'GET') {
    const logs = await HistoryLog.find()
      .sort({ created_at: -1 })
      .limit(500);
    return res.json(logs);
  }

  res.status(405).end();
}
