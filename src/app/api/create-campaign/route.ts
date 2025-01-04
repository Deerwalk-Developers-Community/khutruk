import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: any) {
  try {
    const data = await req.json();

    // Check if campaign with this address already exists
    const existingCampaign = await prisma.campaign.findUnique({
      where: {
        campaignAddress: data.campaignAddress,
      },
    });

    if (existingCampaign) {
      return new Response(
        JSON.stringify({ 
          message: "A campaign with this address already exists" 
        }),
        { status: 409 }
      );
    }

    const highestSequenceId = await prisma.campaign.findFirst({
      orderBy: {
        sequenceId: "desc",
      },
      select: {
        sequenceId: true,
      },
    });
    const nextSequenceId = (highestSequenceId?.sequenceId ?? 31) + 1;

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
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ 
        message: "Unable to create a campaign",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500 }
    );
  }
}