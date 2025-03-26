import ErrorMessage from "@/app/components/ErrorMessage";
import InfoMessage from "@/app/components/InfoMessage";
import ExamForm from "@/app/exam/[id]/components/ExamForm";
import { redirect } from "next/navigation";
import { readSingleExam } from "./actions";
import { readCurrentUser } from "@/app/utils/default/read";

type ExamProps = {
  params: {
    id: string;
  };
};

export default async function Course({ params }: ExamProps) {
  const { exam, examError } = await readSingleExam(params.id);
  const { currentUser } = await readCurrentUser();

  if (!currentUser?.user) {
    redirect("/");
  }

  return (
    <main className="exam-page">
      {examError ? (
        <ErrorMessage>failed to load exam</ErrorMessage>
      ) : (
        <>
          <section>
            <h1 className="big">{exam.name}</h1>
            <InfoMessage>{exam.id}</InfoMessage>

            <br />

            <p>total item: {exam.items.length}</p>
          </section>

          <ExamForm exam={exam} currentUser={currentUser} />
        </>
      )}
    </main>
  );
}
