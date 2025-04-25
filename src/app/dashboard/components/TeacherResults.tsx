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

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [selectedResult, setSelectedResult] = useState<any>(null);

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
      const result = await updateResult(formData, selectedResult);

      if (result?.error) {
        setError(result.error.message);
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
