"use client";

import { useEffect, useState } from "react";
import { signIn } from "./actions";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();

  const [error, setError] = useState("");

  useEffect(() => {
    const errorMessage = searchParams.get("error");

    if (errorMessage) {
      setError(errorMessage);
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
        <p className="gray">sign in to your account</p>
      </section>

      <form action={signIn}>
        <select name="role" defaultValue={"student"}>
          <option value="student">student</option>
          <option value="teacher">teacher</option>
          <option value="admin">admin</option>
        </select>
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

        <p style={{ color: "red" }}>{error}</p>

        <br />

        <button type="submit">sign in</button>
      </form>
    </main>
  );
}
