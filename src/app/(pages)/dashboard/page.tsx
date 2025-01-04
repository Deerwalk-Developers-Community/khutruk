"use client";
import React, { useEffect, useState } from "react";
import Card from "./components/card";
import Featured from "./components/featured";
import { getCampaignData } from "@/domain/repositories/campaignRepository";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [data, setData] = useState<any[]>([]); // State to hold the campaign data
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading state
  const router = useRouter();

  useEffect(() => {
    // Fetch the campaign data asynchronously when the component mounts
    const fetchData = async () => {
      try {
        const campaigns = await getCampaignData();
        setData(campaigns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs only once, after the first render

  if (loading) {
    return <div>Loading....</div>; // Show loading message while fetching data
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-5xl mb-8">Discover Fundraisers</p>
      <div className="flex w-full h-full gap-10 pl-20 py-20">
        {/* Featured Campaign - Static Example */}
        <Featured
          image="https://silver-selective-damselfly-558.mypinata.cloud/ipfs/bafybeieycpqyeyvv55v6hzb4zsg7v2ju3shcp2ahsli4ipfhsqiuabncqa"
          title="Education for underprivileged"
          raised="40,000"
          description="Monday through Friday our bus travels to four different villages. Starting with the first village, over two hours away, the bus picks up and brings the children to school before heading out to the next village (approximately 45 minutes away). It then repeats the process."
          category="Education"
        />

        {/* Render Campaign Cards */}
        <div className="flex w-[50%] flex-wrap gap-10">
          {data.map((campaign: any) => (
            <Card
              key={campaign.id}
              image={campaign.mediaUrls}
              title={campaign.title}
              raised={campaign.raised}
              description={campaign.description}
              category={campaign.category}
              sequence_id={campaign.sequenceId}
              onClick={() => router.push(`/campaign/${campaign.sequenceId}`)} // Navigate to campaign details page
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
