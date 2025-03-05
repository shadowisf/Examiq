"use client";

import { useState } from "react";
import { handleCreateCourse } from "./teacherActions";

type CourseProps = {
  students: any[] | null;
  studentsError: any;
  courses: any[] | null;
  courseError: any;
};

export default function TeacherCourseCreation({
  students,
  studentsError,
  courses,
  courseError,
}: CourseProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  const studentNameMap = students?.reduce((acc, student) => {
    acc[student.id] = student.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <>
      <section className="teacher-courses-container">
        <h1 id="courses">courses</h1>

        <button className="create-button" onClick={() => setShowModal(true)}>
          create new courses
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
                      <button>edit</button>
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
            <h1>create new course</h1>

            <form>
              <input
                name="course name"
                type="text"
                placeholder="course name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <select name="student" multiple required>
                {students?.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>

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
