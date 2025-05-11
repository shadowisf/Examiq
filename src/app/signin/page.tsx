import { Suspense } from "react";
import { readCurrentUser } from "../utils/default/readEntities";
import SignInForm from "./components/SignInForm";

export default async function SignIn() {
  const { currentUser, currentUserError } = await readCurrentUser();

  return (
    <Suspense fallback={<div />}>
      <SignInForm
        currentUser={currentUser}
        currentUserError={currentUserError}
      />
    </Suspense>
  );
}
