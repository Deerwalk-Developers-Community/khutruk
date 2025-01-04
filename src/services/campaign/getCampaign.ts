import { contractAddress } from "@/AddressABI/contractAddress";
import { DisasterRelifCampaignABI } from "@/AddressABI/DisasterRelifCampaign";
import { ethers } from "ethers"

export const getCampaign = async (campaignId:any)=>{ 
    try {
        if (typeof window !== "undefined" && window.ethereum) {
            console.log(window.ethereum);
        const provider = new ethers.BrowserProvider(window.ethereum); 
        const signer = await provider.getSigner(); 
        const DisasterRelifCampaignContract= new ethers.Contract( 
            contractAddress.address, 
            DisasterRelifCampaignABI, 
            signer
        ); 

        const campaign = await DisasterRelifCampaignContract.getCampaign(campaignId); 
        console.log("Campaign details", campaign);

        

    }
}catch (err:any){
    console.error("Error fetching campaign", err); 
}
};