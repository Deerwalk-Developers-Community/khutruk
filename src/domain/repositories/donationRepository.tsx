import { BASE_API_URL } from "@/lib/constants";

export const saveDonation = async (donationData: any) => {
  try {
    const response = await fetch(`${BASE_API_URL}donation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(donationData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to save campaign to backend.");
    }

    return data;
  } catch (error) {
    console.error("Error saving donation to backend:", error);
    throw error;
  }
};
