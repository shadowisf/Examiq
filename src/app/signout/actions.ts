import { createClient } from "../utils/supabase/client";

export async function signOut() {
  try {
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signOut();

    if (authError) {
      throw new Error(authError.message);
    }
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}
