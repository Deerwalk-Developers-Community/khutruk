import { PrismaClient, CategoryTypes } from "@prisma/client";

const prisma = new PrismaClient();

const createResponse = (data: any, status: number) =>
  new Response(JSON.stringify(data), { status });

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      title,
      description,
      targetAmount,
      category,
      campaignAddress,
      mediaUrls,
      creatorId,
    } = data;

    if (!title || !description || !targetAmount || !campaignAddress || !creatorId) {
      return createResponse({ error: "Missing required fields" }, 400);
    }

    if (category && !Object.values(CategoryTypes).includes(category as CategoryTypes)) {
      return createResponse({ error: "Invalid category" }, 400);
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        targetAmount: parseFloat(targetAmount),
        category,
        campaignAddress,
        mediaUrls,
        creatorId,
        status: "PENDING",
      },
    });

    return createResponse(
      { message: "Campaign saved successfully", campaign },
      201
    );
  } catch (error: any) {
    console.error("Error saving campaign:", error.message, error.stack);
    return createResponse({ error: "Failed to save campaign" }, 500);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const campaignId = searchParams.get("id");
    const category = searchParams.get("category");
    const creatorId = searchParams.get("creatorId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
      return createResponse({ error: "Invalid pagination parameters" }, 400);
    }

    if (campaignId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { creator: true, donations: true },
      });

      if (!campaign) {
        return createResponse({ message: "Campaign not found" }, 404);
      }

      return createResponse(campaign, 200);
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        category: category ? (category as CategoryTypes) : undefined,
        creatorId: creatorId || undefined,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { creator: true, donations: true },
    });

    return createResponse(campaigns, 200);
  } catch (error: any) {
    console.error("Error retrieving campaigns:", error.message, error.stack);
    return createResponse({ message: "Unable to retrieve campaigns" }, 500);
  }
}
