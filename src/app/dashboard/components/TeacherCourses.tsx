"use client";

import { useState, useTransition } from "react";
import { createCourse, deleteCourse, updateCourse } from "../actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ErrorMessage from "../../components/ErrorMessage";
import TeacherCoursesModal from "./TeacherCoursesModal";
import InfoMessage from "../../components/InfoMessage";
import Loading from "../../components/Loading";
import { CourseTable } from "./_CourseTable";

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

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState("");
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
    setSelectedStudents(course.students?.id);
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

      <section className="one-dashboard-container">
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
