require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://rpc.sepolia.org", // Public Sepolia RPC endpoint
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
