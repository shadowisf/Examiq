"use client";

import { useState } from "react";
import CourseModal from "./TeacherCoursesModal";

type CourseProps = {
  courses: any[] | null;
  courseError: any;
  uid: string;
};

export default function Courses({ courses, courseError, uid }: CourseProps) {
  
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="courses-container">
      <h1 id="courses">courses</h1>

      <button className="create-button" onClick={() => setShowModal(true)}>
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
              <th>date of creation</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {courses
              .filter((course) => course.author === uid)
              .map((course) => (
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
                    <button>edit</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>no courses available</p>
      )}

      {showModal && <CourseModal setShowModal={setShowModal} />}
    </section>
  );
}
