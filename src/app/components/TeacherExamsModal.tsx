"use client";

import Image from "next/image";
import ErrorMessage from "./ErrorMessage";
import InfoMessage from "./InfoMessage";
import { ExamItem } from "../utils/default/types";

type TeacherExamsModalProps = {
  isEditMode: boolean;
  handleConfirm: (formData: FormData) => void;
  handleCancel: () => void;
  courses: any[] | null;
  coursesError: any;
  selectedExam: any;
  examItems: ExamItem[];
  handleSelectExamType: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  createExamItem: () => void;
  updateExamItem: (index: number, field: keyof ExamItem, value: string) => void;
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
          <form action={(formData) => handleConfirm(formData)}>
            <select
              name="exam course"
              defaultValue={isEditMode ? selectedExam.course_id : ""}
              required
            >
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

            <br />

            <div className="exam-create-controls">
              <select onChange={handleSelectExamType}>
                <option value="multiple-choice">multiple choice</option>
                <option value="paragraph">paragraph</option>
                <option value="fill-in-the-blank">fill in the blank</option>
                <option value="true-false">true or false</option>
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
                        value={item.question}
                        onChange={(e) =>
                          updateExamItem(index, "question", e.target.value)
                        }
                      />

                      {item.type === "multiple-choice" && (
                        <>
                          {item.choices?.map((choice, choiceIndex) => (
                            <input
                              key={choiceIndex}
                              type="text"
                              placeholder={`choice ${choiceIndex + 1}`}
                              value={choice}
                              onChange={(e) =>
                                updateChoice(index, choiceIndex, e.target.value)
                              }
                            />
                          ))}
                        </>
                      )}

                      {item.type !== "paragraph" && (
                        <input
                          type="text"
                          placeholder="correct answer"
                          value={item.correctAnswer}
                          onChange={(e) =>
                            updateExamItem(
                              index,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                        />
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
