"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createCampaign } from "@/services/campaign/createCampaign";
import { saveCampaignToBackend } from "@/domain/repositories/campaignRepository";
import { pinata } from "@/utils/ipfsConfig";
import { BASE_API_URL } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

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
    watch,
  } = useForm();

  const watchLocation = watch("location");
  const watchCategory = watch("category");

  const onSubmitStep1 = async (data: any) => {
    console.log("step1", data);
    setStep(2);
  };

  const onSubmitStep2 = async (data: any) => {
    console.log("step2", data);
    setStep(3);
  };

  const onSubmitStep3 = async (data: any) => {
    console.log("step3", data);
    setLoading(true);
    try {
      const res = await createCampaign(data);
      console.log("res", res);
      if (res) {
        // navigate("/");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

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
        console.log("Failed to upload image.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[588px] relative bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="h-8 px-3 py-1.5 bg-gray-200 inline-flex items-center">
          <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight">
            Step {step}:
          </div>
        </div>
        <div className="w-full p-6">
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
              <>
                <div className="text-slate-900 text-sm font-normal font-['Inter'] leading-tight mb-6">
                  Create Project Overview
                </div>
                <div className="mb-6">
                  <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-1.5">
                    Where will the fund go?
                  </div>
                  <div className="relative">
                    <select
                      {...register("location", {
                        required: "Location is required",
                      })}
                      className="w-full pl-3 pr-10 py-2 bg-white rounded-md border border-slate-300 text-slate-900 text-sm font-normal font-['Inter'] leading-tight appearance-none"
                    >
                      <option value="">Select a location</option>
                      <option value="POKHARA">Pokhara</option>
                      <option value="KATHMANDU">Kathmandu</option>
                      <option value="JHAPA">Jhapa</option>
                      <option value="DHARAN">Dharan</option>
                      <option value="CHITWAN">Chitwan</option>
                      <option value="BIRATNAGAR">Biratnagar</option>
                      <option value="ITHARI">Ithari</option>
                      <option value="BHOJPUR">Bhojpur</option>
                      <option value="DHADING">Dhading</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.location.message as string}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-1.5">
                    Zip Code
                  </div>
                  <input
                    {...register("zipCode", {
                      required: "Zip Code is required",
                    })}
                    className="w-full pl-3 pr-3 py-2 bg-white rounded-md border border-slate-300 text-slate-900 text-sm font-normal font-['Inter'] leading-tight"
                    placeholder="Enter Zip Code"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.zipCode.message as string}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-1.5">
                    Select a Category for your Fund Raising
                  </div>
                  <div className="relative">
                    <select
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className="w-full pl-3 pr-10 py-2 bg-white rounded-md border border-slate-300 text-slate-900 text-sm font-normal font-['Inter'] leading-tight appearance-none"
                    >
                      <option value="">Select a category</option>
                      <option value="ANIMAL">Animal</option>
                      <option value="EDUCATION">Education</option>
                      <option value="MEDICAL">Medical</option>
                      <option value="RELIGION">Religion</option>
                      <option value="ENVIRONMENT">Environment</option>
                      <option value="DISASTER">Disaster</option>
                      <option value="EMERGENCY">Emergency</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category.message as string}
                    </p>
                  )}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="text-slate-900 text-sm font-normal font-['Inter'] leading-tight mb-6">
                  Introduction to your Campaign
                </div>
                <div className="mb-6">
                  <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-1.5">
                    Project Name
                  </div>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className="w-full pl-3 pr-3 py-2 bg-white rounded-md border border-slate-300 text-slate-900 text-sm font-normal font-['Inter'] leading-tight"
                    placeholder="Enter Project Name"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title.message as string}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-1.5">
                    Project Description
                  </div>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className="w-full pl-3 pr-3 py-2 bg-white rounded-md border border-slate-300 text-slate-900 text-sm font-normal font-['Inter'] leading-tight"
                    placeholder="Give a brief introduction to your cause."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description.message as string}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-1.5">
                    Add a Thumbnail image
                  </div>
                  <div className="w-full h-[121px] bg-[#bbf6d0] rounded-[9px] flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      id="thumbnail"
                    />
                    <label
                      htmlFor="thumbnail"
                      className="text-slate-900 text-sm font-normal font-['Inter'] leading-tight cursor-pointer"
                    >
                      Upload your Image
                    </label>
                  </div>
                  {ipfsHash && (
                    <p className="text-green-500 text-xs mt-1">
                      Image uploaded successfully!
                    </p>
                  )}
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="text-slate-900 text-sm font-normal font-['Inter'] leading-tight mb-6">
                  Your Estimated Goal
                </div>
                <div className="mb-6">
                  <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-1.5">
                    In NPR
                  </div>
                  <div className="relative">
                    <input
                      {...register("targetAmount", {
                        required: "Target Amount is required",
                      })}
                      className="w-full pl-10 pr-3 py-2 bg-white rounded-md border border-slate-300 text-slate-900 text-sm font-normal font-['Inter'] leading-tight"
                      placeholder="Enter Target Amount"
                      type="number"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-900 text-sm font-normal font-['Inter'] leading-tight">
                      RS.
                    </span>
                  </div>
                  {errors.targetAmount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.targetAmount.message as string}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight mb-1.5">
                    Deadline
                  </div>
                  <input
                    {...register("deadline", {
                      required: "Deadline is required",
                    })}
                    type="date"
                    className="w-full pl-3 pr-3 py-2 bg-white rounded-md border border-slate-300 text-slate-900 text-sm font-normal font-['Inter'] leading-tight"
                  />
                  {errors.deadline && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.deadline.message as string}
                    </p>
                  )}
                </div>
                <div className="mb-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("acceptTerms", {
                      required: "You must accept the terms and conditions",
                    })}
                    className="w-3.5 h-3.5 rounded-sm border border-gray-200"
                  />
                  <label className="text-black text-sm font-medium font-['Inter'] leading-[14px]">
                    Accept terms and condition
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-xs mb-4">
                    {errors.acceptTerms.message as string}
                  </p>
                )}
              </>
            )}
            <button
              type="submit"
              className="w-full h-10 px-4 py-2 bg-[#49de7f] rounded-md text-white text-sm font-medium font-['Inter'] leading-normal hover:bg-[#3ac76a] transition-colors"
            >
              {step === 3 ? "Submit" : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignForm;
