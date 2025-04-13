"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { EyeTracking } from "react-eye-tracking";

type ExamFormProps = {
  exam: any;
  currentUser: any;
};

export default function ExamForm({ exam, currentUser }: ExamFormProps) {
  const [startExam, setStartExam] = useState(false);
  const [calibration, setCalibration] = useState(false);
  const [lastNotifiedCorner, setLastNotifiedCorner] = useState<string | null>(
    null
  );

  const handleGazeData = useCallback(
    (data: any, elapsedTime: number) => {
      if (!data || typeof data.x !== "number" || typeof data.y !== "number")
        return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const thresholdX = startExam ? 0.05 : -1; // 10% from left or right (sides of the screen)
      const thresholdY = startExam ? 0.05 : -1; // 10% from top or bottom (sides of the screen)

      const isLeft = data.x < screenWidth * thresholdX;
      const isRight = data.x > screenWidth * (1 - thresholdX);
      const isTop = data.y < screenHeight * thresholdY;
      const isBottom = data.y > screenHeight * (1 - thresholdY);

      let currentArea: string | null = null;

      if (isLeft && isTop) currentArea = "top-left";
      else if (isRight && isTop) currentArea = "top-right";
      else if (isLeft && isBottom) currentArea = "bottom-left";
      else if (isRight && isBottom) currentArea = "bottom-right";
      else if (isLeft) currentArea = "left";
      else if (isRight) currentArea = "right";
      else if (isTop) currentArea = "top";
      else if (isBottom) currentArea = "bottom";

      if (currentArea && currentArea !== lastNotifiedCorner) {
        alert(`You're looking at the ${currentArea} area!`);
        setLastNotifiedCorner(currentArea);

        // Reset lastNotifiedCorner after 3 seconds to allow new alerts
        setTimeout(() => setLastNotifiedCorner(null), 3000);
      }
    },
    [lastNotifiedCorner, startExam]
  );

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
    currentUser.user.user_metadata.role === "student" && (
      <section className="eyetracker-calibration-page">
        <button onClick={() => setCalibration(true)}>Calibrate</button>
        <button onClick={() => setStartExam(true)}>Start Exam</button>

        <EyeTracking
          show={calibration}
          setShow={setCalibration}
          showCamera={true}
          showPoint={true}
          listener={handleGazeData}
        />
      </section>
    )
  );
}
