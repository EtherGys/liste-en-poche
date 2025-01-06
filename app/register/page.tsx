"use client";
import React from "react";
import { useSession } from "next-auth/react";
import RegisterForm from "@/components/forms/RegistrationForm";


export default function RegistrationPage() {
  const { data: session, status } = useSession();
  






  return (
    <>
      {status === "authenticated" ? (
        <div className="flex flex-col min-h-screen items-center justify-start sm:justify-center p-16">
          <img
            src={"/pictos/PictoConnected.png"}
            alt="Valid"
            className="object-contain h-24 w-24 lg:h-28 cursor-pointer mt-6 md:-mt-20 mb-10"
          />
          <div className="text-4xl text-darkGray text-center justify-center font-semibold mb-10">
            Connecté
          </div>
     
        </div>
      ) : (
        <RegisterForm />
      )}
    </>
  );
}