import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { sequenceId: string } }
) {
  try {
    const sequenceId = params.sequenceId;

    if (!sequenceId) {
      return NextResponse.json(
        { error: 'Campaign sequenceId is required.' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { sequenceId: Number(sequenceId) },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}