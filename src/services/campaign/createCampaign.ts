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
<<<<<<< HEAD
        title,
        description,
        ethers.parseEther(targetAmount.toString())
=======
        "TESTING",
        "DTESTING SOMETHING",
        ethers.parseEther("5.0")
>>>>>>> 4a405be44fecaddae1deaeb54a404e89003728c2
      );

      console.log("Transaction hash:", tx.hash);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
<<<<<<< HEAD
      console.log("Transaction receipt", receipt);
      const campaignAddress = receipt.logs[0]?.address; // Adjust based on your event logs
    return { campaignAddress };
      console.log("Campaign created successfully");
=======

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
>>>>>>> 4a405be44fecaddae1deaeb54a404e89003728c2
    }
  } catch (err) {
    console.error("Error creating campaign:", err);
  }
};
