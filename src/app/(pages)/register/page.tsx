import React from "react";
import RegisterForm from "./components/RegisterForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <section>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <RegisterForm />
        <div className="text-sm pl-1 mt-2">
        <p>
          Already have an account? <span className="text-pink"><Link href={'/login'}>Log In</Link></span>
        </p>
      </div>
      </div>
      
    </section>
  );
};

export default RegisterPage;
