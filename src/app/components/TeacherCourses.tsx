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

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

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
      updateCourse(formData, selectedCourse, selectedStudents);
    } else {
      createCourse(formData, selectedStudents);
    }

    setShowModal(false);
  }

  function handleEdit(course: any) {
    setIsEditMode(true);
    setShowModal(true);
    setSelectedCourse(course);
    setSelectedStudents(course.students?.uid || []);
  }

  async function handleDelete(id: string) {
    const isConfirmed = window.confirm(
      "are you sure you want to delete this course?"
    );

    if (isConfirmed) {
      const result = await deleteCourse(id);

      if (result?.error) {
        alert(result.error.message);
      }
    }
  }

  return (
    <>
      <section className="teacher-courses-container">
        <h1 id="courses">courses</h1>

        <div className="button-container">
          <button onClick={handleCreate}>
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
                      <button onClick={() => handleDelete(course.id)}>
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
