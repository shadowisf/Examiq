"use client";

import { useState } from "react";
import { handleCreateCourse } from "./_teacherActions";

type CourseProps = {
  students: any[] | null;
  studentsError: any;
  courses: any[] | null;
  courseError: any;
};

export default function Courses({
  students,
  studentsError,
  courses,
  courseError,
}: CourseProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedStudents(selectedOptions);
  };

  return (
    <>
      <section className="courses-container">
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
                <th>Id</th>
                <th>Name</th>
                <th>Date of Creation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.name}</td>
                  <td>
                    {new Date(course.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="actions-column">
                    <button>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>you have not created any courses yet</p>
        )}
      </section>

      {showModal && (
        <section className="modal">
          <div className="modal-content">
            <h1>Create New Course</h1>

            <form>
              <input
                name="course name"
                type="text"
                placeholder="Course name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <select
                name="students"
                multiple
                value={selectedStudents}
                onChange={handleStudentChange}
                required
              >
                {students?.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.display_name}
                  </option>
                ))}
              </select>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button formAction={handleCreateCourse}>Confirm</button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
