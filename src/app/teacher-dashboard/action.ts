"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export async function updateDisplayName(formData: FormData) {
  const supabase = await createClient();

  const data = {
    display_name: formData.get("display_name") as string,
  };

  const { error } = await supabase.auth.updateUser({
    data,
  });

  if (error) {
    redirect(`/teacher-dashboard?error=${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/teacher-dashboard");
}

export async function retrieveDataForTeacher() {
  const supabase = await createClient();

  const { data: currentUser, error: currentUserError } =
    await supabase.auth.getUser();
  if (currentUserError || !currentUser?.user) {
    redirect("/");
  }

  const { data: courses, error: courseError } = await supabase
    .from("courses")
    .select("*");

  return { currentUser, currentUserError, courses, courseError };
}

export async function handleCreateCourse(formData: FormData) {
  function generateIdentifier() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return "C-" + result;
  }

  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getUser();

  const id = generateIdentifier();
  const course_name = formData.get("course name") as string;

  const { error } = await supabase
    .from("courses")
    .insert([{ id: id, name: course_name, author: currentUser.user?.id }])
    .select();

  if (error) {
    redirect(`/teacher-dashboard?error=${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/teacher-dashboard");
}
