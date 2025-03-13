import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";

export async function signOut() {
  const router = useRouter();

  const supabase = createClient();

  await supabase.auth.signOut();

  router.push("/");
  router.refresh();
}
