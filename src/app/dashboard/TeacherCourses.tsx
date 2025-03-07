"use client";

import { useState } from "react";
import { handleCreateCourse } from "./teacherActions";

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
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [courseName, setCourseName] = useState("");

  function toggleStudentSelection(studentId: string) {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  }

  const studentNameMap = students?.reduce((acc, student) => {
    acc[student.id] = student.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <>
      <section className="teacher-courses-container">
        <h1 id="courses">courses</h1>

        <button
          className="create-button"
          onClick={() => {
            setIsEditMode(false);
            setSelectedStudents([]);
            setCourseName("");
            setShowModal(true);
          }}
        >
          create new course
        </button>

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
                const studentNames = Object.values(course.students || {}).map(
                  (studentId: any) => studentNameMap[studentId] || "Unknown"
                );

                return (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.name}</td>
                    <td>
                      <ul>
                        {studentNames.map((name, index) => (
                          <li key={index}>{name}</li>
                        ))}
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
                        }}
                      >
                        edit
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

            <form>
              <input
                name="course name"
                type="text"
                placeholder="course name"
                required
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
                <button type="button" onClick={() => setShowModal(false)}>
                  cancel
                </button>
                <button formAction={handleCreateCourse}>confirm</button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
