"use client";

import Image from "next/image";
import InfoMessage from "../../../components/InfoMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import Link from "next/link";
import { formatDateTimeLocal } from "@/app/utils/default/formatDateTimeLocal";

type CourseExamsProps = {
  exams: any[];
  examsError: any;
  results: any[];
  resultsError: any;
  currentUser: any;
};

export default function CourseExams({
  exams,
  examsError,
  results,
  resultsError,
  currentUser,
}: CourseExamsProps) {
  const now = new Date().getTime();

  return (
    <section className="exams-container">
      <h1 id="exams">exams</h1>
      {examsError || resultsError ? (
        <ErrorMessage>failed to load exams</ErrorMessage>
      ) : exams && exams.length > 0 ? (
        currentUser.user.user_metadata.role === "teacher" ? (
          exams.map((exam) => {
            return (
              <Link href={`/exam/${exam.id}`} key={exam.id}>
                <div className="left">
                  <Image
                    src={"/icons/file.svg"}
                    width={32}
                    height={32}
                    alt="file"
                  />

                  <div>
                    <h4>{exam.name}</h4>
                    <InfoMessage>exam</InfoMessage>
                  </div>
                </div>

                <div className="right">
                  <InfoMessage>
                    {formatDateTimeLocal(exam.deadline, true)}
                  </InfoMessage>
                </div>
              </Link>
            );
          })
        ) : (
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
                className={matchedResult || isDeadlinePassed ? "dnf" : ""}
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
                    <InfoMessage>exam</InfoMessage>
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
        )
      ) : null}
    </section>
  );
}
