"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createCampaign } from "@/services/campaign/createCampaign";
import { saveCampaignToBackend } from "@/domain/repositories/campaignRepository";
import { pinata } from "@/utils/ipfsConfig";
import { BASE_API_URL } from "@/lib/constants";

type User = {
  id: string;
  email: string;
  name: string;
  walletAddress: string;
}

const CampaignForm = () => {
  const [user, setUser] = useState<User>();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = localStorage.getItem("user")
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}retrieve-users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data.user)
        console.log(data.user);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    if (token) {
      fetchPosts();
    }
  }, [token]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const upload = await pinata.upload.file(file);
        const url = "https://gateway.pinata/cloud/ipfs/" + upload.IpfsHash;
        setIpfsHash(url);
        console.log("Image uploaded successfully!");
      } catch (error) {
        console.error(error);
        console.log("Failed to upload image.");
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmitStep1 = (data: any) => setStep(2);
  const onSubmitStep2 = (data: any) => setStep(3);

  const onSubmitStep3 = async (data: any) => {
    try {
      setLoading(true);

      // Create campaign on blockchain
      const blockchainResponse = await createCampaign({
        title: data.title,
        description: data.description,
        targetAmount: data.targetAmount,
      });

      // Save campaign to backend
      const finalData = {
        ...data,
        creatorId: user?.id,
        mediaUrls: ipfsHash,
        campaignAddress: blockchainResponse?.campaignAddress,
      };
      await saveCampaignToBackend(finalData);

      alert("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setStep((prevStep) => prevStep - 1);



  return (
    <div>
      <h1>Create a Campaign</h1>
      {loading && <div>Loading... Please wait.</div>}

      {!loading && (
        <form
          onSubmit={handleSubmit(
            step === 1
              ? onSubmitStep1
              : step === 2
              ? onSubmitStep2
              : onSubmitStep3
          )}
        >
          {step === 1 && (
            <div>
              <label>Location</label>
              <select
                {...register("location", { required: "Location is required" })}
              >
                <option value="">Select a location</option>
                <option value="KATHMANDU">Kathmandu</option>
                <option value="POKHARA">Pokhara</option>
              </select>
              {errors.location && <p>{errors.location.message as string}</p>}

              <label>Category</label>
              <select
                {...register("category", { required: "Category is required" })}
              >
                <option value="">Select a category</option>
                <option value="EDUCATION">Education</option>
                <option value="RELIGION">RELIGION</option>
              </select>
              {errors.category && <p>{errors.category.message as string}</p>}

              <button type="submit">Next</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <label>Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                placeholder="Campaign title"
              />
              {errors.title && <p>{errors.title.message as string}</p>}

              <label>Description</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                placeholder="Campaign description"
              />
              {errors.description && <p>{errors.description.message as string}</p>}

              <label>Cover Image</label>
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
              />
              {ipfsHash && <p>Image uploaded to IPFS: {ipfsHash}</p>}

              <button type="button" onClick={handleBack}>
                Back
              </button>
              <button type="submit">Next</button>
            </div>
          )}

          {step === 3 && (
            <div>
              <label>Target Amount</label>
              <input
                type="number"
                {...register("targetAmount", {
                  required: "Target amount is required",
                })}
                placeholder="Target amount in ETH"
              />
              {errors.targetAmount && <p>{errors.targetAmount.message as string}</p>}

              <button type="button" onClick={handleBack}>
                Back
              </button>
              <button type="submit">Submit</button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default CampaignForm;
