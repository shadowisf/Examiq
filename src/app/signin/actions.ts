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

    if (userType !== "admin" && userData.user) {
      const { data: roleData } = await supabase
        .from(userType)
        .select("id")
        .eq("id", userData.user?.id)
        .single();

      if (!roleData) {
        const { error: authError } = await supabase.auth.signOut();

        if (authError) {
          throw new Error(authError.message);
        }

        throw new Error("User not found");
      }
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}
