"use client";

import { useEffect, useState } from "react";
import { signIn } from "./actions";
import { redirect, useSearchParams } from "next/navigation";
import Image from "next/image";
import ErrorMessage from "../components/ErrorMessage";
import BigLogo from "../components/BigLogo";

export default function SignIn() {
  const searchParams = useSearchParams();

  const [userType, setUserType] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const userTypeFromParams = searchParams.get("user");

    if (userTypeFromParams) {
      setUserType(userTypeFromParams);
    }
  }, [searchParams]);

  async function handleSubmit(formData: FormData) {
    const result = await signIn(formData, userType);

    if (result?.error) {
      setAuthError(result.error.message);
    } else {
      redirect("/dashboard");
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === " ") {
      event.preventDefault();
    }
  }

  return (
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

      <form action={handleSubmit}>
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

        {authError && <ErrorMessage>{authError}</ErrorMessage>}

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
  );
}
