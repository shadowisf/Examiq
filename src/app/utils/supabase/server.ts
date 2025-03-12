"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
}

export async function readSingleCourse(id: string) {
  const supabase = await createClient();

  const { data: course, error: courseError } = await supabase
    .from("course")
    .select("*")
    .eq("id", id)
    .single();

  return {
    course,
    courseError,
  };
}

export async function readSingleStudent(id: string) {
  const supabase = await createClient();

  const { data: student, error: studentError } = await supabase
    .from("student")
    .select("*")
    .eq("id", id)
    .single();

  return {
    student,
    studentError,
  };
}

export async function readCurrentUser() {
  const supabase = await createClient();

  const { data: currentUser, error: currentUserError } =
    await supabase.auth.getUser();

  if (currentUserError || !currentUser?.user) {
    redirect("/");
  }

  return {
    currentUser,
    currentUserError,
  };
}

export async function readAllCourses() {
  const supabase = await createClient();

  const { currentUser } = await readCurrentUser();

  const { data: courses, error: coursesError } = await supabase
    .from("course")
    .select("*")
    .eq("author", currentUser.user?.id);

  return {
    courses,
    coursesError,
  };
}

export async function readAllStudents() {
  const supabase = await createClient();

  const { data: students, error: studentsError } = await supabase
    .from("student")
    .select("*");

  return {
    students,
    studentsError,
  };
}

export async function readAllTeachers() {
  const supabase = await createClient();

  const { data: teachers, error: teachersError } = await supabase
    .from("teacher")
    .select("*");

  return {
    teachers,
    teachersError,
  };
}

export async function readAllExams() {
  const supabase = await createClient();

  const { currentUser } = await readCurrentUser();

  const { data: exams, error: examsError } = await supabase
    .from("exam")
    .select("*")
    .eq("author", currentUser.user?.id);

  return {
    exams,
    examsError,
  };
}
