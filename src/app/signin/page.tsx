import { readCurrentUser } from "../utils/default/read";
import SignInForm from "./components/SignInForm";

export default async function SignIn() {
  const { currentUser, currentUserError } = await readCurrentUser();

  return (
    <SignInForm currentUser={currentUser} currentUserError={currentUserError} />
  );
}
