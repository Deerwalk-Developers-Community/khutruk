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

export const getCampaignData = async () => {
  try {
    const response = await fetch(`${BASE_API_URL}retrieve-campaign`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    // console.log(result);
    return result;
  } catch (err: any) {
    console.error("error while retrieving campaigns : " + err);
  }
};

export const getCampaign = async (sequenceId: string) => {
  try {
    const response = await fetch(
      `${BASE_API_URL}retrieve-campaign/${sequenceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch campaign");
    }

    const result = await response.json();
    return result;
  } catch (err: any) {
    console.error("Error while fetching this campaign: ", err);
    throw err; // Re-throw the error so the page component can handle it
  }
};
