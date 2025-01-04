import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      console.log("entry");
      const { id } = req.query; 

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Campaign ID is required and must be a string.' });
      }

      // Query the campaign with the 'id' from the database
      const campaign = await prisma.campaign.findUnique({
        where: { id: id },
      });

      // If campaign not found
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found.' });
      }

      // Return the found campaign
      return res.status(200).json(campaign);
    } else {
      // If method is not GET
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  } finally {
    await prisma.$disconnect();  // Disconnect Prisma Client after request
  }
}
