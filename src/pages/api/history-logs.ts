import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import HistoryLog from '../../models/HistoryLog';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await dbConnect();

	if (req.method === 'POST') {
		const { action, details } = req.body;
		if (!action || !details) {
			return res.status(400).json({ error: 'Missing action or details' });
		}
		try {
			const log = { action, details, createdAt: new Date() };
			const result = await HistoryLog.create(log);
			res.status(201).json(result);
		} catch (error) {
			res.status(500).json({ error: 'Failed to log history' });
		}
	} else if (req.method === 'GET') {
		try {
			const logs = await HistoryLog.find().sort({ created_at: -1 }).limit(500);
			res.status(200).json(logs);
		} catch (error) {
			res.status(500).json({ error: 'Failed to fetch logs' });
		}
	} else {
		res.status(405).end();
	}
}