"use client";

import Image from "next/image";
import InfoMessage from "../../../components/InfoMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import Link from "next/link";

type CourseExamsProps = {
  exams: any[];
  examsError: any;
};

export default function CourseExams({ exams, examsError }: CourseExamsProps) {
  return (
    <section className="exams-container">
      {examsError ? (
        <ErrorMessage>failed to load exams</ErrorMessage>
      ) : (
        exams.map((exam) => {
          return (
            <Link href={`/exam/${exam.id}`} key={exam.id}>
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
            </Link>
          );
        })
      )}
    </section>
  );
}
