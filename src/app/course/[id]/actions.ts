"use server";

import {
  generateIdentifier,
  readCurrentUser,
} from "@/app/utils/default/actions";
import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createExam(formData: FormData) {
  const supabase = await createClient();

  const { currentUser } = await readCurrentUser();

  const { error } = await supabase.from("exam").insert([
    {
      id: generateIdentifier("E"),
      course_id: formData.get("exam course") as string,
      name: formData.get("exam name") as string,
      author: currentUser.user?.id,
      items: [],
    },
  ]);

  if (error) {
    redirect(`/dashboard?error=${error.message}`);
  }

  revalidatePath("/", "layout");
}

export async function updateExam(formData: FormData, id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("exam")
    .update({
      course_id: formData.get("exam course") as string,
      name: formData.get("exam name") as string,
      items: [],
    })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard?error=${error.message}`);
  }

  revalidatePath("/", "layout");
}

export async function deleteExam(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("exam").delete().eq("id", id);

  if (error) {
    redirect(`/dashboard?error=${error.message}`);
  }

  revalidatePath("/", "layout");
}
