import ErrorMessage from "@/app/components/ErrorMessage";
import InfoMessage from "@/app/components/InfoMessage";
import { redirect } from "next/navigation";
import { readCurrentUser } from "@/app/utils/default/read";
import { readSingleCourse } from "@/app/course/[id]/actions";
import { readSingleExam } from "@/app/exam/[id]/actions";
import ResultForm from "./components/ResultForm";
import { readSingleResult } from "./actions";

export default async function Result({ params }: { params: { id: string } }) {
  const { currentUser, currentUserError } = await readCurrentUser();
  const { result, resultError } = await readSingleResult(params.id);
  const { exam, examError } = await readSingleExam(result.exam_id);
  const { course, courseError } = await readSingleCourse(exam.course_id);

  if (!currentUser?.user || currentUserError) {
    redirect("/");
  }

  return (
    <main className="exam-page result">
      {examError || resultError ? (
        <ErrorMessage>failed to load result</ErrorMessage>
      ) : (
        <>
          <section>
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

          <ResultForm exam={exam} result={result} />
        </>
      )}
    </main>
  );
}
