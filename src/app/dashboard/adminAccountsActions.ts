"use server";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createAccount(formData: FormData) {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );

  const role = formData.get("role") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: authUserData, error: authUserError } =
    await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: {
        display_name: name,
        role: role,
      },
      email_confirm: true,
    });

  const { error: tableUserError } = await supabase
    .from(role)
    .insert([{ id: authUserData.user?.id, name: name }]);

  if (authUserError) {
    redirect(`/dashboard?error=${authUserError.message}`);
  }

  if (tableUserError) {
    redirect(`/dashboard?error=${tableUserError.message}`);
  }

  revalidatePath("/", "layout");
}
