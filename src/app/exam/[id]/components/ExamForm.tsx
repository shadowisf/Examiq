"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { createResult } from "../actions";
import Loading from "@/app/components/Loading";
import ErrorMessage from "@/app/components/ErrorMessage";
import { redirect } from "next/navigation";
import EyeTracker from "./_EyeTracker";
import Timer from "./ExamTimer";
import Blocked from "@/app/components/Blocked";
import { inputTracker } from "./_InputTracker";
import { windowTracker } from "./_WindowTracker";

type ExamFormProps = {
  exam: any;
  currentUser: any;
};

export default function ExamForm({ exam, currentUser }: ExamFormProps) {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState("");
  const [startExam, setStartExam] = useState(false);
  const [blocked, setBlocked] = useState(false);

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
  const keyPressCount = useRef<Record<string, number>>({});
  const mouseClickCount = useRef<Record<string, number>>({});
  const formRef = useRef<HTMLFormElement | null>(null);

  const now = new Date().getTime();
  const deadline = new Date(exam.deadline).getTime();
  const duration = deadline - now;

  useEffect(() => {
    if (startExam) {
      gazeCountsRef.current = {
        topleft: 0,
        topright: 0,
        bottomleft: 0,
        bottomright: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      };
    }
  }, [startExam]);

  useEffect(() => {
    if (startExam) {
      const cleanup = inputTracker(
        keyPressCount.current,
        mouseClickCount.current
      );

      return () => {
        cleanup();
      };
    }
  }, [startExam]);

  useEffect(() => {
    if (startExam) {
      const cleanup = windowTracker(
        () => setBlocked(true),
        () => setBlocked(false)
      );

      return () => {
        cleanup();
      };
    }
  }, [startExam]);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const combinedInputs = {
        ...keyPressCount.current,
        ...mouseClickCount.current,
      };

      const result = await createResult(
        formData,
        exam,
        gazeCountsRef.current,
        combinedInputs
      );

      if (result?.error) {
        setError(result.error.message);
      }

      redirect("/dashboard");
    });
  }

  return (
    <>
      {isPending && <Loading />}

      {blocked && <Blocked />}

      {now > deadline && currentUser.user.user_metadata.role === "student" ? (
        <>
          <section>
            this exam is now expired. please contact your teacher for further
            assistance.
          </section>
        </>
      ) : startExam || currentUser.user.user_metadata.role === "teacher" ? (
        <>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {currentUser.user.user_metadata.role === "student" ? (
            <Timer
              duration={duration}
              onTimeUp={() => {
                if (formRef.current && !isPending) {
                  const formData = new FormData(formRef.current);

                  handleSubmit(formData);
                } else {
                  return;
                }
              }}
            />
          ) : null}

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

                {item.type === "coding-challenge" && (
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
                        disabled={
                          currentUser.user.user_metadata.role === "teacher"
                        }
                      />
                      True
                    </label>
                    <label>
                      <input
                        name={`question-${index + 1}`}
                        type="radio"
                        value={"false"}
                        disabled={
                          currentUser.user.user_metadata.role === "teacher"
                        }
                      />
                      False
                    </label>
                  </div>
                )}
              </div>
            ))}

            {currentUser.user.user_metadata.role === "student" && (
              <button
                type="submit"
                onClick={() => {
                  console.log(keyPressCount);
                  console.log(mouseClickCount);
                }}
              >
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
        currentUser.user.user_metadata.role === "student" &&
        !isPending && (
          <EyeTracker
            setStartExam={setStartExam}
            gazeCountsRef={gazeCountsRef}
          />
        )
      )}
    </>
  );
}
