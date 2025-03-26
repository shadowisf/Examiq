"use client";

import { useState, useTransition } from "react";
import { createCourse, deleteCourse, updateCourse } from "../dashboard/actions";
import { redirect, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import ErrorMessage from "./_ErrorMessage";
import Link from "next/link";
import TeacherCoursesModal from "./TeacherCoursesModal";
import InfoMessage from "./_InfoMessage";
import Loading from "./_Loading";

type TeacherCourseProps = {
  students: any[];
  studentsError: any;
  courses: any[];
  courseError: any;
  exams: any[];
  examsError: any;
};

export default function TeacherCourses({
  students,
  studentsError,
  courses,
  courseError,
  exams,
  examsError,
}: TeacherCourseProps) {
  const router = useRouter();
  const path = usePathname();

  const [isPending, startTransition] = useTransition();

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
    setIsEditMode(false);
    setSelectedStudents([]);
    setSelectedCourse(null);
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
    startTransition(() => {
      router.refresh();
      setShowModal(false);
      setIsEditMode(false);
      setError("");
      setSelectedStudents([]);
      setSelectedCourse(null);
    });
  }

  async function handleConfirm(formData: any) {
    startTransition(async () => {
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
    });
  }

  async function handleDelete(exam: any) {
    startTransition(async () => {
      const isConfirmed = window.confirm(
        "are you sure you want to delete this course?"
      );

      if (isConfirmed) {
        const result = await deleteCourse(exam);

        if (result?.error) {
          setError(result.error.message);
        }
      }
    });
  }

  return (
    <>
      {isPending && <Loading />}

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
          <CourseTable
            courses={courses}
            exams={exams}
            examsError={examsError}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
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

type CourseTableProps = {
  courses: any[];
  exams: any[];
  examsError: any;
  handleEdit: (course: any) => void;
  handleDelete: (course: any) => void;
};

function CourseTable({
  courses,
  exams,
  examsError,
  handleEdit,
  handleDelete,
}: CourseTableProps) {
  return (
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
        {courses
          .sort((a, b) => b.name.localeCompare(a.name))
          .map((course) => {
            return (
              <tr key={course.id}>
                <td>
                  <Link href={`course/${course.id}`}>{course.id}</Link>
                </td>
                <td>{course.name}</td>
                <td>{course.students?.uid.length || 0}</td>
                <td>
                  {examsError
                    ? "?"
                    : exams.filter((exam) => exam.course_id === course.id)
                        .length}
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
  );
}
