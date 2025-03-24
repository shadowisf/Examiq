"use server";

import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { generateIdentifier, readCurrentUser } from "../utils/default/actions";

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

    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email: email,
        password: password,
        user_metadata: {
          display_name: name,
          role: role,
        },
        email_confirm: true,
      });

    const { error: tableError } = await supabase
      .from(role)
      .insert([{ id: userData.user?.id, name: name }]);

    if (userError) {
      throw new Error(userError.message);
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

export async function updateAccount(formData: FormData, user: any) {
  try {
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    const role = formData.get("role") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const { data: userData, error: userError } =
      await supabase.auth.admin.updateUserById(user.id, {
        email: email,
        user_metadata: {
          display_name: name,
          role: role,
        },
        email_confirm: true,
      });

    const { error: tableError } = await supabase
      .from(role)
      .update({ name: name })
      .eq("id", userData.user?.id);

    if (userError) {
      throw new Error(userError.message);
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

export async function deleteAccount(user: any) {
  try {
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

    const { error: tableUser } = await supabase
      .from(user.user_metadata.role)
      .delete()
      .eq("id", user.id);

    if (authError) {
      throw new Error(authError.message);
    }

    if (tableUser) {
      throw new Error(tableUser.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}

// TEACHER
export async function createCourse(formData: FormData, students: string[]) {
  try {
    const supabase = await createClient();

    const { currentUser, currentUserError } = await readCurrentUser();

    const { error: tableError } = await supabase
      .from("course")
      .insert([
        {
          id: generateIdentifier("C"),
          name: formData.get("course name") as string,
          description: formData.get("course description") as string,
          author: currentUser.user?.id,
          students: { uid: students },
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
  students: string[]
) {
  try {
    const supabase = await createClient();

    const { error: tableError } = await supabase
      .from("course")
      .update({
        name: formData.get("course name") as string,
        description: formData.get("course description") as string,
        students: { uid: students },
      })
      .eq("id", course.id);

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

export async function deleteCourse(id: string) {
  try {
    const supabase = await createClient();

    const { error: tableError } = await supabase
      .from("course")
      .delete()
      .eq("id", id);

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

export async function deleteStudentFromCourse(user: any) {
  try {
    const supabase = await createClient();

    const { data: courses, error: coursesError } = await supabase
      .from("course")
      .select("id, students")
      .filter("students->uid", "cs", `["${user.id}"]`);

    if (coursesError) {
      throw new Error(coursesError.message);
    }

    for (const course of courses) {
      const updatedStudents = {
        uid: course.students.uid.filter((id: string) => id !== user.id),
      };

      const { error: tableError } = await supabase
        .from("course")
        .update({ students: updatedStudents })
        .eq("id", course.id);

      if (tableError) {
        throw new Error(tableError.message);
      }
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { error: { message: errorMessage } };
  }
}

export async function createExam(formData: FormData) {
  try {
    const supabase = await createClient();

    const { currentUser, currentUserError } = await readCurrentUser();

    const { error: tableError } = await supabase.from("exam").insert([
      {
        id: generateIdentifier("E"),
        course_id: formData.get("exam course") as string,
        name: formData.get("exam name") as string,
        author: currentUser.user?.id,
        items: [],
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

export async function updateExam(formData: FormData, id: string) {
  try {
    const supabase = await createClient();

    const { error: tableError } = await supabase
      .from("exam")
      .update({
        course_id: formData.get("exam course") as string,
        name: formData.get("exam name") as string,
        items: [],
      })
      .eq("id", id);

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

export async function deleteExam(id: string) {
  try {
    const supabase = await createClient();

    const { error: tableError } = await supabase
      .from("exam")
      .delete()
      .eq("id", id);

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
