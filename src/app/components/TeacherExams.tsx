"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { createExam, deleteExam, updateExam } from "../course/[id]/actions";
import Link from "next/link";

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

  const [selectedExamID, setSelectedExamID] = useState("");
  const [selectedExamName, setSelectedExamName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  function handleCancel() {
    setShowModal(false);
    setIsEditMode(false);
  }

  function handleCreate() {
    setIsEditMode(false);
    setShowModal(true);
  }

  function handleConfirm(formData: any) {
    if (isEditMode) {
      updateExam(formData, selectedExamID);
    } else {
      createExam(formData);
    }

    setShowModal(false);
  }

  function handleEdit(exam: any) {
    setIsEditMode(true);
    setShowModal(true);
    setSelectedExamID(exam.id);
    setSelectedExamName(exam.name);
    setSelectedCourse(exam.course_id);
  }

  function handleDelete(id: string) {
    const isConfirmed = window.confirm(
      "are you sure you want to delete this exam?"
    );

    if (isConfirmed) {
      deleteExam(id);
    }
  }

  return (
    <>
      <section className="teacher-exams-container">
        <h1 id="exams">exams</h1>

        <div className="button-container">
          <button className="accent" onClick={handleCreate}>
            <Image
              src={"/icons/plus.svg"}
              width={24}
              height={24}
              alt="create"
            />
          </button>

          <button onClick={() => router.refresh()}>
            <Image
              src={"/icons/refresh.svg"}
              width={24}
              height={24}
              alt={"refresh"}
            />
          </button>
        </div>

        {examsError ? (
          <ErrorMessage message="failed to load courses" />
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
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="accent"
                        >
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
          <p className="gray">you have not created any exams yet.</p>
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
                defaultValue={isEditMode ? selectedExamName : ""}
              />

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
          </div>
        </section>
      )}
    </>
  );
}
