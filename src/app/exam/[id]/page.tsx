import ErrorMessage from "@/app/components/ErrorMessage";
import InfoMessage from "@/app/components/InfoMessage";
import ExamForm from "@/app/exam/[id]/components/ExamForm";
import { redirect } from "next/navigation";
import { readSingleExam } from "./actions";
import { readAllCourses, readCurrentUser } from "@/app/utils/default/read";
import ExamOptions from "./components/ExamOptions";
import { readSingleCourse } from "@/app/course/[id]/actions";

export default async function Course({ params }: { params: { id: string } }) {
  const { currentUser, currentUserError } = await readCurrentUser();
  const { courses = [], coursesError } = await readAllCourses();
  const { exam, examError } = await readSingleExam(params.id);
  const { course, courseError } = await readSingleCourse(exam.course_id);

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
              duration: {exam.duration} {exam.duration === 1 ? "hour" : "hours"}
            </InfoMessage>
            <InfoMessage>total item: {exam.items.length}</InfoMessage>
          </section>

          <ExamForm exam={exam} currentUser={currentUser} />
        </>
      )}
    </main>
  );
}
