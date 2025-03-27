import { createClient } from "../supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function readCurrentUser() {
  try {
    const supabase = await createClient();

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return { currentUser: null };
    }

    return { currentUser: session };
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { currentUserError: { message: errorMessage } };
  }
}

export async function readAllTeachers() {
  try {
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error: teachersError } =
      await supabase.auth.admin.listUsers();

    const teachers = data.users.filter(
      (user: any) => user.user_metadata.role === "teacher"
    );

    if (teachersError) {
      throw new Error(teachersError.message);
    }

    return {
      teachers,
    };
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { teachersError: { message: errorMessage } };
  }
}

export async function readAllStudents() {
  try {
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error: studentsError } =
      await supabase.auth.admin.listUsers();

    const students = data.users.filter(
      (user: any) => user.user_metadata.role === "student"
    );

    if (studentsError) {
      throw new Error(studentsError.message);
    }

    return {
      students,
    };
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { studentsError: { message: errorMessage } };
  }
}

export async function readAllCourses() {
  try {
    const supabase = await createClient();

    const { data: courses, error: coursesError } = await supabase
      .from("course")
      .select("*");

    if (coursesError) {
      throw new Error(coursesError.message);
    }

    return {
      courses,
    };
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { coursesError: { message: errorMessage } };
  }
}

export async function readAllExams() {
  try {
    const supabase = await createClient();

    const { data: exams, error: examsError } = await supabase
      .from("exam")
      .select("*");

    if (examsError) {
      throw new Error(examsError.message);
    }

    return {
      exams,
      examsError,
    };
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { examsError: { message: errorMessage } };
  }
}
