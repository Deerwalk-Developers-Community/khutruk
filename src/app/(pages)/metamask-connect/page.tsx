"use client";
import ConnectWalletButton from "@/components/metamask/ConnectWalletButton";
import { MetaMaskProvider } from "@metamask/sdk-react";
import React from "react";

const MetaMaskConnectPage = () => {
  const host =
    typeof window !== "undefined" ? window.location.host : "defaultHost";

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Next-Metamask-Boilerplate",
      url: host, // using the host constant defined above
    },
  };

  return (
    <div>
      <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
        <ConnectWalletButton />
      </MetaMaskProvider>
    </div>
  );
};

export default MetaMaskConnectPage;
