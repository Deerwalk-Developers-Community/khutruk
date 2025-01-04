import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const { cid } = req.query;

      if (!cid || typeof cid !== 'string') {
        return res.status(400).json({ error: 'Campaign ID is required and must be a string.' });
      }

      const campaign = await prisma.campaign.findUnique({
        where: { id: cid },
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found.' });
      }

      return res.status(200).json(campaign);
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  } finally {
    await prisma.$disconnect();
  }
}
