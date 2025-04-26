"use server";

import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { readCurrentUser } from "../utils/default/readEntities";
import { generateID } from "../utils/default/generateID";
import { formatDateTimeToUTC } from "../utils/default/formatDateTimeUTC";

// ADMIN
export async function createAccount(formData: FormData) {
  try {
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    const role = formData.get("role") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: {
        display_name: name,
        role: role,
      },
      email_confirm: true,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}

export async function updateAccount(formData: FormData, user: any) {
  try {
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    const role = formData.get("role") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      email: email,
      user_metadata: {
        display_name: name,
        role: role,
      },
      email_confirm: true,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}

export async function deleteAccount(user: any) {
  try {
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}

export async function deleteStudentFromCourse(user: any) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("course")
      .select("id, students")
      .filter("students->id", "cs", `["${user.id}"]`);

    if (error) {
      throw new Error(error.message);
    }

    for (const course of data) {
      const updatedStudents = {
        id: course.students.id.filter((id: string) => id !== user.id),
      };

      const { error } = await supabase
        .from("course")
        .update({ students: updatedStudents })
        .eq("id", course.id);

      if (error) {
        throw new Error(error.message);
      }
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}

// TEACHER
export async function createCourse(
  formData: FormData,
  selectedStudents: string[]
) {
  try {
    const supabase = await createClient();

    const { currentUser, currentUserError } = await readCurrentUser();

    const { error: tableError } = await supabase
      .from("course")
      .insert([
        {
          id: generateID("C"),
          name: formData.get("course name") as string,
          description: formData.get("course description") as string,
          author: currentUser?.user.id,
          students: { id: selectedStudents },
        },
      ])
      .select();

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

export async function updateCourse(
  formData: FormData,
  course: any,
  selectedStudents: string[]
) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("course")
      .update({
        name: formData.get("course name") as string,
        description: formData.get("course description") as string,
        students: { id: selectedStudents },
      })
      .eq("id", course.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
    revalidatePath("/course", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}

export async function deleteCourse(course: any) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("course")
      .delete()
      .eq("id", course.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}

export async function createExam(formData: FormData, examItems: any[]) {
  try {
    const supabase = await createClient();

    const { currentUser, currentUserError } = await readCurrentUser();

    const { error: tableError } = await supabase.from("exam").insert([
      {
        id: generateID("E"),
        course_id: formData.get("exam course"),
        name: formData.get("exam name"),
        deadline: formatDateTimeToUTC(formData.get("exam deadline") as string),
        author: currentUser?.user.id,
        items: examItems,
      },
    ]);

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

export async function updateExam(
  formData: FormData,
  exam: any,
  examItems: any[]
) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("exam")
      .update({
        course_id: formData.get("exam course"),
        name: formData.get("exam name"),
        deadline: formatDateTimeToUTC(formData.get("exam deadline") as string),
        items: examItems,
      })
      .eq("id", exam.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
    revalidatePath("/exam", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}

export async function deleteExam(exam: any) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("exam").delete().eq("id", exam.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}

export async function updateResult(formData: FormData, result: any) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("result")
      .update({
        score: formData.get("result score"),
        likelihood_of_cheating: formData.get(
          "result likelihood of cheating"
        ) as string,
      })
      .eq("id", result.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}

export async function deleteResult(result: any) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("result")
      .delete()
      .eq("id", result.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}
