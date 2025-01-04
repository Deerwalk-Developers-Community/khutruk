import { PrismaClient, CategoryTypes } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: any){
    try{
        const { searchParams } = new URL(req.url);

        const campaignId = searchParams.get("id");
        const category = searchParams.get("category");
        const creatorId = searchParams.get("creatorId");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

        if(campaignId){
            const campaign = await prisma.campaign.findUnique({
                where: {
                    id: campaignId,
                },
                include: {  
                    creator: true,
                    donations: true,
                },  
            });

            if (!campaign){
                return new Response(
                    JSON.stringify({ message: "Campaign not found "}), {status: 404}
                );
            }
            return new Response(JSON.stringify(campaign), {status: 200});
        }

        const campaigns = await prisma.campaign.findMany({
            where: {
                category: category ? category as CategoryTypes : undefined,
                creatorId: creatorId ? creatorId : undefined,
            },
            skip: (page-1)*pageSize,
            take: pageSize,
            include: {
                creator: true,
                donations: true,
            },
        });
        return new Response(JSON.stringify(campaigns), {status: 200});
    }catch(error){
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Unable to retrieve campaigns" }), {status: 500}
        );
    }
}