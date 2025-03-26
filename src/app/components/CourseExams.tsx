"use client";

import Image from "next/image";
import InfoMessage from "./_InfoMessage";
import ErrorMessage from "./_ErrorMessage";
import Link from "next/link";

type CourseExamsProps = {
  course: any;
  exams: any[];
  examsError: any;
};

export default function CourseExams({
  course,
  exams,
  examsError,
}: CourseExamsProps) {
  const filteredExams = exams.filter((exam) => exam.course_id === course.id);

  return (
    <section className="exams-container">
      {examsError ? (
        <ErrorMessage>failed to load exams</ErrorMessage>
      ) : (
        filteredExams.map((exam) => {
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
