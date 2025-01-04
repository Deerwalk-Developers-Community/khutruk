"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { contractAddress } from "@/AddressABI/contractAddress";
import { DisasterRelifCampaignABI } from "@/AddressABI/DisasterRelifCampaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WithdrawRequestPage = () => {
  const [campaignId, setCampaignId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectMetamask = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
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
        return DisasterRelifCampaignContract;
      } catch (error) {
        console.error("Error connecting to the contract:", error);
        return null;
      }
    } else {
      console.error("MetaMask is not installed");
      return null;
    }
  };

  const handleRequestWithdrawal = async () => {
    if (!isConnected) {
      alert("Please connect your MetaMask wallet first.");
      return;
    }

    if (!campaignId || !amount || !reason) {
      alert("Please fill in all fields.");
      return;
    }

    const contract = await connectContract();
    if (!contract) {
      alert("Failed to connect to the contract. Please try again.");
      return;
    }

    try {
      const tx = await contract.requestWithdrawal(
        campaignId,
        ethers.parseEther(amount),
        reason
      );

      console.log("Transaction hash:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);
      alert("Withdrawal request submitted successfully!");

      // Clear form fields after successful submission
      setCampaignId("");
      setAmount("");
      setReason("");
    } catch (err) {
      console.error("Error requesting withdrawal:", err);
      alert("Error submitting withdrawal request. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[588px] h-auto min-h-[448px] bg-white p-6 rounded-md shadow-md">
        <div className="w-[359px] mb-6 text-slate-900 text-sm font-normal font-['Inter'] leading-tight">
          Request a withdrawal for your campaign
        </div>

        <div className="mb-4">
          <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-2">
            Campaign ID
          </div>
          <Input
            type="text"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            placeholder="Enter Campaign ID"
            className="w-full pl-3 pr-14 py-2 bg-white rounded-md border border-slate-300"
          />
        </div>

        <div className="mb-4">
          <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-2">
            Withdrawal Amount (ETH)
          </div>
          <Input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in ETH"
            className="w-full pl-3 pr-14 py-2 bg-white rounded-md border border-slate-300"
          />
        </div>

        <div className="mb-4">
          <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-2">
            Reason for Withdrawal
          </div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for withdrawal"
            className="w-full pl-3 pr-14 py-2 bg-white rounded-md border border-slate-300 min-h-[100px] resize-none"
          />
        </div>

        <div className="mb-4">
          <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-2">
            Wallet Address
          </div>
          <div className="w-full h-[33px] bg-white rounded-[9px] border border-slate-300 flex items-center px-3">
            <div className="text-slate-400 text-sm font-medium font-['Inter'] leading-tight">
              {isConnected ? walletAddress : "Connect MetaMask to request withdrawal"}
            </div>
          </div>
        </div>

        <Button
          onClick={isConnected ? handleRequestWithdrawal : connectMetamask}
          className="w-full h-10 px-4 py-2 bg-[#21c55e] rounded-md text-white text-sm font-medium font-['Inter'] leading-normal"
        >
          {isConnected ? "Submit Withdrawal Request" : "Connect MetaMask"}
        </Button>
      </div>
    </div>
  );
};

export default WithdrawRequestPage;
