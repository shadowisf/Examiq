"use server";

import { generateID } from "@/app/utils/default/generateID";
import { readCurrentUser } from "@/app/utils/default/read";
import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function readSingleExam(id: string) {
  try {
    const supabase = await createClient();

    const { data: exam, error: examError } = await supabase
      .from("exam")
      .select("*")
      .eq("id", id)
      .single();

    if (examError) {
      throw new Error(examError.message);
    }

    return {
      exam,
      examError,
    };
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { examError: { message: errorMessage } };
  }
}

export async function createResult(
  formData: FormData,
  exam: any,
  likelihood_of_cheating: number
) {
  try {
    const supabase = await createClient();

    const { currentUser, currentUserError } = await readCurrentUser();

    const { error: tableError } = await supabase.from("result").insert({
      id: generateID("R"),
      student_id: currentUser?.user.id,
      exam_id: exam.id,
      contents: exam.items.map((item: any, index: number) => {
        return {
          id: item.id,
          answer: formData.get(`question-${index + 1}`),
        };
      }),
      final_score: 0,
      likelihood_of_cheating: likelihood_of_cheating,
    });

    if (currentUserError) {
      throw new Error(currentUserError.message);
    }

    if (tableError) {
      throw new Error(tableError.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}
