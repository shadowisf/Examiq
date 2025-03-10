"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export async function handleSignIn(formData: FormData) {
  const supabase = await createClient();

  const inputData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const inputRole = formData.get("role") as string;

  const { data: userData, error: userError } =
    await supabase.auth.signInWithPassword(inputData);

  if (userError) {
    redirect(`/signin?error=${userError.message}`);
  }

  const role = await supabase
    .from(inputRole)
    .select("id")
    .eq("id", userData.user?.id)
    .single();

  if (!role) {
    redirect(`/signin?error=user not found`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
