"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { signOut } from "../actions";
import ErrorMessage from "@/app/components/ErrorMessage";
import Loading from "@/app/components/Loading";

export default function SignOutScreen() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState("");

  async function handleSignOut() {
    startTransition(async () => {
      const result = await signOut();

      if (result?.error) {
        setError(result.error.message);
      }

      router.replace("/");
      router.refresh();
    });
  }

  useEffect(() => {
    handleSignOut();
  }, []);

  return (
    <main>
      {isPending && <Loading />}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </main>
  );
}
