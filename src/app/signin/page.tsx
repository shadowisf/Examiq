import { redirect } from "next/navigation";
import { readCurrentUser } from "../utils/default/read";
import SignInForm from "./components/SignInForm";

export default async function SignIn() {
  const { currentUser, currentUserError } = await readCurrentUser();

  if (!currentUser?.user || currentUserError) {
    redirect("/");
  }

  return <SignInForm />;
}
