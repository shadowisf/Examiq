"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useTransition } from "react";
import ErrorMessage from "./_ErrorMessage";
import Link from "next/link";
import InfoMessage from "./_InfoMessage";
import { createExam, deleteExam, updateExam } from "../dashboard/actions";
import { ExamItem } from "../utils/default/types";
import TeacherExamsModal from "./TeacherExamsModal";
import Loading from "./_Loading";

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
  const [selectedExamType, setSelectedExamType] = useState("multiple-choice");
  const [examItems, setExamItems] = useState<ExamItem[]>([]);

  function handleSelectExamType(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedExamType(event.target.value);
  }

  function createExamItem() {
    let choices;

    switch (selectedExamType) {
      case "multiple-choice":
        choices = ["", "", ""];
        break;

      case "paragraph":
        choices = undefined;
        break;

      case "true-false":
        choices = undefined;
        break;
    }

    const newExamItem: ExamItem = {
      id: examItems.length,
      type: selectedExamType,
      question: "",
      correctAnswer: "",
      choices: choices,
    };

    setExamItems([...examItems, newExamItem]);
  }

  function updateExamItem<K extends keyof ExamItem>(
    index: number,
    field: K,
    value: ExamItem[K]
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
    setSelectedExamType("multiple-choice");
    setExamItems([]);
  }

  function handleCancel() {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedExam(null);
    setSelectedExamType("multiple-choice");
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
      setSelectedExamType("multiple-choice");
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

type ExamTableProps = {
  exams: any[];
  handleEdit: (exam: any) => void;
  handleDelete: (exam: any) => void;
};

function ExamTable({ exams, handleEdit, handleDelete }: ExamTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th className="id-column">id</th>
          <th className="id-column">course id</th>
          <th>name</th>
          <th>total items</th>
          <th>date of creation</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {exams
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((exam) => {
            return (
              <tr key={exam.id}>
                <td>{exam.id}</td>
                <td>
                  <Link href={`/course/${exam.course_id}`}>
                    {exam.course_id}
                  </Link>
                </td>
                <td>{exam.name}</td>
                <td>{exam.items ? exam.items.length : 0}</td>
                <td>
                  {new Date(exam.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="actions-column">
                  <button onClick={() => handleEdit(exam)}>
                    <Image
                      src="/icons/edit.svg"
                      width={24}
                      height={24}
                      alt="edit"
                    />
                  </button>
                  <button onClick={() => handleDelete(exam)}>
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
