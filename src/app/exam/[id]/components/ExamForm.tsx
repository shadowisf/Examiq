"use client";

import EyeTracker from "@/app/exam/[id]/components/EyeTracker";
import Image from "next/image";
import { useEffect, useState } from "react";

type ExamFormProps = {
  exam: any;
  currentUser: any;
};

export default function ExamForm({ exam, currentUser }: ExamFormProps) {
  const [startExam, setStartExam] = useState(true);

  async function handleSubmit(formData: FormData) {
    console.log(formData);
  }

  return startExam || currentUser.user.user_metadata.role === "teacher" ? (
    <form action={handleSubmit}>
      {exam.items.map((item: any, index: number) => (
        <div key={item.id} className="question">
          <h4>
            <span>{index + 1}. </span>
            {item.question}
          </h4>

          {item.type === "multiple-choice" && (
            <div className="choices">
              {item.choices.map((choice: string, choiceIndex: number) => (
                <label key={choiceIndex}>
                  <input
                    type="radio"
                    name={`question-${item.index}`}
                    value={choice}
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
                true
              </label>
              <label>
                <input
                  name={`question-${item.index}`}
                  type="radio"
                  value={"false"}
                  required
                  disabled={currentUser.user.user_metadata.role === "teacher"}
                />
                false
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
    currentUser.user.user_metadata.role === "teacher " && (
      <section className="eyetracker-calibration-page">
        {/* <EyeTracker setStartExam={setStartExam} /> */}
      </section>
    )
  );
}
