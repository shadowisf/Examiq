"use server";

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export async function readCurrentUser() {
  const supabase = await createClient();

  const { data: currentUser, error: currentUserError } =
    await supabase.auth.getUser();

  if (currentUserError || !currentUser?.user) {
    redirect("/");
  }

  return {
    currentUser,
    currentUserError,
  };
}
