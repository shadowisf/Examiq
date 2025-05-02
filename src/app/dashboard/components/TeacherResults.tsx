"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ErrorMessage from "../../components/ErrorMessage";
import InfoMessage from "../../components/InfoMessage";
import Loading from "../../components/Loading";
import { ResultTable } from "./_ResultTable";
import { deleteResult, updateResult } from "../actions";
import Image from "next/image";
import TeacherResultsModal from "./TeacherResultsModal";

type TeacherResultsProps = {
  results: any[];
  resultsError: any;
  students: any[];
  studentsError: any;
  exams: any[];
};

export default function TeacherResults({
  results,
  resultsError,
  students,
  exams,
}: TeacherResultsProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  function handleUpdatedContentStatuses(formData: FormData, result: any) {
    const updatedContents = result.contents.map((content: any) => {
      const statusKey = `status-${content.id}`;
      const newStatus = formData.get(statusKey);
      return {
        ...content,
        status: newStatus,
      };
    });

    return {
      ...result,
      contents: updatedContents,
    };
  }

  function handleCancel() {
    setShowModal(false);
    setError("");
  }

  function handleEdit(selectedResult: any) {
    setShowModal(true);
    setSelectedResult(selectedResult);
  }

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
      setShowModal(false);
      setError("");
    });
  }

  async function handleConfirm(formData: FormData) {
    startTransition(async () => {
      const updatedContent = handleUpdatedContentStatuses(
        formData,
        selectedResult
      );

      const actionResult = await updateResult(updatedContent);

      if (actionResult?.error) {
        setError(actionResult.error.message);
      }

      setShowModal(false);
    });
  }

  async function handleDelete(selectedResult: any) {
    startTransition(async () => {
      const isConfirmed = window.confirm(
        "are you sure you want to delete this result?"
      );

      if (isConfirmed) {
        const result = await deleteResult(selectedResult);

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
        <h1 id="results">results</h1>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="button-container">
          <button onClick={handleRefresh}>
            <Image
              src={"/icons/refresh.svg"}
              width={24}
              height={24}
              alt={"refresh"}
            />
          </button>
        </div>

        {resultsError ? (
          <ErrorMessage>failed to load results</ErrorMessage>
        ) : results && results.length > 0 ? (
          <ResultTable
            results={results}
            students={students}
            exams={exams}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ) : (
          <InfoMessage>students have not submitted any exams yet</InfoMessage>
        )}
      </section>

      {showModal && (
        <TeacherResultsModal
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
          selectedResult={selectedResult}
        />
      )}
    </>
  );
}
