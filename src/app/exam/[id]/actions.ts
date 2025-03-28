import { createClient } from "@/app/utils/supabase/server";

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
    };
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { examError: { message: errorMessage } };
  }
}
