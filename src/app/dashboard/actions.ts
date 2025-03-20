"use server";

import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { generateIdentifier } from "../utils/default/actions";

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

    const { data: authUserData, error: authUserError } =
      await supabase.auth.admin.createUser({
        email: email,
        password: password,
        user_metadata: {
          display_name: name,
          role: role,
        },
        email_confirm: true,
      });

    const { error: tableUserError } = await supabase
      .from(role)
      .insert([{ id: authUserData.user?.id, name: name }]);

    if (authUserError) {
      throw new Error(authUserError.message);
    }

    if (tableUserError) {
      throw new Error(tableUserError.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

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

    const { data: authUserData, error: authUserError } =
      await supabase.auth.admin.updateUserById(user.id, {
        email: email,
        user_metadata: {
          display_name: name,
          role: role,
        },
        email_confirm: true,
      });

    const { error: tableUserError } = await supabase
      .from(role)
      .update({ name: name })
      .eq("id", authUserData.user?.id);

    if (authUserError) {
      throw new Error(authUserError.message);
    }

    if (tableUserError) {
      throw new Error(tableUserError.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    return { error: { message: errorMessage } };
  }
}

export async function deleteAccount(user: any) {
  try {
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: authUserError } = await supabase.auth.admin.deleteUser(
      user.id
    );

    const { error: tableUser } = await supabase
      .from(user.user_metadata.role)
      .delete()
      .eq("id", user.id);

    if (authUserError) {
      throw new Error(authUserError.message);
    }

    if (tableUser) {
      throw new Error(tableUser.message);
    }
  } catch (e) {
    const errorMessage = (e as Error).message;

    return { error: { message: errorMessage } };
  }
}

// TEACHER
export async function createCourse(formData: FormData, students: string[]) {
  try {
    const supabase = await createClient();

    const { data: currentUser } = await supabase.auth.getUser();

    const { error } = await supabase
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

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    return { error: { message: errorMessage } };
  }
}

export async function updateCourse(
  formData: FormData,
  id: string,
  students: string[]
) {
  try {
    const supabase = await createClient();

    const inputData = {
      name: formData.get("course name") as string,
      description: formData.get("course description") as string,
      students: { uid: students },
    };

    const { error } = await supabase
      .from("course")
      .update(inputData)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    return { error: { message: errorMessage } };
  }
}

export async function deleteCourse(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("course").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
  } catch (e) {
    const errorMessage = (e as Error).message;

    return { error: { message: errorMessage } };
  }
}
