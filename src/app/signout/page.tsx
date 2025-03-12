"use client";

import { useEffect } from "react";
import { signOut } from "./actions";

export default function SignOut() {
  useEffect(() => {
    signOut();
  }, []);

  return "";
}
