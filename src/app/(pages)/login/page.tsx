"use client";
import React from "react";
import LoginForm from "./components/LoginForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <section>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-center text-2xl font-bold mb-6">Khutruke</h2>
        <LoginForm />
        <div className="text-sm mt-2 pl-1">
          <p>
            New to Khutruke?
            <span className="text-pink">
              <Link href={"/register"}> Create an Account</Link>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
