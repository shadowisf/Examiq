"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ErrorMessage from "../../components/ErrorMessage";
import InfoMessage from "../../components/InfoMessage";
import Loading from "../../components/Loading";
import { ResultTable } from "./_ResultTable";
import { deleteResult } from "../actions";

type TeacherResultsProps = {
  results: any[];
  resultsError: any;
  students: any[];
  studentsError: any;
};

export default function TeacherResults({
  results,
  resultsError,
  students,
  studentsError,
}: TeacherResultsProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState("");

  async function handleEdit() {}

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

      <section className="teacher-results-container">
        <h1 id="results">results</h1>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {resultsError ? (
          <ErrorMessage>failed to load results</ErrorMessage>
        ) : results && results.length > 0 ? (
          <ResultTable
            results={results}
            students={students}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ) : (
          <InfoMessage>students have not submitted any exams yet</InfoMessage>
        )}
      </section>

      {showModal && ""}
    </>
  );
}
