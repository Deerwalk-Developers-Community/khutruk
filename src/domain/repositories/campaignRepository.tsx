import { BASE_API_URL } from "@/lib/constants";

export const saveCampaignToBackend = async (campaignData: any) => {
  try {
    const response = await fetch(`${BASE_API_URL}create-campaign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to save campaign to backend.");
    }

    return data;
  } catch (error) {
    console.error("Error saving campaign to backend:", error);
    throw error;
  }
};
