"use client";

import { useEffect, useState } from "react";
import { signIn } from "./actions";
import { useSearchParams } from "next/navigation";
import ErrorMessage from "../components/ErrorMessage";

export default function SignIn() {
  const searchParams = useSearchParams();

  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const errorMessage = searchParams.get("error");
    const userType = searchParams.get("user");

    if (errorMessage) {
      setError(errorMessage);
    }

    if (userType) {
      setUserType(userType);
    }
  }, [searchParams]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === " ") {
      event.preventDefault();
    }
  }

  return (
    <main className="signin-page">
      <section className="text-container">
        <h1 className="big">welcome back</h1>
        <p className="gray">
          sign in to your account as a <span>{userType}</span>
        </p>
      </section>

      <form action={(formData) => signIn({ formData, userType })}>
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

        <ErrorMessage message={error} />

        <br />

        <button type="submit">sign in</button>
      </form>
    </main>
  );
}
