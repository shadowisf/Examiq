import ErrorMessage from "@/app/components/_ErrorMessage";
import InfoMessage from "@/app/components/_InfoMessage";
import ExamForm from "@/app/components/ExamForm";
import { readCurrentUser, readSingleExam } from "@/app/utils/default/actions";
import { redirect } from "next/navigation";

type ExamProps = {
  params: {
    id: string;
  };
};

export default async function Course({ params }: ExamProps) {
  const { exam, examError } = await readSingleExam(params.id);
  const { currentUser } = await readCurrentUser();

  if (!currentUser.user) {
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
          </section>

          <ExamForm exam={exam} currentUser={currentUser} />
        </>
      )}
    </main>
  );
}
