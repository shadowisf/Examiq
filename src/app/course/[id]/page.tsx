import CourseOptions from "@/app/components/CourseOptions";
import CourseStudents from "../../components/CourseStudents";
import {
  readSingleCourse,
  readCurrentUser,
  readAllStudents,
  readAllExams,
} from "@/app/utils/default/actions";
import { redirect } from "next/navigation";
import ErrorMessage from "@/app/components/_ErrorMessage";
import CourseExams from "@/app/components/CourseExams";
import InfoMessage from "@/app/components/_InfoMessage";

type CourseProps = {
  params: {
    id: string;
  };
};

export default async function Course({ params }: CourseProps) {
  const { students, studentsError } = await readAllStudents();
  const { course, courseError } = await readSingleCourse(params.id);
  const { exams, examsError } = await readAllExams();
  const { currentUser } = await readCurrentUser();

  if (!currentUser.user) {
    redirect("/");
  }

  return (
    <main className="course-page">
      {courseError ? (
        <ErrorMessage>failed to load course</ErrorMessage>
      ) : (
        <>
          <section>
            <CourseOptions
              currentUser={currentUser}
              course={course}
              students={students}
              studentsError={studentsError}
            />

            <h1 className="big">{course.name}</h1>
            <p>{course.id}</p>
            <br />
            <InfoMessage>{course.description}</InfoMessage>
          </section>

          <CourseExams
            course={course}
            exams={exams || []}
            examsError={examsError}
          />

          <CourseStudents
            course={course}
            students={students}
            studentsError={studentsError}
          />
        </>
      )}
    </main>
  );
}
