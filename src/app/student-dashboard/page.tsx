import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export default async function StudentDashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  return (
    <main>
      <h1>Hello {data.user.email}</h1>
    </main>
  );
}
