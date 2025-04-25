"use client";

type ResultFormProps = {
  exam: any;
  result: any;
};

export default function ResultForm({ exam, result }: ResultFormProps) {
  return (
    <>
      <form>
        {exam.items.map((item: any, index: number) => {
          const answerObj = result.contents?.find((a: any) => a.id === item.id);
          const studentAnswer = answerObj?.studentAnswer;
          const correctAnswer = answerObj?.correctAnswer;

          const isCorrect =
            studentAnswer?.toLowerCase().trim() ===
            correctAnswer?.toLowerCase().trim();

          return (
            <div key={item.id} className="question">
              <h4>
                {isCorrect ? " ✅" : " ❌"} <span>{index + 1}. </span>
                {item.type == "fill-in-the-blank"
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
            </div>
          );
        })}
      </form>
    </>
  );
}
