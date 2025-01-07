"use client";
import React from "react";
import { useSession } from "next-auth/react";
import RegisterForm from "@/components/forms/RegistrationForm";
import UserUpdateForm from "@/components/forms/UserUpdateForm";
import { useRouter } from "next/navigation";

export default function Update() {
  const { data: session, status } = useSession();
  const router = useRouter()

  if (status === "unauthenticated") {
    router.push('/login')
  }
  return (
    <>
      {status === "authenticated" &&
        <UserUpdateForm />
      }
    </>
  );
}