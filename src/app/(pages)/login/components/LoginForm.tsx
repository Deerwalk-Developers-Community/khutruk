"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/domain/repositories/authRepository";
import { useToast } from "@/hooks/use-toast";
import Link  from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { toast } = useToast();
  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  // const onSubmit: SubmitHandler<LoginFormInputs> = async (
  //   data: LoginFormInputs
  // ) => {
  //   try {
  //     const token = await login({ email: data.email, password: data.password });
  //     window.localStorage.setItem("user", token);
  //   } catch (error) {
  //     console.error("Error: ", error);
  //   }
  //   console.log("pass");
  //   toast({
  //     title: "Logged in successfully...",
  //   });
  // };
  return (
    <div>
      <form
        className="flex flex-col gap-5 w-80 border-2 p-5 rounded-md"
      >
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

        <Link href="/api/auth/login">
          <Button
          
            disabled={isSubmitting}
            className="bg-green hover:bg-green hover:opacity-80"
          >
            {isSubmitting ? "Logging In..." : "Log In"}
          </Button>
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
