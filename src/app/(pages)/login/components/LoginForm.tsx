import { Input } from "@/components/ui/input";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const onSubmit: SubmitHandler<LoginFormInputs> = () => {
    console.log("pass");
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-72">
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
      </form>
    </div>
  );
};

export default LoginForm;
