"use client";

import InfoMessage from "@/app/components/InfoMessage";
import Link from "next/link";
import Image from "next/image";
import ErrorMessage from "@/app/components/ErrorMessage";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Loading from "@/app/components/Loading";
import { formatDateTimeLocal } from "@/app/utils/default/formatDateTimeLocal";

type StudentExamsProps = {
  results: any[];
  resultsError: any;
  exams: any[];
  examsError: any;
};

export default function StudentExams({
  results,
  resultsError,
  exams,
  examsError,
}: StudentExamsProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const now = new Date().getTime();

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      {isPending && <Loading />}

      <section className="one-dashboard-container student-exams-container">
        <h1 id="exams">exams</h1>

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

        <div className="exams-container">
          {examsError || resultsError ? (
            <ErrorMessage>failed to load exams</ErrorMessage>
          ) : exams && exams.length > 0 ? (
            exams.map((exam) => {
              const matchedResult = results.find(
                (result) => result.exam_id === exam.id
              );
              const deadline = new Date(exam.deadline).getTime();
              const isDeadlinePassed = deadline < now;

              return (
                <Link
                  href={
                    matchedResult
                      ? `/result/${matchedResult.id}`
                      : `/exam/${exam.id}`
                  }
                  key={exam.id}
                  className={!matchedResult && isDeadlinePassed ? "dnf" : ""}
                >
                  <div className="left">
                    <Image
                      src={"/icons/file.svg"}
                      width={32}
                      height={32}
                      alt="file"
                    />
                    <div>
                      <h4>{exam.name}</h4>
                      <InfoMessage>{exam.course_name}</InfoMessage>
                    </div>
                  </div>

                  <div className="right">
                    {matchedResult ? (
                      <p>
                        {matchedResult.score}/{exam.items.length} |{" "}
                        {matchedResult.likelihood_of_cheating}% cheating
                      </p>
                    ) : isDeadlinePassed ? (
                      <p>❌ | did not attempt</p>
                    ) : null}

                    <InfoMessage>
                      {formatDateTimeLocal(exam.deadline, true)}
                    </InfoMessage>
                  </div>
                </Link>
              );
            })
          ) : (
            <InfoMessage>all exams done</InfoMessage>
          )}
        </div>
      </section>
    </>
  );
}
