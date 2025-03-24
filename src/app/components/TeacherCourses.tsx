"use client";

import { useState } from "react";
import { createCourse, deleteCourse, updateCourse } from "../dashboard/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ErrorMessage from "./ErrorMessage";
import Link from "next/link";
import TeacherCoursesModal from "./TeacherCoursesModal";
import InfoMessage from "./InfoMessage";

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
  const [error, setError] = useState("");

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  function toggleStudentSelection(studentID: string) {
    setSelectedStudents((prev) =>
      prev.includes(studentID)
        ? prev.filter((id) => id !== studentID)
        : [...prev, studentID]
    );
  }

  function handleCreate() {
    setShowModal(true);
  }

  function handleCancel() {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedStudents([]);
    setSelectedCourse(null);
  }

  function handleEdit(course: any) {
    setIsEditMode(true);
    setShowModal(true);
    setSelectedCourse(course);
    setSelectedStudents(course.students?.uid);
  }

  function handleRefresh() {
    router.refresh();
    setShowModal(false);
    setIsEditMode(false);
    setError("");
    setSelectedStudents([]);
    setSelectedCourse(null);
  }

  async function handleConfirm(formData: any) {
    let result;

    if (isEditMode) {
      result = await updateCourse(formData, selectedCourse, selectedStudents);
    } else {
      result = await createCourse(formData, selectedStudents);
    }

    if (result?.error) {
      setError(result.error.message);
    }

    setShowModal(false);
  }

  async function handleDelete(exam: any) {
    const isConfirmed = window.confirm(
      "are you sure you want to delete this course?"
    );

    if (isConfirmed) {
      const result = await deleteCourse(exam);

      if (result?.error) {
        setError(result.error.message);
      }
    }
  }

  return (
    <>
      <section className="teacher-courses-container">
        <h1 id="courses">courses</h1>

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

        {courseError ? (
          <ErrorMessage>failed to load courses</ErrorMessage>
        ) : courses && courses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="id-column">id</th>
                <th>name</th>
                <th>total students</th>
                <th>total exams</th>
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
                    <td>{course.exams?.id.length || 0}</td>
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
                          width={24}
                          height={24}
                          alt="edit"
                        />
                      </button>
                      <button onClick={() => handleDelete(course)}>
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
          <InfoMessage>you have not created any courses yet</InfoMessage>
        )}
      </section>

      {showModal && (
        <TeacherCoursesModal
          isEditMode={isEditMode}
          handleConfirm={handleConfirm}
          selectedCourse={selectedCourse}
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
