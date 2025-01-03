"use client";
import { useSDK } from "@metamask/sdk-react";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { formatAddress } from "@/lib/utils";
import { BASE_API_URL } from "@/lib/constants";

const ConnectWalletButton = () => {
  const { sdk, connected, connecting, account } = useSDK();
  const [hasSentToBackend, setHasSentToBackend] = useState(false);

  const connect = async () => {
    try {
      await sdk?.connect();
      console.log(account);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
    setHasSentToBackend(false);
  };

  console.log(account);

  useEffect(() => {
    const sendAccountToBackend = async () => {
      if (account && !hasSentToBackend) {
        try {
          const response = await fetch(`${BASE_API_URL}/connect-metamask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account }),
          });

          if (!response.ok) {
            console.error("Failed to send account to backend.");
          }
          console.log("Account sent to backend successfully!", account);
          setHasSentToBackend(true);
        } catch (error) {
          console.error("Error sending account to backend:", error);
        }
      }
    };

    sendAccountToBackend();
  }, [account, hasSentToBackend]);

  return (
    <div>
      {account ? (
        <Popover>
          <PopoverTrigger>
            <Button>{formatAddress(account)}</Button>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
            <button
              onClick={disconnect}
              className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
            >
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
