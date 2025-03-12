"use client";

import { useState } from "react";
import { createCourse, deleteCourse, updateCourse } from "../dashboard/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ErrorMessage from "./ErrorMessage";
import Link from "next/link";
import TeacherCoursesModal from "./TeacherCoursesModal";

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
  const [selectedCourseDescription, setSelectedCourseDescription] =
    useState("");

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
    setSelectedCourseDescription(course.description);
    setSelectedStudents(course.students?.uid || []);
  }

  function handleDelete(courseID: string) {
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
                <th>number of students</th>
                <th>date of creation</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                return (
                  <tr key={course.id}>
                    <td>
                      <Link href={`course/${course.id}`}>{course.id}</Link>
                    </td>
                    <td>{course.name}</td>
                    <td>{course.students?.uid.length || 0}</td>
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
        <TeacherCoursesModal
          isEditMode={isEditMode}
          handleConfirm={handleConfirm}
          selectedCourseName={selectedCourseName}
          selectedCourseDescription={selectedCourseDescription}
          studentsError={studentsError}
          students={students}
          selectedStudents={selectedStudents}
          toggleStudentSelection={toggleStudentSelection}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
}
