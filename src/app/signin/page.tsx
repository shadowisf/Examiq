import InfoMessage from "../components/InfoMessage";
import { readCurrentUser } from "../utils/default/read";
import SignInForm from "./components/SignInForm";
import Link from "next/link";

export default async function SignIn() {
  const { currentUser, currentUserError } = await readCurrentUser();

  return (
    <SignInForm currentUser={currentUser} currentUserError={currentUserError} />
  );
}
