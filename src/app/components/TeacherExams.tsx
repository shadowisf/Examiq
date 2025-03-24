"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import Link from "next/link";
import InfoMessage from "./InfoMessage";
import { updateExam, createExam, deleteExam } from "../dashboard/actions";

type TeacherExamsProps = {
  courses: any[] | null;
  coursesError: any;
  exams: any[] | null;
  examsError: any;
};

export default function TeacherExams({
  courses,
  coursesError,
  exams,
  examsError,
}: TeacherExamsProps) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState("");

  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [selectedExamType, setSelectedExamType] = useState("");
  const [examPreviews, setExamPreviews] = useState<any>(null);

  function handleCreate() {
    setShowModal(true);
  }

  function handleCancel() {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedExam(null);
  }

  function handleEdit(exam: any) {
    setIsEditMode(true);
    setShowModal(true);
    setSelectedExam(exam);
  }

  function handleRefresh() {
    router.refresh();
    setShowModal(false);
    setIsEditMode(false);
    setError("");
    setSelectedExam(null);
  }

  function handleSelectExamType(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedExamType(event.target.value);
  }

  function createExamPreview(formData: FormData) {}

  async function handleConfirm(formData: any) {
    let result;

    if (isEditMode) {
      result = await updateExam(formData, selectedExam);
    } else {
      result = await createExam(formData);
    }

    if (result?.error) {
      setError(result.error.message);
    }

    setShowModal(false);
  }

  async function handleDelete(exam: any) {
    const isConfirmed = window.confirm(
      "are you sure you want to delete this exam?"
    );

    if (isConfirmed) {
      const result = await deleteExam(exam);

      if (result?.error) {
        setError(result.error.message);
      }
    }
  }

  return (
    <>
      <section className="teacher-exams-container">
        <h1 id="exams">exams</h1>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="button-container">
          <button onClick={handleCreate}>
            <Image
              src={"/icons/plus.svg"}
              width={24}
              height={24}
              alt="create"
            />
          </button>

          <button onClick={handleRefresh}>
            <Image
              src={"/icons/refresh.svg"}
              width={24}
              height={24}
              alt={"refresh"}
            />
          </button>
        </div>

        {examsError ? (
          <ErrorMessage>failed to load exams</ErrorMessage>
        ) : exams && exams.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="id-column">id</th>
                <th className="id-column">course id</th>
                <th>name</th>
                <th>total items</th>
                <th>date of creation</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {exams
                .sort((a, b) => a.name - b.name)
                .map((exam) => {
                  return (
                    <tr key={exam.id}>
                      <td>{exam.id}</td>
                      <td>
                        <Link href={`/course/${exam.course_id}`}>
                          {exam.course_id}
                        </Link>
                      </td>
                      <td>{exam.name}</td>
                      <td>{exam.items ? exam.items.length : 0}</td>
                      <td>
                        {new Date(exam.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="actions-column">
                        <button onClick={() => {}}>
                          <Image
                            src="/icons/edit.svg"
                            width={24}
                            height={24}
                            alt="edit"
                          />
                        </button>
                        <button onClick={() => handleDelete(exam.id)}>
                          <Image
                            src={"/icons/trash.svg"}
                            width={24}
                            height={24}
                            alt="delete"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <InfoMessage>you have not created any exams yet</InfoMessage>
        )}
      </section>

      {showModal && (
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
                <select name="exam course" required>
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

                <div className="exam-create-container">
                  <h4>exam items:</h4>

                  <div className="controls">
                    <select onChange={handleSelectExamType}>
                      <option value="multiple-choice">multiple choice</option>
                      <option value="paragraph">paragraph</option>
                      <option value="fill-in-the-blank">
                        fill in the blank
                      </option>
                    </select>
                    <button>
                      <Image
                        src={"/icons/plus.svg"}
                        width={24}
                        height={24}
                        alt="create"
                      />
                    </button>
                  </div>
                </div>

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
      )}
    </>
  );
}
