import { createClient } from "@/app/utils/supabase/server";

export async function readSingleCourse(id: string) {
  try {
    const supabase = await createClient();

    const { data: course, error: courseError } = await supabase
      .from("course")
      .select("*")
      .eq("id", id)
      .single();

    if (courseError) {
      throw new Error(courseError.message);
    }

    return {
      course,
    };
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { courseError: { message: errorMessage } };
  }
}
