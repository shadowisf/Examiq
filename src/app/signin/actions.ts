"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export async function handleSignIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const { data: userData, error: userError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (userError) {
    redirect(`/signin?error=${userError.message}`);
  }

  if (role !== "admin") {
    const { data: roleData } = await supabase
      .from(role)
      .select("id")
      .eq("id", userData.user?.id)
      .single();

    if (!roleData) {
      redirect(`/signin?error=User not found`);
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
