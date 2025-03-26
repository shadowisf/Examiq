"use client";

import { useEffect, useState, useTransition } from "react";
import { signIn } from "./actions";
import { redirect, useSearchParams } from "next/navigation";
import Image from "next/image";
import ErrorMessage from "../components/ErrorMessage";
import BigLogo from "../components/BigLogo";
import Loading from "../components/Loading";

export default function SignIn() {
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const userTypeFromParams = searchParams.get("user");

    if (userTypeFromParams) {
      setUserType(userTypeFromParams);
    }
  }, [searchParams]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === " ") {
      event.preventDefault();
    }
  }

  async function handleSignIn(formData: FormData) {
    startTransition(async () => {
      const result = await signIn(formData, userType);

      if (result?.error) {
        setError(result.error.message);
      } else {
        redirect("/dashboard");
      }
    });
  }

  return (
    <>
      {isPending && <Loading />}

      <main className="signin-page">
        <section className="text-container">
          <BigLogo />

          <div>
            <h1 className="big">welcome back</h1>
            <p className="gray">
              sign in to your account as a <span>{userType}</span>
            </p>
          </div>
        </section>

        <form action={handleSignIn}>
          <input
            name="email"
            type="email"
            onKeyDown={handleKeyDown}
            placeholder="email"
            required
          />
          <input
            name="password"
            type="password"
            onKeyDown={handleKeyDown}
            placeholder="password"
            required
          />

          <br />

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <br />

          <button type="submit">
            <Image
              src={"/icons/check.svg"}
              alt="confirm"
              width={24}
              height={24}
            />
          </button>
        </form>
      </main>
    </>
  );
}
