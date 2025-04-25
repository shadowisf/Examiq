"use client";

import InfoMessage from "@/app/components/InfoMessage";
import Link from "next/link";
import Image from "next/image";
import ErrorMessage from "@/app/components/ErrorMessage";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Loading from "@/app/components/Loading";

type StudentExamsProps = {
  exams: any[];
  examsError: any;
};

export default function StudentExams({ exams, examsError }: StudentExamsProps) {
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
          {examsError ? (
            <ErrorMessage>failed to load exams</ErrorMessage>
          ) : exams && exams.length > 0 ? (
            exams.map((exam) => (
              <Link href={`/exam/${exam.id}`} key={exam.id}>
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
              </Link>
            ))
          ) : (
            <InfoMessage>all exams done</InfoMessage>
          )}
        </div>
      </section>
    </>
  );
}
