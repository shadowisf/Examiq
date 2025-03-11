"use server";

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

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

export async function readCourse() {
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

export async function readStudents() {
  const supabase = await createClient();

  const { data: students, error: studentsError } = await supabase
    .from("student")
    .select("*");

  return {
    students,
    studentsError,
  };
}

export async function readTeachers() {
  const supabase = await createClient();

  const { data: teachers, error: teachersError } = await supabase
    .from("teacher")
    .select("*");

  return {
    teachers,
    teachersError,
  };
}

export async function readExams() {
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
