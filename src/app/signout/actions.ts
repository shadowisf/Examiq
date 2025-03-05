import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";

export async function handleSignOut() {
  const supabase = createClient();
  const router = useRouter();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect(`signout?=error${error.code}`);
  }

  router.push("/");
  router.refresh();
}
