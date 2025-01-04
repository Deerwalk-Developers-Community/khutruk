import { contractAddress } from "@/AddressABI/contractAddress";
import { DisasterRelifCampaignABI } from "@/AddressABI/DisasterRelifCampaign";
import { ethers } from "ethers";

const donate = async (campaignId:any, donationAmount:number) => { 
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

              const tx = await DisasterRelifCampaignContract.donate(
                campaignId, {
                    value:ethers.parseEther(donationAmount.toString()),
                }
              )
              console.log("donation transaction hash: ", tx.hash); 
              const receipt = await tx.await() ; 
              console.log("donation successful"); 

    }
}catch(err:any){ 
    console.log("error donating", err); 
}
}