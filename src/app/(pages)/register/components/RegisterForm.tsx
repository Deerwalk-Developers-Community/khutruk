"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "@/domain/repositories/authRepository";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
};

const RegisterForm = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>();
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (
    data: RegisterFormInputs
  ) => {
    try {
      const token = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      window.localStorage.setItem("user", token);
    } catch (error) {
      console.error("Error: ", error);
    }
    console.log("pass");
    toast({
      title: "Logged in successfully...",
    });
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 w-80 border-2 p-5 rounded-md"
      >
      <div>
          <label htmlFor="name">Name</label>
          <Input
            type="text"
            placeholder="Name"
            {...register("name", {
              required: "Name is required",
            })}
          />
          {errors.name && (
            <p className="text-red text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-green hover:bg-green hover:opacity-80"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
