"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useTransition } from "react";
import ErrorMessage from "../../components/ErrorMessage";
import InfoMessage from "../../components/InfoMessage";
import { createExam, deleteExam, updateExam } from "../actions";
import TeacherExamsModal from "./TeacherExamsModal";
import Loading from "../../components/Loading";
import { ExamTable } from "./_ExamTable";

type TeacherExamsProps = {
  courses: any[];
  coursesError: any;
  exams: any[];
  examsError: any;
};

export default function TeacherExams({
  courses,
  coursesError,
  exams,
  examsError,
}: TeacherExamsProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState("");

  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [selectedExamType, setSelectedExamType] = useState("");
  const [examItems, setExamItems] = useState<any[]>([]);

  function handleSelectExamType(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedExamType(event.target.value);
  }

  function createExamItem() {
    if (!selectedExamType) {
      return;
    }

    const newExamItem: any = {
      id: examItems.length,
      type: selectedExamType,
      question: "",
      correctAnswer: "",
      choices:
        selectedExamType === "multiple-choice" ? ["", "", ""] : undefined,
    };

    setExamItems([...examItems, newExamItem]);
  }

  function updateExamItem<K extends keyof any>(
    index: number,
    field: K,
    value: any[K]
  ) {
    const updatedItems = [...examItems];
    updatedItems[index][field] = value as never;

    setExamItems(updatedItems);
  }

  function updateExamItemChoice(
    itemIndex: number,
    choiceIndex: number,
    value: string
  ) {
    const updatedItems = [...examItems];

    if (updatedItems[itemIndex].choices) {
      updatedItems[itemIndex].choices![choiceIndex] = value;
    }

    setExamItems(updatedItems);
  }

  function deleteExamItem(index: number) {
    setExamItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }

  function handleCreate() {
    setShowModal(true);
    setIsEditMode(false);
    setSelectedExam(null);
    setSelectedExamType("");
    setExamItems([]);
  }

  function handleCancel() {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedExam(null);
    setSelectedExamType("");
    setExamItems([]);
  }

  function handleEdit(exam: any) {
    setIsEditMode(true);
    setShowModal(true);
    setSelectedExam(exam);
    setExamItems(exam.items);
  }

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
      setShowModal(false);
      setIsEditMode(false);
      setError("");
      setSelectedExam(null);
      setSelectedExamType("");
      setExamItems([]);
    });
  }

  async function handleConfirm(formData: any) {
    startTransition(async () => {
      let result;

      if (isEditMode) {
        result = await updateExam(formData, selectedExam, examItems);
      } else {
        result = await createExam(formData, examItems);
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
        "are you sure you want to delete this exam?"
      );

      if (isConfirmed) {
        const result = await deleteExam(exam);

        if (result?.error) {
          setError(result.error.message);
        }
      }
    });
  }

  return (
    <>
      {isPending && <Loading />}

      <section className="teacher-exams-container">
        <h1 id="exams">exams</h1>

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

        {examsError ? (
          <ErrorMessage>failed to load exams</ErrorMessage>
        ) : exams && exams.length > 0 ? (
          <ExamTable
            exams={exams}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ) : (
          <InfoMessage>you have not created any exams yet</InfoMessage>
        )}
      </section>

      {showModal && (
        <TeacherExamsModal
          isEditMode={isEditMode}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
          courses={courses}
          coursesError={coursesError}
          selectedExam={selectedExam}
          examItems={examItems}
          handleSelectExamType={handleSelectExamType}
          createExamItem={createExamItem}
          updateExamItem={updateExamItem}
          updateChoice={updateExamItemChoice}
          deleteExamItem={deleteExamItem}
        />
      )}
    </>
  );
}
