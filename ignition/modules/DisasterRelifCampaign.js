const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const fs = require("fs");

module.exports = buildModule("DisasterRelifCampaignModule", (m) => {
  const DisasterRelifCampaignContract = m.contract("DisasterRelifCampaign");

  // Save the contract address to a JSON file after deployment
  const contractAddress = DisasterRelifCampaignContract.address;
  fs.writeFileSync(
    "./src/AddressABI/contractAddress.json",
    JSON.stringify({ address: contractAddress }, null, 2)
  );

  console.log("Contract deployed at:", contractAddress);

  return { DisasterRelifCampaignContract };
});
