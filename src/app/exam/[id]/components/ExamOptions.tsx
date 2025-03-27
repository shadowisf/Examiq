"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import TeacherExamsModal from "@/app/dashboard/components/TeacherExamsModal";
import { updateExam } from "@/app/dashboard/actions";

type ExamOptions = {
  currentUser: any;
  exam: any;
  courses: any[];
  coursesError: any;
};

export default function ExamOptions({
  currentUser,
  exam,
  courses,
  coursesError,
}: ExamOptions) {
  const [isPending, startTransition] = useTransition();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [selectedExamType, setSelectedExamType] = useState("multiple-choice");
  const [examItems, setExamItems] = useState<any[]>([]);

  function handleSelectExamType(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedExamType(event.target.value);
  }

  function createExamItem() {
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

  function handleCancel() {
    setShowModal(false);
    setSelectedExamType("multiple-choice");
    setExamItems([]);
  }

  function handleEdit() {
    setShowModal(true);
    setExamItems(exam.items);
  }

  async function handleConfirm(formData: any) {
    startTransition(async () => {
      const result = await updateExam(formData, exam, examItems);

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
          <TeacherExamsModal
            isEditMode={true}
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
            courses={courses}
            coursesError={coursesError}
            selectedExam={exam}
            examItems={examItems}
            handleSelectExamType={handleSelectExamType}
            createExamItem={createExamItem}
            updateExamItem={updateExamItem}
            updateChoice={updateExamItemChoice}
            deleteExamItem={deleteExamItem}
          />
        )}
      </>
    )
  );
}
