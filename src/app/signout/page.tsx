"use client";

import { signOut } from "./actions";

export default function SignOut() {
  signOut();

  return <div className="signout-page" />;
}
