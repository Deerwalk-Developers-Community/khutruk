import { contractAddress } from "@/AddressABI/contractAddress";
import { DisasterRelifCampaignABI } from "@/AddressABI/DisasterRelifCampaign";
import { ethers } from "ethers";

export const createCampaign = async ({ title, description, targetAmount }: any) => {
  try {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const DisasterRelifCampaignContract = new ethers.Contract(
        contractAddress.address,
        DisasterRelifCampaignABI,
        signer
      );

      const tx = await DisasterRelifCampaignContract.createCampaign(
        title,
        description,
        ethers.parseEther(targetAmount.toString())
      );

      console.log("Transaction hash:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction receipt", receipt);
      const campaignAddress = receipt.logs[0]?.address; 
    return { campaignAddress };
      console.log("Campaign created successfully");
    }
  } catch (err) {
    console.error("Error creating campaign:", err);
  }
};
