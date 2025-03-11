"use client";

import { useState } from "react";
import { createCourse, deleteCourse, updateCourse } from "./teacherActions";
import { useRouter } from "next/navigation";

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

  const studentNameMap = students?.reduce((acc, student) => {
    acc[student.id] = student.name;
    return acc;
  }, {} as Record<string, string>);

  function toggleStudentSelection(studentId: string) {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  }

  return (
    <>
      <section className="teacher-courses-container">
        <h1 id="courses">courses</h1>

        <div className="button-container">
          <button
            className="create-button"
            onClick={() => {
              setIsEditMode(false);
              setSelectedStudents([]);
              setShowModal(true);
            }}
          >
            create new course
          </button>

          <button onClick={() => router.refresh()}>refresh</button>
        </div>

        {courseError ? (
          <p style={{ color: "red" }}>failed to load courses</p>
        ) : courses && courses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>students</th>
                <th>date of creation</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const studentIds = course.students?.uid || [];

                const studentNames = studentIds.map(
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
                      <button
                        onClick={() => {
                          setIsEditMode(true);
                          setShowModal(true);
                          setSelectedCourseID(course.id);
                          setSelectedCourseName(course.name);
                        }}
                      >
                        edit
                      </button>

                      <button
                        className="delete"
                        onClick={() => {
                          const isConfirmed = window.confirm(
                            "are you sure you want to delete this course?"
                          );

                          if (isConfirmed) {
                            deleteCourse(course.id);
                          }
                        }}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="gray">you have not created any courses yet</p>
        )}
      </section>

      {showModal && (
        <section className="modal">
          <div className="modal-content">
            {isEditMode ? <h1>edit course</h1> : <h1>create new course</h1>}

            <form
              action={
                isEditMode
                  ? (formData) =>
                      updateCourse(formData, selectedCourseID, selectedStudents)
                  : (formData) => createCourse(formData, selectedStudents)
              }
            >
              <input
                name="course name"
                type="text"
                placeholder="course name"
                required
                defaultValue={isEditMode ? selectedCourseName : ""}
              />

              <div>
                <h4>students:</h4>

                {studentsError ? (
                  <p style={{ color: "red" }}>failed to load student table</p>
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
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditMode(false);
                    setSelectedStudents([]);
                  }}
                >
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
