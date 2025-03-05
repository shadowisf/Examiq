"use server";

import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateIdentifier(prefix: string) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return `${prefix}-` + result;
}

export async function updateDisplayName(formData: FormData) {
  const supabase = await createClient();

  const data = {
    display_name: "admin",
    role: "admin",
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

  const { data: courses, error: coursesError } = await supabase
    .from("course")
    .select("*")
    .eq("author", currentUser.user?.id);

  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id, display_name");

  return {
    currentUser,
    currentUserError,
    courses,
    coursesError,
    students,
    studentsError,
  };
}

export async function handleCreateCourse(formData: FormData) {
  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getUser();

  const id = generateIdentifier("C");
  const course_name = formData.get("course name") as string;

  const { error } = await supabase
    .from("course")
    .insert([{ id: id, name: course_name, author: currentUser.user?.id }])
    .select();

  if (error) {
    redirect(`/teacher-dashboard?error=${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/teacher-dashboard");
}
