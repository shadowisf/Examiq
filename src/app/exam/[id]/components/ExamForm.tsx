"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import EyeTracker from "./EyeTracker";

type ExamFormProps = {
  exam: any;
  currentUser: any;
};

export default function ExamForm({ exam, currentUser }: ExamFormProps) {
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

  async function handleSubmit(formData: FormData) {}

  return startExam || currentUser.user.user_metadata.role === "teacher" ? (
    <form action={handleSubmit}>
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
                    name={`question-${item.index}`}
                    value={"option-" + choiceIndex}
                    required
                    disabled={currentUser.user.user_metadata.role === "teacher"}
                  />
                  {choice}
                </label>
              ))}
            </div>
          )}

          {item.type === "paragraph" && (
            <textarea
              name={`question-${item.index}`}
              placeholder="answer"
              required
              disabled={currentUser.user.user_metadata.role === "teacher"}
            />
          )}

          {item.type === "fill-in-the-blank" && (
            <input
              name={`question-${item.index}`}
              placeholder="answer"
              required
              disabled={currentUser.user.user_metadata.role === "teacher"}
            />
          )}

          {item.type === "true-or-false" && (
            <div className="choices">
              <label>
                <input
                  name={`question-${item.index}`}
                  type="radio"
                  value={"true"}
                  required
                  disabled={currentUser.user.user_metadata.role === "teacher"}
                />
                True
              </label>
              <label>
                <input
                  name={`question-${item.index}`}
                  type="radio"
                  value={"false"}
                  required
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
          <Image src={"/icons/check.svg"} alt="submit" width={24} height={24} />
        </button>
      )}
    </form>
  ) : (
    currentUser.user.user_metadata.role === "student" && (
      <EyeTracker setStartExam={setStartExam} gazeCountsRef={gazeCountsRef} />
    )
  );
}
