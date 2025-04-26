import { redirect } from "next/navigation";
import SignOutScreen from "./components/SignOutScreen";
import { readCurrentUser } from "../utils/default/readEntities";

export default async function SignOut() {
  const { currentUser, currentUserError } = await readCurrentUser();

  if (!currentUser?.user || currentUserError) {
    redirect("/");
  }

  return <SignOutScreen />;
}
