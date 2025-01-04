"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DisasterRelifCampaignABI } from "@/AddressABI/DisasterRelifCampaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { contractAddress } from "@/AddressABI/contractAddress";
import { useSearchParams } from "next/navigation";

const DonationPage = () => {
  const searchParams = useSearchParams();
  const [donationAmount, setDonationAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [campaignId, setCampaignId] = useState("");

  useEffect(() => {
    const id = searchParams.get("campaignId");
    if (id) {
      setCampaignId(id);
    }
  }, [searchParams]);

  const predefinedAmounts = ["100", "500", "1,000", "10,000"];

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

  const donateToCampaign = async () => {
    if (!campaignId || !donationAmount) {
      alert("Please provide both Campaign ID and Donation Amount.");
      return;
    }

    connectContract();
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
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[588px] h-[448px] bg-white p-6 rounded-md shadow-md">
        <div className="w-[359px] mb-6 text-slate-900 text-sm font-normal font-['Inter'] leading-tight">
          Your small support can make a big change to fight homelessness
        </div>

        <div className="mb-4">
          <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-2">
            Enter your donation Amount
          </div>
          <div className="flex gap-2 mb-4">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setDonationAmount(amount.replace(",", ""))}
                className={`px-3 py-2 bg-white rounded-md border ${
                  donationAmount === amount.replace(",", "")
                    ? "border-[#21c55e]"
                    : "border-slate-300"
                } text-slate-900 text-sm font-normal font-['Inter'] leading-tight`}
              >
                RS.{amount}
              </button>
            ))}
          </div>
          <Input
            type="text"
            step="0.001"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="Enter custom amount"
            className="w-full pl-3 pr-14 py-2 bg-white rounded-md border border-slate-300"
          />
        </div>

        <div className="mb-4">
          <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-2">
            Payment Method
          </div>
          <div className="w-full h-[33px] bg-white rounded-[9px] border border-slate-300 flex items-center px-3">
            <div className="text-slate-400 text-sm font-medium font-['Inter'] leading-tight">
              {isConnected ? walletAddress : "Connect MetaMask to donate"}
            </div>
          </div>
        </div>

        <Button
          onClick={isConnected ? donateToCampaign : connectMetamask}
          className="w-full h-10 px-4 py-2 bg-[#21c55e] rounded-md text-white text-sm font-medium font-['Inter'] leading-normal"
        >
          {isConnected ? "Donate Now" : "Connect MetaMask"}
        </Button>
      </div>
    </div>
  );
};

export default DonationPage;
