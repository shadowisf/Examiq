"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

type signInProps = {
  formData: FormData;
  userType: string;
};

export async function signIn({ formData, userType }: signInProps) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: userData, error: userError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (userError) {
    redirect(`/signin?error=${userError.message}`);
  }

  if (userType !== "admin") {
    const { data: roleData } = await supabase
      .from(userType)
      .select("id")
      .eq("id", userData.user?.id)
      .single();

    if (!roleData) {
      await supabase.auth.signOut();
      redirect(`/signin?error=User not found`);
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
