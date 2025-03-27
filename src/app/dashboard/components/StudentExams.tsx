"use client";

import InfoMessage from "@/app/components/InfoMessage";
import Link from "next/link";
import Image from "next/image";
import ErrorMessage from "@/app/components/ErrorMessage";

type StudentExamsProps = {
  exams: any[];
  examsError: any;
};

export default function StudentExams({ exams, examsError }: StudentExamsProps) {
  return (
    <section className="student-exams-container">
      <h1 id="exams">exams</h1>

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
          <InfoMessage>exams done!</InfoMessage>
        )}
      </div>
    </section>
  );
}
