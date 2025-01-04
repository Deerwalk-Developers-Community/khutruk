"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createCampaign } from "@/services/campaign/createCampaign";
import { saveCampaignToBackend } from "@/domain/repositories/campaignRepository";
import { pinata } from "@/utils/ipfsConfig";
import { BASE_API_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  email: string;
  name: string;
  walletAddress: string;
};

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

  const token = localStorage.getItem("user");
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
        setUser(data.user);
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
        const url = "https://gateway.pinata.cloud/ipfs/" + upload.IpfsHash;
        setIpfsHash(url);
        console.log("Image uploaded successfully!");
      } catch (error) {
        console.error(error);
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
      console.log(data);
      // Create campaign on blockchain
      const blockchainResponse = await createCampaign({
        title: data.title,
        description: data.description,
        targetAmount: data.targetAmount,
      });
      console.log("Blockchain response:", blockchainResponse);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Create a Campaign
        </h1>
        {loading && (
          <div className="text-center text-gray-500">
            Loading... Please wait.
          </div>
        )}

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
                <label className="block mb-2 font-medium">Location</label>
                <select
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="w-full p-2 mb-4 border rounded-md"
                >
                  <option value="">Select a location</option>
                  <option value="KATHMANDU">Kathmandu</option>
                  <option value="POKHARA">Pokhara</option>
                </select>
                {errors.location && (
                  <p className="text-red-500 text-sm">
                    {errors.location.message as string}
                  </p>
                )}

                <label className="block mb-2 font-medium">Category</label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="w-full p-2 mb-4 border rounded-md"
                >
                  <option value="">Select a category</option>
                  <option value="EDUCATION">Education</option>
                  <option value="RELIGION">Religion</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message as string}
                  </p>
                )}

                <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="block mb-2 font-medium">Title</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="Campaign title"
                  className="w-full p-2 mb-4 border rounded-md"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">
                    {errors.title.message as string}
                  </p>
                )}

                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  placeholder="Campaign description"
                  className="w-full p-2 mb-4 border rounded-md"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message as string}
                  </p>
                )}

                <label className="block mb-2 font-medium">Cover Image</label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="mb-4"
                />
                {ipfsHash && (
                  <p className="text-green-500 text-sm">
                    Image uploaded successfully!
                  </p>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleBack}
                    className="bg-gray-300 py-2 px-4 rounded-md"
                  >
                    Back
                  </button>
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="block mb-2 font-medium">Target Amount</label>
                <input
                  type="number"
                  {...register("targetAmount", {
                    required: "Target amount is required",
                  })}
                  className="w-full p-2 mb-4 border rounded-md"
                />
                {errors.targetAmount && (
                  <p className="text-red-500 text-sm">
                    {errors.targetAmount.message as string}
                  </p>
                )}

                <button
                  onClick={handleBack}
                  className="bg-gray-300 py-2 px-4 rounded-md"
                >
                  Back
                </button>
                <button className="w-full mt-4 bg-green text-white py-2 rounded-md hover:bg-green">
                  Submit
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default CampaignForm;
