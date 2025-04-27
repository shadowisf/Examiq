"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { updateCourse } from "../../../dashboard/actions";
import TeacherCoursesModal from "../../../dashboard/components/TeacherCoursesModal";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";

type CourseOptionsProps = {
  currentUser: any;
  course: any;
  students: any[];
  studentsError: any;
};

export default function CourseOptions({
  currentUser,
  course,
  students,
  studentsError,
}: CourseOptionsProps) {
  const [isPending, startTransition] = useTransition();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  function toggleStudentSelection(studentID: string) {
    setSelectedStudents((prev) =>
      prev.includes(studentID)
        ? prev.filter((id) => id !== studentID)
        : [...prev, studentID]
    );
  }

  function handleEdit() {
    setShowModal(true);
    setSelectedStudents(course.students.id || []);
  }

  function handleCancel() {
    setShowModal(false);
    setSelectedStudents([]);
  }

  async function handleConfirm(formData: any) {
    startTransition(async () => {
      const result = await updateCourse(formData, course, selectedStudents);

      if (result?.error) {
        setError(result.error.message);
      }

      setShowModal(false);
    });
  }

  return (
    currentUser.user.user_metadata.role === "teacher" && (
      <>
        {isPending && <Loading />}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <button onClick={handleEdit}>
          <Image src={"/icons/edit.svg"} width={24} height={24} alt="edit" />
        </button>

        <br />

        {showModal && (
          <TeacherCoursesModal
            isEditMode={true}
            handleConfirm={handleConfirm}
            selectedCourse={course}
            studentsError={studentsError}
            students={students}
            selectedStudents={selectedStudents}
            toggleStudentSelection={toggleStudentSelection}
            handleCancel={handleCancel}
          />
        )}
      </>
    )
  );
}
