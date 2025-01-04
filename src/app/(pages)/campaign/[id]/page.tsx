"use client";
import { useEffect, useState } from "react";
import { getCampaign } from "@/domain/repositories/campaignRepository";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Campaign {
  title: string;
  description: string;
  raised: number;
}

export default function Page({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

  const router = useRouter();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const campaignData = await getCampaign(id);
        setCampaign(campaignData);
        console.log(campaignData);
      } catch (error) {
        setError("Error fetching campaign");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  const handleDonateClick = () => {
    router.push(`/donate?campaignId=${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Campaign Details</h1>
      {campaign ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{campaign.title}</h2>
          <p className="text-gray-600">{campaign.description}</p>
          <p className="font-medium">Rs.</p>
          <Button onClick={handleDonateClick}>Donate Now</Button>
        </div>
      ) : (
        <div className="text-gray-500">Campaign not found</div>
      )}
    </div>
  );
}
