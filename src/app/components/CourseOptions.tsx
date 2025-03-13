"use client";

import Image from "next/image";
import { useState } from "react";
import { updateCourse, deleteCourse } from "../dashboard/actions";
import TeacherCoursesModal from "./TeacherCoursesModal";
import { redirect } from "next/navigation";

type CourseOptionsProps = {
  currentUser: any;
  course: any;
  students: any[] | null;
  studentsError: any;
};

export default function CourseOptions({
  currentUser,
  course,
  students,
  studentsError,
}: CourseOptionsProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  function toggleStudentSelection(studentID: string) {
    setSelectedStudents((prev) =>
      prev.includes(studentID)
        ? prev.filter((id) => id !== studentID)
        : [...prev, studentID]
    );
  }

  function handleCancel() {
    setShowModal(false);
    setSelectedStudents([]);
  }

  function handleConfirm(formData: any) {
    updateCourse(formData, course.id, selectedStudents);

    setShowModal(false);
  }

  function handleEdit() {
    setShowModal(true);
    setSelectedStudents(course.students.uid || []);
  }

  function handleDelete() {
    const isConfirmed = window.confirm(
      "are you sure you want to delete this course?"
    );

    if (isConfirmed) {
      deleteCourse(course.id);
      redirect("/dashboard");
    }
  }

  return currentUser.user.user_metadata.role === "teacher" ? (
    <>
      <div className="button-container">
        <button onClick={handleEdit}>
          <Image src={"/icons/edit.svg"} width={24} height={24} alt="edit" />
        </button>
        <button className="delete-button" onClick={handleDelete}>
          <Image src={"/icons/trash.svg"} width={24} height={24} alt="delete" />
        </button>
      </div>

      <br />

      {showModal && (
        <TeacherCoursesModal
          isEditMode={true}
          handleConfirm={handleConfirm}
          selectedCourseName={course.name}
          selectedCourseDescription={course.description}
          studentsError={studentsError}
          students={students}
          selectedStudents={selectedStudents}
          toggleStudentSelection={toggleStudentSelection}
          handleCancel={handleCancel}
        />
      )}
    </>
  ) : null;
}
