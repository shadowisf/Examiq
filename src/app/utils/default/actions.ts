import { createClient } from "../supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export function generateIdentifier(prefix: string) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return `${prefix}-` + result;
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
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error: studentsError } = await supabase.auth.admin.listUsers();

  const students = data.users.filter(
    (user: any) => user.user_metadata.role === "student"
  );

  return {
    students,
    studentsError,
  };
}

export async function readAllTeachers() {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error: teachersError } = await supabase.auth.admin.listUsers();

  const teachers = data.users.filter(
    (user: any) => user.user_metadata.role === "teacher"
  );

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
