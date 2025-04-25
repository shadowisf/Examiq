"use client";

import Loading from "@/app/components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import InfoMessage from "../../components/InfoMessage";
import { ResultTable } from "./_ResultTable";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type StudentResultsProps = {
  results: any[];
  resultsError: any;
  exams: any[];
};

export default function StudentResults({
  results,
  resultsError,
  exams,
}: StudentResultsProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      {isPending && <Loading />}

      <section className="one-dashboard-container">
        <h1 id="results">results</h1>

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
          <ResultTable results={results} exams={exams} />
        ) : (
          <InfoMessage>you have not submitted any exams yet</InfoMessage>
        )}
      </section>
    </>
  );
}
