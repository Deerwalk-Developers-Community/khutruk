import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const createResponse = (data: any, status: number) =>
  new Response(JSON.stringify(data), { status });

export async function GET(req: Request) {
  try {
    const campaigns = await prisma.campaign.findMany({
        include: { creator: true, donations: true},
    });
    return createResponse(campaigns, 200);
} catch (error: any) {
    console.error("Error retrieving campaigns:", error.message, error.stack);
    return createResponse({ message: "Unable to retrieve campaigns" }, 500);
}
}
