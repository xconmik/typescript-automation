import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import HistoryLog from '../../models/HistoryLog';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await dbConnect();

	if (req.method === 'POST') {
		try {
			const log = await HistoryLog.create(req.body);
			return res.status(201).json(log);
		} catch (error) {
			return res.status(500).json({ error: 'Failed to create history log' });
		}
	}

	if (req.method === 'GET') {
		try {
			const logs = await HistoryLog.find().sort({ created_at: -1 }).limit(500);
			return res.json(logs);
		} catch (error) {
			return res.status(500).json({ error: 'Failed to fetch history logs' });
		}
	}

	res.status(405).end();
}