"use client";

import React from "react";
import { ethers } from "ethers";
import { DisasterRelifCampaignABI } from "@/AddressABI/DisasterRelifCampaign";
import { Button } from "@/components/ui/button";
import { createCampaign } from "@/services/campaign/createCampaign";
import { getCampaign } from "@/services/campaign/getCampaign";
import { contractAddress } from "@/AddressABI/contractAddress";

const Page = () => {
  const connectMetamask = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected account:", accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const connectContract = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const DisasterRelifCampaignContract = new ethers.Contract(
          contractAddress.address,
          DisasterRelifCampaignABI,
          signer
        );
        console.log(contractAddress.address);
        console.log("Contract connected:", DisasterRelifCampaignContract);
      } catch (error) {
        console.error("Error connecting to the contract:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  return (
    <div className="flex flex-row gap-5">
      <Button onClick={connectMetamask}>Connect MetaMask</Button>
      <button onClick={connectContract}>Connect Contract</button>
      <button onClick={createCampaign}>Create Campaign</button>
      <button onClick={() => getCampaign(0)}>Get Campaign</button>
    </div>
  );
};

export default Page;
