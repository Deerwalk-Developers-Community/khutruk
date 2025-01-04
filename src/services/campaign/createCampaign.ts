
import { contractAddress } from "@/AddressABI/contractAddress";
import { DisasterRelifCampaignABI } from "@/AddressABI/DisasterRelifCampaign";
import { ethers } from "ethers";

export const createCampaign = async () => {
  try {
    if (typeof window !== "undefined" && window.ethereum) {
      console.log(window.ethereum);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const DisasterRelifCampaignContract = new ethers.Contract(
        contractAddress.address,
        DisasterRelifCampaignABI,
        signer
      );

      const tx = await DisasterRelifCampaignContract.createCampaign(
        "transaction test",
        "Distributing food to flood-affected areas",
        ethers.parseEther("5.0")
      );

      console.log("Transaction hash: ", tx.hash, "contract address used", contractAddress.address);
      const receipt = await tx.wait();
      console.log("Transaction receipt", receipt);
      console.log("Campaign created successfully");
    }
  } catch (err) {
    console.log(err);
  }
};
