'use client'
import { useSession } from "next-auth/react";
import Image from "next/image";
import NewListForm from "@/components/forms/NewListForm";
import { useRouter } from "next/navigation";


export default function Create() {
  const { data: session, status } = useSession();
  const router = useRouter()

  if (status === "unauthenticated") {
    router.push('/login')
  }
  return (
    <>
      {status === "authenticated" &&
        <NewListForm />
      }
    </>
  );
}
