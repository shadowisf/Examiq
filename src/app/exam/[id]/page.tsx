import ErrorMessage from "@/app/components/ErrorMessage";
import InfoMessage from "@/app/components/InfoMessage";
import ExamForm from "@/app/exam/[id]/components/ExamForm";
import { redirect } from "next/navigation";
import { readSingleExam } from "./actions";
import {
  readAllCourses,
  readCurrentUser,
} from "@/app/utils/default/readEntities";
import ExamOptions from "./components/ExamOptions";
import { readSingleCourse } from "@/app/course/[id]/actions";
import { formatDateTimeLocal } from "@/app/utils/default/formatDateTimeLocal";

export default async function Exam({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { currentUser, currentUserError } = await readCurrentUser();
  const { courses = [], coursesError } = await readAllCourses();
  const { exam = [], examError } = await readSingleExam(id);
  const { course = [], courseError } = await readSingleCourse(exam.course_id);

  const now = new Date().getTime();
  const deadline = new Date(exam.deadline).getTime();

  if (!currentUser?.user || currentUserError) {
    redirect("/");
  }

  return (
    <main className="exam-page">
      {examError ? (
        <ErrorMessage>failed to load exam</ErrorMessage>
      ) : (
        <>
          <section>
            <ExamOptions
              currentUser={currentUser}
              exam={exam}
              courses={courses}
              coursesError={coursesError}
            />
            <h1 className="big">{exam.name}</h1>
            <p>{exam.id}</p>

            <br />

            {courseError ? (
              <ErrorMessage>failed to load course</ErrorMessage>
            ) : (
              <InfoMessage>course name: {course.name}</InfoMessage>
            )}
            <InfoMessage>
              deadline: {formatDateTimeLocal(exam.deadline, true)}
            </InfoMessage>
            <InfoMessage>total item: {exam.items.length}</InfoMessage>
          </section>

          {now > deadline ? null : <div className="navbar-cover" />}

          <ExamForm exam={exam} currentUser={currentUser} />
        </>
      )}
    </main>
  );
}
