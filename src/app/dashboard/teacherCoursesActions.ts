"use server";

import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useLoader } from "../components/Loader";
import { resourceUsage } from "process";

function generateIdentifier(prefix: string) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return `${prefix}-` + result;
}

export async function createCourse(formData: FormData, students: string[]) {
  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getUser();

  const id = generateIdentifier("C");
  const course_name = formData.get("course name") as string;

  const { error } = await supabase
    .from("course")
    .insert([
      {
        id: id,
        name: course_name,
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
