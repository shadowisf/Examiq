"use client";

import { useLoader } from "../components/Loader";
import { signOut } from "./actions";

export default function SignOut() {
  const { showLoader, hideLoader } = useLoader();

  showLoader();

  signOut();

  hideLoader();

  return "";
}
