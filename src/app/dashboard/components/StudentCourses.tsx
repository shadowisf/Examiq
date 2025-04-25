"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import { CourseTable } from "./_CourseTable";
import InfoMessage from "@/app/components/InfoMessage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Loading from "@/app/components/Loading";

type StudentCoursesProps = {
  courses: any[];
  coursesError: any;
  exams: any[];
  examsError: any;
};

export default function StudentCourses({
  courses,
  coursesError,
  exams,
  examsError,
}: StudentCoursesProps) {
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
        <h1 id="courses">courses</h1>

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

        {coursesError ? (
          <ErrorMessage>failed to load course table</ErrorMessage>
        ) : courses && courses.length > 0 ? (
          <CourseTable
            courses={courses}
            exams={exams}
            examsError={examsError}
          />
        ) : (
          <InfoMessage>no enrolled courses</InfoMessage>
        )}
      </section>
    </>
  );
}
