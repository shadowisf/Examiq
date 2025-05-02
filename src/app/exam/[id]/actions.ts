"use server";

import { generateID } from "@/app/utils/default/generateID";
import { readCurrentUser } from "@/app/utils/default/readEntities";
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

  const results = await Promise.all(
    exam.items.map(async (item: any, index: number) => {
      let isCorrect = false;
      let correctAnswer =
        item.type === "paragraph" || item.type === "coding-challenge"
          ? "this question has no pre-defined answer"
          : item.correctAnswer;

      const studentAnswer = formData.get(`question-${index + 1}`);

      if (item.type === "paragraph" || item.type === "coding-challenge") {
        const evaluation = await openai.chat.completions.create({
          model: "deepseek/deepseek-r1-zero:free",
          messages: [
            {
              role: "user",
              content: `You're evaluating a student's exam answer.
                        Question: ${item.question}
                        Answer: ${studentAnswer}
                        Just answer with "yes" if it's correct, or "no" if it's not.`,
            },
          ],
        });

        const response = evaluation.choices[0].message.content
          ?.toLowerCase()
          .trim();

        isCorrect = response?.includes("yes") ?? false;

        if (!isCorrect) {
          const correction = await openai.chat.completions.create({
            model: "deepseek/deepseek-r1-zero:free",
            messages: [
              {
                role: "user",
                content: `A student gave a wrong answer.
                          Question: ${item.question}
                          What is the correct answer? Respond briefly.
                          If it's coding, just answer with normal text.
                          Do not include triple backticks ( \`\`\` ) or boxed formatting. Just give the plain answer.`,
              },
            ],
          });

          const aiAnswer = correction.choices[0].message.content?.trim();
          if (aiAnswer) {
            correctAnswer = aiAnswer;
          }
        }
      } else {
        const studentText = studentAnswer?.toString().trim().toLowerCase();
        const correctText = item.correctAnswer?.toString().trim().toLowerCase();
        isCorrect = studentText === correctText;
      }

      return {
        id: item.id,
        correctAnswer,
        studentAnswer,
        status: isCorrect ? "correct" : "incorrect",
        score: isCorrect ? 1 : 0,
      };
    })
  );

  return { results };
}

export async function createResult(
  formData: FormData,
  exam: any,
  gazes: any,
  inputs: any,
  blurs: any
) {
  try {
    const supabase = await createClient();

    const { currentUser, currentUserError } = await readCurrentUser();

    const { results } = await checkExam(formData, exam);

    const { error: tableError } = await supabase.from("result").insert({
      id: generateID("R"),
      student_id: currentUser?.user.id,
      exam_id: exam.id,
      contents: results.map(({ id, correctAnswer, studentAnswer, status }) => ({
        id,
        correctAnswer,
        studentAnswer,
        status,
      })),
      gazes,
      inputs,
      blurs,
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
