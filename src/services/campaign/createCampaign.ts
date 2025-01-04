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
        ethers.parseEther(targetAmount.toString()),
        "TESTING",
        "DTESTING SOMETHING",
        ethers.parseEther("5.0")
      );

      console.log("Transaction hash:", tx.hash);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log("Transaction receipt:", receipt);

      // Compute the topic for the CampaignCreated event
      const campaignCreatedTopic = ethers.id(
        "CampaignCreated(uint256,address,string)"
      );

      // Find the log related to the CampaignCreated event
      const campaignCreatedLog = receipt.logs.find(
        (log:any) =>
          log.address.toLowerCase() === contractAddress.address.toLowerCase() &&
          log.topics[0] === campaignCreatedTopic
      );

      if (campaignCreatedLog) {
        // Decode the event data
        const decodedEvent = ethers.AbiCoder.defaultAbiCoder().decode(
          ["uint256", "address", "string"],
          campaignCreatedLog.data
        );

        const campaignId = decodedEvent[0];
        console.log("Campaign ID:", campaignId.toString());
      } else {
        console.error("CampaignCreated event not found in logs.");
      }
    }
  } catch (err) {
    console.error("Error creating campaign:", err);
  }
};
