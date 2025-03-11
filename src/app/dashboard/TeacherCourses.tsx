"use client";

import { useState, useMemo } from "react";
import {
  createCourse,
  deleteCourse,
  updateCourse,
} from "./teacherCoursesActions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ErrorMessage from "../components/ErrorMessage";

type TeacherCourseProps = {
  students: any[] | null;
  studentsError: any;
  courses: any[] | null;
  courseError: any;
};

export default function TeacherCourses({
  students,
  studentsError,
  courses,
  courseError,
}: TeacherCourseProps) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedCourseID, setSelectedCourseID] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("");

  const studentNameMap = useMemo(
    () =>
      students?.reduce((acc, student) => {
        acc[student.id] = student.name;
        return acc;
      }, {} as Record<string, string>),
    [students]
  );

  function toggleStudentSelection(studentID: string) {
    setSelectedStudents((prev) =>
      prev.includes(studentID)
        ? prev.filter((id) => id !== studentID)
        : [...prev, studentID]
    );
  }

  function handleCancel() {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedStudents([]);
  }

  function handleCreate() {
    setIsEditMode(false);
    setSelectedStudents([]);
    setShowModal(true);
  }

  function handleConfirm(formData: any) {
    if (isEditMode) {
      updateCourse(formData, selectedCourseID, selectedStudents);
    } else {
      createCourse(formData, selectedStudents);
    }

    setShowModal(false);
  }

  function handleEdit(course: any) {
    setIsEditMode(true);
    setShowModal(true);
    setSelectedCourseID(course.id);
    setSelectedCourseName(course.name);
    setSelectedStudents(course.students?.uid || []);
  }

  async function handleDelete(courseID: string) {
    const isConfirmed = window.confirm(
      "are you sure you want to delete this course?"
    );

    if (isConfirmed) {
      deleteCourse(courseID);
    }
  }

  return (
    <>
      <section className="teacher-courses-container">
        <h1 id="courses">courses</h1>

        <div className="button-container">
          <button className="create-button" onClick={handleCreate}>
            <Image
              src={"/icons/plus.svg"}
              width={20}
              height={20}
              alt="create"
            />
          </button>

          <button onClick={() => router.refresh()}>
            <Image
              src={"/icons/refresh.svg"}
              width={20}
              height={20}
              alt={"refresh"}
            />
          </button>
        </div>

        {courseError ? (
          <ErrorMessage message="failed to load courses" />
        ) : courses && courses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="id-column">id</th>
                <th>name</th>
                <th>students</th>
                <th>date of creation</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const studentIDs = course.students?.uid || [];

                const studentNames = studentIDs.map(
                  (studentId: string) => studentNameMap[studentId]
                );

                return (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.name}</td>
                    <td>
                      <ul>
                        {studentNames.length > 0 ? (
                          studentNames.map((name: string, index: number) => (
                            <li key={index}>{name}</li>
                          ))
                        ) : (
                          <li>none</li>
                        )}
                      </ul>
                    </td>
                    <td>
                      {new Date(course.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="actions-column">
                      <button onClick={() => handleEdit(course)}>
                        <Image
                          src="/icons/edit.svg"
                          width={20}
                          height={20}
                          alt="edit"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="delete-button"
                      >
                        <Image
                          src={"/icons/trash.svg"}
                          width={20}
                          height={20}
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
          <p className="gray">you have not created any courses yet.</p>
        )}
      </section>

      {showModal && (
        <section className="modal">
          <div className="modal-content">
            <h1>{isEditMode ? "edit course" : "create new course"}</h1>

            <form action={(formData) => handleConfirm(formData)}>
              <input
                name="course name"
                type="text"
                placeholder="name"
                required
                defaultValue={isEditMode ? selectedCourseName : ""}
              />

              <div>
                <h4>students:</h4>

                {studentsError ? (
                  <ErrorMessage message="failed to load student table" />
                ) : (
                  students?.map((student) => (
                    <label key={student.id} className="student-checkbox">
                      <input
                        type="checkbox"
                        value={student.id}
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                      />
                      {student.name}
                    </label>
                  ))
                )}
              </div>

              <br />

              <div className="modal-actions">
                <button type="button" onClick={handleCancel}>
                  cancel
                </button>
                <button type="submit">confirm</button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
