"use server";

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { generateIdentifier } from "../utils/supabase/client";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// ADMIN
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

// TEACHER
export async function createCourse(formData: FormData, students: string[]) {
  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("course")
    .insert([
      {
        id: generateIdentifier("C"),
        name: formData.get("course name") as string,
        description: formData.get("course description") as string,
        author: currentUser.user?.id,
        students: { uid: students },
      },
    ])
    .select();

  if (error) {
    redirect(`/dashboard?error=${error.message}`);
  }

  revalidatePath("/", "layout");

  return "ok";
}

export async function updateCourse(
  formData: FormData,
  id: string,
  students: string[]
) {
  const supabase = await createClient();

  const inputData = {
    name: formData.get("course name") as string,
    description: formData.get("course description") as string,
    students: { uid: students },
  };

  const { error } = await supabase
    .from("course")
    .update(inputData)
    .eq("id", id);

  if (error) {
    redirect(`/dashboard?error=${error.message}`);
  }

  revalidatePath("/", "layout");
}

export async function deleteCourse(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("course").delete().eq("id", id);

  if (error) {
    redirect(`/dashboard?error=${error.message}`);
  }

  revalidatePath("/", "layout");
}
