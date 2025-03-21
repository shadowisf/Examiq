import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";

export async function signOut() {
  try {
    const router = useRouter();
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signOut();

    if (authError) {
      throw new Error(authError.message);
    }

    router.push("/");
    router.refresh();
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}
