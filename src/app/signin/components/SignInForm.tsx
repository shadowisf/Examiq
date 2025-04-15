"use client";

import BigLogo from "@/app/components/BigLogo";
import ErrorMessage from "@/app/components/ErrorMessage";
import Loading from "@/app/components/Loading";
import { useSearchParams, redirect, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { signIn } from "../actions";
import Image from "next/image";
import InfoMessage from "@/app/components/InfoMessage";
import Link from "next/link";

type SignInFormProps = {
  currentUser: any;
  currentUserError: any;
};

export default function SignInForm({
  currentUser,
  currentUserError,
}: SignInFormProps) {
  const path = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");

  const role = currentUser?.user?.user_metadata?.role ?? "guest";
  const displayName = currentUser?.user?.user_metadata?.display_name ?? "";
  const firstName = displayName ? displayName.split(" ")[0] : "";

  useEffect(() => {
    const userTypeFromParams = searchParams.get("user");

    if (userTypeFromParams) {
      setUserType(userTypeFromParams);
    }
  }, [searchParams]);

  useEffect(() => {
    if (path === "/signin" && searchParams.toString() === "") {
      redirect("/");
    }
  }, [path, searchParams]);

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
        {!currentUser?.user || currentUserError ? (
          <>
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
                autoComplete="username"
                required
              />
              <input
                name="password"
                type="password"
                onKeyDown={handleKeyDown}
                placeholder="password"
                autoComplete="current-password"
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
          </>
        ) : (
          <>
            <h1>
              you are already signed in as{" "}
              <span>
                {role} {firstName}
              </span>
            </h1>

            <h1>
              <Link href={"/dashboard"}>click here to go to dashboard</Link>
            </h1>

            <InfoMessage>
              or use the navigation buttons on the top right
            </InfoMessage>
          </>
        )}
      </main>
    </>
  );
}
