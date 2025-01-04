"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DisasterRelifCampaignABI } from "@/AddressABI/DisasterRelifCampaign";
import { Button } from "@/components/ui/button";
import { createCampaign } from "@/services/campaign/createCampaign";
import { getCampaign } from "@/services/campaign/getCampaign";
import { contractAddress } from "@/AddressABI/contractAddress";
import { Input } from "@/components/ui/input";
import { BASE_API_URL } from "@/lib/constants";

const Page = () => {
  const [campaignId, setCampaignId] = useState("");
  const [donationAmount, setDonationAmount] = useState("");

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

  const donateToCampaign = async () => {
    if (!campaignId || !donationAmount) {
      alert("Please provide both Campaign ID and Donation Amount.");
      return;
    }

    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const DisasterRelifCampaignContract = new ethers.Contract(
          contractAddress.address,
          DisasterRelifCampaignABI,
          signer
        );

        const tx = await DisasterRelifCampaignContract.donate(campaignId, {
          value: ethers.parseEther(donationAmount),
        });

        console.log("Transaction sent! Hash:", tx.hash);
        const receipt = await tx.wait();
        console.log("Donation successful! Receipt:", receipt);

        alert("Thank you for your donation!");
        setCampaignId("");
        setDonationAmount("");
      } catch (error: any) {
        console.error("Error during donation:", error);
        alert("There was an error processing your donation.");
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-5">
        <Button onClick={connectMetamask}>Connect MetaMask</Button>
        <Button onClick={connectContract}>Connect Contract</Button>
        <Button onClick={createCampaign}>Create Campaign</Button>
        <Button onClick={() => getCampaign(32)}>Get Campaign</Button>
      </div>

      <div className="flex flex-col gap-3 mt-5">
        <h2>Donate to a Campaign</h2>
        <Input
          type="text"
          placeholder="Enter Campaign ID"
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Enter Donation Amount (ETH)"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
        />
        <Button onClick={donateToCampaign}>Donate</Button>
      </div>
    </div>
  );
};

export default Page;
