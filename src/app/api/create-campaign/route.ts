import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: any) {
  try {
    const data = await req.json();

    const highestSequenceId = await prisma.campaign.findFirst({
      orderBy: {
        sequenceId: "desc",
      },
      select: {
        sequenceId: true,
      },
    });
    const nextSequenceId = (highestSequenceId?.sequenceId ?? -1) + 1;

    const campaign = await prisma.campaign.create({
      data: {
        creatorId: data.creatorId,
        title: data.title,
        description: data.description,
        category: data.category,
        campaignAddress: data.campaignAddress,
        targetAmount: parseFloat(data.targetAmount),
        status: "PENDING",
        mediaUrls: data.mediaUrls,
        startDate: new Date(),
        endDate: new Date(),
        sequenceId: nextSequenceId, 
      },
    });

    return new Response(
      JSON.stringify({ message: "Campaign created", campaign }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Unable to create a campaign" }),
      {
        status: 500,
      }
    );
  }
}
