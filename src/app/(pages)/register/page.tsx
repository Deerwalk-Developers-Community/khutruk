import React from "react";
import RegisterForm from "./components/RegisterForm";

const RegisterPage = () => {
  return (
    <section>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <RegisterForm />
      </div>
      <div className="text-sm">
        <p>
          New to Khutruke? <span className="text-pink"></span>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
