import { contractAddress } from "@/AddressABI/contractAddress";
import { DisasterRelifCampaignABI } from "@/AddressABI/DisasterRelifCampaign";
import { ethers } from "ethers";

const requestWithdrawal = async (campaignId:any, requestIndex:any)=> { 
    try{ 
         if (typeof window !== "undefined" && window.ethereum) {
              console.log(window.ethereum);
              const provider = new ethers.BrowserProvider(window.ethereum);
              const signer = await provider.getSigner();
              const DisasterRelifCampaignContract = new ethers.Contract(
                contractAddress.address, 
                DisasterRelifCampaignABI ,
                signer
              ); 

              const tx = await DisasterRelifCampaignContract.releaseWithdrawal(
                campaignId, 
                requestIndex
              ); 
              console.log("req withdrawal transaction hash", tx.hash); 
              const receipt = await tx.wait(); 
              console.log("req withdrawal transcation receipt ", receipt)

    }
    
}catch(err:any){
    console.error("error while releasing withdrawal", err); 
 }
}