"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pinata } from "@/utils/ipfsConfig";
import React, { useState } from "react";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleIPFSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    try {
      console.log("entry");

      const fileData = new FormData();
      fileData.append("file", file);

      const upload = await pinata.upload.file(file);
      console.log(upload);
      const url = "https://gateway.pinata/cloud/ipfs/" + upload.IpfsHash;
    } catch (err) {
      console.error("Error while uploading file", err);
    }
  };

  return (
    <div>
      <Input
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFile(e.target.files?.[0] ?? null)
        }
      />
      <Button type="submit" onClick={handleIPFSSubmit}>
        Upload to IPFS
      </Button>
    </div>
  );
};

export default Page;
