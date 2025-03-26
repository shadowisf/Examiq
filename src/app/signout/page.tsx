"use client";

import { useEffect, useState, useTransition } from "react";
import { signOut } from "./actions";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function SignOut() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState("");

  async function handleSignOut() {
    startTransition(async () => {
      const result = await signOut();

      if (result?.error) {
        setError(result.error.message);
      }

      router.push("/");
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
