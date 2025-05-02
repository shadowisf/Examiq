import ErrorMessage from "@/app/components/ErrorMessage";
import InfoMessage from "@/app/components/InfoMessage";
import { redirect } from "next/navigation";
import { readCurrentUser } from "@/app/utils/default/readEntities";
import { readSingleCourse } from "@/app/course/[id]/actions";
import { readSingleExam } from "@/app/exam/[id]/actions";
import ResultForm from "./components/ResultForm";
import { readSingleResult } from "./actions";
import { formatDateTimeLocal } from "@/app/utils/default/formatDateTimeLocal";
import ResultOptions from "./components/ResultOptions";

export default async function Result({ params }: { params: { id: string } }) {
  const { currentUser, currentUserError } = await readCurrentUser();
  const { result = [], resultError } = await readSingleResult(params.id);
  const { exam = [], examError } = await readSingleExam(result.exam_id);
  const { course = [], courseError } = await readSingleCourse(exam.course_id);

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
            <ResultOptions currentUser={currentUser} result={result} />

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
            <InfoMessage>
              score:{" "}
              {
                result.contents.filter(
                  (content: any) => content.status === "correct"
                ).length
              }
              /{exam.items.length}
            </InfoMessage>
          </section>

          <ResultForm exam={exam} result={result} currentUser={currentUser} />
        </>
      )}
    </main>
  );
}
