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
    redirect(`/dashboard?error=${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
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
    .from("student")
    .select("id, name");

  return {
    currentUser,
    currentUserError,
    courses,
    coursesError,
    students,
    studentsError,
  };
}

export async function retrieveNameFromID(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("student")
    .select("name")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching student name:", error);
    return null;
  }

  return data ? data.name : "Unknown";
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
    redirect(`/dashboard?error=${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
