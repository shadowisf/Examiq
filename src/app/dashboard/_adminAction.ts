"use server";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "../utils/supabase/server";

export async function handleCreateAccount(formData: FormData) {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );

  const role = formData.get("role") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    user_metadata: {
      display_name: name,
      role: role,
    },
  });

  await supabase.from(role).insert([{ id: data.user?.id, name: name }]);
}

export async function retrieveDataForAdmin() {
  const supabase = await createClient();

  const { data: students, error: studentsError } = await supabase
    .from("student")
    .select("*");

  const { data: teachers, error: teachersError } = await supabase
    .from("teacher")
    .select("*");

  return {
    students,
    studentsError,
    teachers,
    teachersError,
  };
}
