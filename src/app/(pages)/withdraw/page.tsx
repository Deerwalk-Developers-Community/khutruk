"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { contractAddress } from "@/AddressABI/contractAddress";
import { DisasterRelifCampaignABI } from "@/AddressABI/DisasterRelifCampaign";
import { Button } from "@/components/ui/button";

const WithdrawRequestPage = () => {
  const [campaignId, setCampaignId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

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

  const handleRequestWithdrawal = async () => {
    connectContract();
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const DisasterRelifCampaignContract = new ethers.Contract(
          contractAddress.address,
          DisasterRelifCampaignABI,
          signer
        );

        const tx = await DisasterRelifCampaignContract.requestWithdrawal(
          campaignId,
          ethers.parseEther(amount),
          reason
        );

        console.log("Transaction hash:", tx.hash);

        const receipt = await tx.wait();
        console.log("Transaction receipt:", receipt);
        alert("Withdrawal request submitted successfully!");
      }
    } catch (err) {
      console.error("Error requesting withdrawal:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Request Withdrawal</h1>
      <input
        type="text"
        placeholder="Campaign ID"
        value={campaignId}
        onChange={(e) => setCampaignId(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input"
      />
      <textarea
        placeholder="Reason for withdrawal"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="textarea"
      ></textarea>
      <Button onClick={handleRequestWithdrawal}>
        Submit Withdrawal Request
      </Button>
    </div>
  );
};

export default WithdrawRequestPage;
