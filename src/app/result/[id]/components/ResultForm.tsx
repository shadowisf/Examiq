"use client";

import InfoMessage from "@/app/components/InfoMessage";

type ResultFormProps = {
  exam: any;
  result: any;
  currentUser: any;
};

export default function ResultForm({
  exam,
  result,
  currentUser,
}: ResultFormProps) {
  return (
    <>
      <form>
        {exam.items.map((item: any, index: number) => {
          const answerObj = result.contents?.find((a: any) => a.id === item.id);
          const studentAnswer = answerObj?.studentAnswer;
          const correctAnswer = answerObj?.correctAnswer;
          const status = answerObj?.status;

          const isCorrect = status === "correct";

          return (
            <div key={item.id} className="question">
              <h4>
                {isCorrect ? " ✅" : " ❌"} <span>{index + 1}. </span>
                {item.type === "fill-in-the-blank"
                  ? item.question.replace(
                      new RegExp(item.correctAnswer, "i"),
                      "_____"
                    )
                  : item.question}
              </h4>

              {item.type === "multiple-choice" && (
                <div className="choices">
                  {item.choices.map((choice: string, choiceIndex: number) => {
                    const optionValue = `option-${choiceIndex + 1}`;
                    const isStudentChoice = studentAnswer === optionValue;

                    return (
                      <label key={choiceIndex}>
                        <input
                          type="radio"
                          checked={isStudentChoice}
                          onChange={() => {}}
                        />
                        {choice}
                      </label>
                    );
                  })}
                </div>
              )}

              {item.type === "paragraph" && (
                <textarea defaultValue={studentAnswer} readOnly />
              )}

              {item.type === "coding-challenge" && (
                <textarea defaultValue={studentAnswer} readOnly />
              )}

              {item.type === "fill-in-the-blank" && (
                <input defaultValue={studentAnswer} readOnly />
              )}

              {item.type === "true-or-false" && (
                <div className="choices">
                  {["true", "false"].map((val) => (
                    <label key={val}>
                      <input
                        type="radio"
                        checked={studentAnswer === val}
                        onChange={() => {}}
                      />
                      {val.charAt(0).toUpperCase() + val.slice(1)}
                    </label>
                  ))}
                </div>
              )}

              <p>
                correct answer:{" "}
                <strong>
                  {typeof correctAnswer === "string"
                    ? correctAnswer.replace(/\\boxed{([\s\S]*?)}/, "$1")
                    : correctAnswer}
                </strong>
              </p>
            </div>
          );
        })}
      </form>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {currentUser.user.user_metadata.role === "teacher" && (
        <section className="cheating-stats-container">
          <div>
            <h4>keyboard inputs</h4>
            {result.inputs
              .filter(
                (inputGroup: Record<string, number>) =>
                  inputGroup.hasOwnProperty("A") ||
                  inputGroup.hasOwnProperty("B")
              )
              .map((inputGroup: Record<string, number>, index: number) => (
                <div key={index} style={{ marginBottom: "1rem" }}>
                  {Object.entries(inputGroup).map(([key, count]) => (
                    <InfoMessage key={key}>
                      <span>{key}</span> - <span>{count}</span>
                    </InfoMessage>
                  ))}
                </div>
              ))}
          </div>

          <div>
            <h4>mouse inputs</h4>
            {result.inputs
              .filter(
                (inputGroup: Record<string, number>) =>
                  inputGroup.hasOwnProperty("left") ||
                  inputGroup.hasOwnProperty("right")
              )
              .map((inputGroup: Record<string, number>, index: number) => (
                <div key={index} style={{ marginBottom: "1rem" }}>
                  {Object.entries(inputGroup).map(([key, count]) => (
                    <InfoMessage key={key}>
                      <span>{key}</span> - <span>{count}</span>
                    </InfoMessage>
                  ))}
                </div>
              ))}
          </div>

          <div>
            <h4>blurs</h4>
            <div>
              {["blur", "unblur"].map(
                (key) =>
                  result.blurs[key] !== undefined && (
                    <InfoMessage key={key}>
                      <span>{key}</span> - <span>{result.blurs[key]}</span>
                    </InfoMessage>
                  )
              )}
            </div>
          </div>

          <div className="gaze-grid-container">
            <h4>gazes</h4>
            <div>
              <InfoMessage>{result.gazes?.topleft ?? 0}</InfoMessage>
              <InfoMessage>{result.gazes?.top ?? 0}</InfoMessage>
              <InfoMessage>{result.gazes?.topright ?? 0}</InfoMessage>

              <InfoMessage>{result.gazes?.left ?? 0}</InfoMessage>
              <InfoMessage>center</InfoMessage>
              <InfoMessage>{result.gazes?.right ?? 0}</InfoMessage>

              <InfoMessage>{result.gazes?.bottomleft ?? 0}</InfoMessage>
              <InfoMessage>{result.gazes?.bottom ?? 0}</InfoMessage>
              <InfoMessage>{result.gazes?.bottomright ?? 0}</InfoMessage>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
