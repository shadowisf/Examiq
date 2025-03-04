"use client";

import { useState } from "react";
import { signin } from "./actions";

export default function SignIn() {
  const [error, setError] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === " ") {
      event.preventDefault();
    }
  };

  return (
    <main className="login-page">
      <section className="text-container">
        <h1>welcome back</h1>
        <p>sign in to your account</p>
      </section>

      <form className="input-container">
        <input
          id="email"
          name="email"
          type="email"
          onKeyDown={handleKeyDown}
          placeholder="email"
          required
        />
        <input
          id="password"
          name="password"
          type="password"
          onKeyDown={handleKeyDown}
          placeholder="password"
          required
        />

        <br />

        <p style={{ color: "red" }}>{error}</p>

        <br />

        <button formAction={signin}>sign in</button>
      </form>
    </main>
  );
}
