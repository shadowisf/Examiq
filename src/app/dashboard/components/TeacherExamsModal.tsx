import Image from "next/image";
import ErrorMessage from "../../components/ErrorMessage";
import InfoMessage from "../../components/InfoMessage";

type TeacherExamsModalProps = {
  isEditMode: boolean;
  handleConfirm: (formData: FormData) => void;
  handleCancel: () => void;
  courses: any[];
  coursesError: any;
  selectedExam: any;
  examItems: any[];
  handleSelectExamType: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  createExamItem: () => void;
  updateExamItem: (index: number, field: keyof any, value: string) => void;
  updateChoice: (itemIndex: number, choiceIndex: number, value: string) => void;
  deleteExamItem: (index: number) => void;
};

export default function TeacherExamsModal({
  isEditMode,
  handleConfirm,
  handleCancel,
  courses,
  coursesError,
  selectedExam,
  examItems,
  handleSelectExamType,
  createExamItem,
  updateExamItem,
  updateChoice,
  deleteExamItem,
}: TeacherExamsModalProps) {
  return (
    <section className="modal">
      <div className="modal-content">
        <div className="header">
          <h1>{isEditMode ? "edit exam" : "create new exam"}</h1>

          <button className="none" onClick={handleCancel}>
            <Image
              src={"/icons/close.svg"}
              alt="cancel"
              width={24}
              height={24}
            />
          </button>
        </div>

        {coursesError ? (
          <ErrorMessage>failed to load courses</ErrorMessage>
        ) : courses && courses.length > 0 ? (
          <form action={handleConfirm}>
            <select
              name="exam course"
              defaultValue={isEditMode ? selectedExam.course_id : ""}
              required
            >
              <option value="" disabled hidden defaultChecked>
                course
              </option>
              {courses?.map((course) => {
                return (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                );
              })}
            </select>

            <input
              name="exam name"
              type="text"
              placeholder="name"
              required
              defaultValue={isEditMode ? selectedExam.name : ""}
            />

            <input
              name="exam duration"
              type="number"
              min={1}
              placeholder="duration"
              required
              defaultValue={isEditMode ? selectedExam.duration : ""}
            />

            <br />

            <div className="exam-create-controls">
              <select defaultValue={""} onChange={handleSelectExamType}>
                <option value="" disabled hidden>
                  exam type
                </option>
                <option value="multiple-choice">multiple choice</option>
                <option value="paragraph">paragraph</option>
                <option value="fill-in-the-blank">fill in the blank</option>
                <option value="true-or-false">true or false</option>
              </select>

              <button type="button" onClick={createExamItem}>
                <Image
                  src={"/icons/plus.svg"}
                  width={24}
                  height={24}
                  alt="create"
                />
              </button>
            </div>

            {examItems && examItems.length > 0 && (
              <div className="exam-create-container">
                {examItems.map((item, index) => (
                  <div key={item.id} className="exam-item">
                    <div>
                      <p>{index + 1}</p>

                      <InfoMessage>{item.type}</InfoMessage>

                      <textarea
                        placeholder="question"
                        defaultValue={isEditMode ? item.question : ""}
                        onChange={(e) =>
                          updateExamItem(index, "question", e.target.value)
                        }
                      />

                      {item.type === "multiple-choice" && (
                        <>
                          {item.choices?.map(
                            (choice: any, choiceIndex: any) => (
                              <input
                                key={choiceIndex}
                                type="text"
                                placeholder={`option ${choiceIndex + 1}`}
                                defaultValue={isEditMode ? choice : ""}
                                onChange={(e) =>
                                  updateChoice(
                                    index,
                                    choiceIndex,
                                    e.target.value
                                  )
                                }
                              />
                            )
                          )}

                          <select
                            required
                            onChange={(e) =>
                              updateExamItem(
                                index,
                                "correctAnswer",
                                e.target.value
                              )
                            }
                            defaultValue={isEditMode ? item.correctAnswer : ""}
                          >
                            <option value="" disabled hidden defaultChecked>
                              correct answer
                            </option>
                            <option value="option-1">option 1</option>
                            <option value="option-2">option 2</option>
                            <option value="option-3">option 3</option>
                          </select>
                        </>
                      )}

                      {item.type === "fill-in-the-blank" && (
                        <input
                          pattern={`^(${[
                            ...new Set(item.question.match(/\b\w+\b/g)),
                          ]
                            .map((w: any) =>
                              w.replace(
                                /./g,
                                (c: any) =>
                                  `[${c.toLowerCase()}${c.toUpperCase()}]`
                              )
                            )
                            .join("|")})$`}
                          required
                          type="text"
                          placeholder="correct answer"
                          defaultValue={isEditMode ? item.correctAnswer : ""}
                          onChange={(e) =>
                            updateExamItem(
                              index,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                        />
                      )}

                      {item.type === "true-or-false" && (
                        <select
                          required
                          onChange={(e) =>
                            updateExamItem(
                              index,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                          defaultValue={isEditMode ? item.correctAnswer : ""}
                        >
                          <option value="" disabled hidden defaultChecked>
                            correct answer
                          </option>
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      )}
                    </div>

                    <button type="button" onClick={() => deleteExamItem(index)}>
                      <Image
                        src={"/icons/trash.svg"}
                        width={24}
                        height={24}
                        alt="delete"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <br />

            <button type="submit" className="confirm-button">
              <Image
                src={"/icons/check.svg"}
                alt="confirm"
                width={24}
                height={24}
              />
            </button>
          </form>
        ) : (
          <InfoMessage>you must create a course first</InfoMessage>
        )}
      </div>
    </section>
  );
}
