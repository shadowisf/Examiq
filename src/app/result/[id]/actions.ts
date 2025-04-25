"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function readSingleResult(id: string) {
  try {
    const supabase = await createClient();

    const { data: result, error: resultError } = await supabase
      .from("result")
      .select("*")
      .eq("id", id)
      .single();

    if (resultError) {
      throw new Error(resultError.message);
    }

    return {
      result,
      resultError,
    };
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { resultError: { message: errorMessage } };
  }
}
