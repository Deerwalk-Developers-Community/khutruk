import { contractAddress } from "@/AddressABI/contractAddress";
import { DisasterRelifCampaignABI } from "@/AddressABI/DisasterRelifCampaign";
import { ethers } from "ethers";

const requestWithdrawal = async (campaignId:any, amount:any, reason:string)=>{
    try{
         if (typeof window !== "undefined" && window.ethereum) {
              console.log(window.ethereum);
              const provider = new ethers.BrowserProvider(window.ethereum);
              const signer = await provider.getSigner();
              const DisasterRelifCampaignContract = new ethers.Contract(
                contractAddress.address, 
                DisasterRelifCampaignABI, 
                signer
              );

              const tx= await DisasterRelifCampaignContract.requestWithdrawal(
                campaignId, 
                ethers.parseEther(amount.toString()), 
                reason
              );

              console.log("transcation hash: ", tx.hash);
              const receipt = await tx.wait() ; 
              console.log("contract receipt : ", receipt); 
    }
}catch(err:any){ 
    console.error("Withdrawal request error : ", err); 
}
}