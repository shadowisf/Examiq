"use server";

import { generateID } from "@/app/utils/default/generateID";
import { readCurrentUser } from "@/app/utils/default/read";
import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";

export async function readSingleExam(id: string) {
  try {
    const supabase = await createClient();

    const { data: exam, error: examError } = await supabase
      .from("exam")
      .select("*")
      .eq("id", id)
      .single();

    if (examError) {
      throw new Error(examError.message);
    }

    return {
      exam,
      examError,
    };
  } catch (e) {
    const errorMessage = (e as Error).message;

    console.error(errorMessage);
    return { examError: { message: errorMessage } };
  }
}

export async function checkExam(formData: FormData, exam: any) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPEN_ROUTER_API_KEY!,
  });

  const scorePromises = exam.items.map(async (item: any, index: number) => {
    if (item.type === "paragraph") {
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1-zero:free",
        messages: [
          {
            role: "user",
            content: `
              You're evaluating a student's exam answer.
              Question: ${item.question}
              Answer: ${formData.get(`question-${index + 1}`)}
              Just answer with "yes" if it's correct, or "no" if it's not.
            `,
          },
        ],
      });

      const response = completion.choices[0].message.content
        ?.toLowerCase()
        .trim();

      console.log(response);

      if (response?.includes("yes")) {
        return 1;
      }
    } else {
      const studentAnswer = formData
        .get(`question-${index + 1}`)
        ?.toString()
        .trim()
        .toLowerCase();
      const correctAnswer = item.correctAnswer?.toString().trim().toLowerCase();

      if (studentAnswer === correctAnswer) {
        return 1;
      }
    }

    return 0;
  });

  const scores = await Promise.all(scorePromises);

  const score = scores.reduce((acc, curr) => acc + curr, 0);

  return { score };
}

export async function createResult(
  formData: FormData,
  exam: any,
  likelihood_of_cheating: number
) {
  try {
    const supabase = await createClient();

    const { currentUser, currentUserError } = await readCurrentUser();

    const { score } = await checkExam(formData, exam);

    const { error: tableError } = await supabase.from("result").insert({
      id: generateID("R"),
      student_id: currentUser?.user.id,
      exam_id: exam.id,
      contents: exam.items.map((item: any, index: number) => {
        return {
          id: item.id,
          correctAnswer:
            item.type === "paragraph"
              ? "this is a paragraph question"
              : item.correctAnswer,
          studentAnswer: formData.get(`question-${index + 1}`),
        };
      }),
      score: score,
      likelihood_of_cheating: likelihood_of_cheating,
    });

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

/* export async function testAI() {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPEN_ROUTER_API_KEY!,
  });

  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1-zero:free",
    messages: [
      {
        role: "user",
        content: `
        I'm checking exams for students. Below is the question. Answer only yes or no, is their answer correct?

        Question: How do you approach character development when creating a story? Discuss the techniques you would use to ensure your characters are engaging and believable.
        
        Answer: When I create a story, I try to think about my characters like real people. I usually start by figuring out their personality, what they want, and maybe something from their past that affects how they act. I also make sure they have both good and bad traits so they feel more realistic. I try to show who they are through what they do or say instead of just describing them. I think it’s important that they change a bit by the end of the story, depending on what they go through.
        `,
      },
    ],
  });

  return completion.choices[0].message.content;
} */
