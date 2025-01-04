import { Key, Suspense } from 'react'
import prisma from '../../../lib/prisma'
import Card from './components/card'
import Featured from './components/featured'
import { CategoryTypes } from '@prisma/client'

async function getCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: {
      raisedAmount: 'desc'
    },
    where: {
      status: 'PENDING'
    }
  })
  return campaigns
}

export default async function Dashboard() {
  const campaigns = await getCampaigns()
  const [featuredCampaign, ...otherCampaigns] = campaigns

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-5xl">Discover Fundraisers</p>
      <div className="flex w-full h-full gap-10 pl-20 py-20">
        <Suspense fallback={<div>Loading featured campaign...</div>}>
          {featuredCampaign && (
            <Featured
              image={featuredCampaign.mediaUrls}
              title={featuredCampaign.title}
              raised={featuredCampaign.raisedAmount.toLocaleString()}
              description={featuredCampaign.description}
              category={featuredCampaign.category}
            />
          )}
        </Suspense>
        <div className="flex w-[50%] flex-wrap gap-10">
          <Suspense fallback={<div>Loading campaigns...</div>}>
            {otherCampaigns.map((campaign: { id: Key | null | undefined; mediaUrls: string; title: string; raisedAmount: { toLocaleString: () => string }; description: string; category: CategoryTypes }) => (
              <Card
                key={campaign.id}
                image={campaign.mediaUrls}
                title={campaign.title}
                raised={campaign.raisedAmount.toLocaleString()}
                description={campaign.description}
                category={campaign.category}
              />
            ))}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

