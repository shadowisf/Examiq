"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server";

export async function signIn(formData: FormData, userType: string) {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data: userData, error: userError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (userError) {
      throw new Error(userError.message);
    }

    if (userData.user.user_metadata.role !== userType && userType !== "admin") {
      const { error: authError } = await supabase.auth.signOut();

      if (authError) {
        throw new Error(authError.message);
      }

      throw new Error("user not found");
    }

    revalidatePath("/signin", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}
