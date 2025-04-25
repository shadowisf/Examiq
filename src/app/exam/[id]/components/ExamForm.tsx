"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { createResult } from "../actions";
import Loading from "@/app/components/Loading";
import ErrorMessage from "@/app/components/ErrorMessage";
import { redirect } from "next/navigation";
import EyeTracker from "./EyeTracker";
import Timer from "./Timer";

type ExamFormProps = {
  exam: any;
  currentUser: any;
};

export default function ExamForm({ exam, currentUser }: ExamFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [startExam, setStartExam] = useState(false);
  const gazeCountsRef = useRef<Record<string, number>>({
    topleft: 0,
    topright: 0,
    bottomleft: 0,
    bottomright: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  function calculateLikelihoodOfCheating(
    gazeCounts: Record<string, number>
  ): number {
    const suspiciousZones = [
      "left",
      "right",
      "top",
      "bottom",
      "topleft",
      "topright",
      "bottomleft",
      "bottomright",
    ];

    const totalCount = Object.values(gazeCounts).reduce(
      (acc, val) => acc + val,
      0
    );

    const suspiciousCount = suspiciousZones.reduce((acc, zone) => {
      return acc + (gazeCounts[zone] || 0);
    }, 0);

    if (totalCount === 0) {
      return 0;
    }

    let likelihood = (suspiciousCount / totalCount) * 100;

    likelihood = likelihood - 7;

    return Math.min(100, Math.max(0, Math.round(likelihood)));
  }

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const likelihood_of_cheating = calculateLikelihoodOfCheating(
        gazeCountsRef.current
      );

      const result = await createResult(formData, exam, likelihood_of_cheating);

      if (result?.error) {
        setError(result.error.message);
      }

      redirect("/dashboard");
    });
  }

  return startExam || currentUser.user.user_metadata.role === "teacher" ? (
    <>
      {isPending && <Loading />}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Timer
        duration={exam.duration}
        onTimeUp={() => {
          if (formRef.current) {
            formRef.current.requestSubmit();
          }
        }}
      />

      <form action={handleSubmit} ref={formRef}>
        {exam.items.map((item: any, index: number) => (
          <div key={item.id} className="question">
            <h4>
              <span>{index + 1}. </span>

              {item.type == "fill-in-the-blank"
                ? item.question.replace(
                    new RegExp(item.correctAnswer, "i"),
                    "_____"
                  )
                : item.question}
            </h4>

            {item.type === "multiple-choice" && (
              <div className="choices">
                {item.choices.map((choice: string, choiceIndex: number) => (
                  <label key={choiceIndex}>
                    <input
                      type="radio"
                      name={`question-${index + 1}`}
                      value={`option-${choiceIndex + 1}`}
                      disabled={
                        currentUser.user.user_metadata.role === "teacher"
                      }
                    />
                    {choice}
                  </label>
                ))}
              </div>
            )}

            {item.type === "paragraph" && (
              <textarea
                name={`question-${index + 1}`}
                placeholder="answer"
                disabled={currentUser.user.user_metadata.role === "teacher"}
              />
            )}

            {item.type === "fill-in-the-blank" && (
              <input
                name={`question-${index + 1}`}
                placeholder="answer"
                disabled={currentUser.user.user_metadata.role === "teacher"}
              />
            )}

            {item.type === "true-or-false" && (
              <div className="choices">
                <label>
                  <input
                    name={`question-${index + 1}`}
                    type="radio"
                    value={"true"}
                    disabled={currentUser.user.user_metadata.role === "teacher"}
                  />
                  True
                </label>
                <label>
                  <input
                    name={`question-${index + 1}`}
                    type="radio"
                    value={"false"}
                    disabled={currentUser.user.user_metadata.role === "teacher"}
                  />
                  False
                </label>
              </div>
            )}
          </div>
        ))}

        {currentUser.user.user_metadata.role === "student" && (
          <button type="submit">
            <Image
              src={"/icons/check.svg"}
              alt="submit"
              width={24}
              height={24}
            />
          </button>
        )}
      </form>
    </>
  ) : (
    currentUser.user.user_metadata.role === "student" && !isPending && (
      <EyeTracker setStartExam={setStartExam} gazeCountsRef={gazeCountsRef} />
    )
  );
}
