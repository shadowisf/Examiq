import CourseOptions from "@/app/course/[id]/components/CourseOptions";
import CourseStudents from "./components/CourseStudents";
import { redirect } from "next/navigation";
import ErrorMessage from "@/app/components/ErrorMessage";
import CourseExams from "@/app/course/[id]/components/CourseExams";
import InfoMessage from "@/app/components/InfoMessage";
import { readSingleCourse } from "./actions";
import {
  readAllExams,
  readAllStudents,
  readCurrentUser,
} from "@/app/utils/default/read";

type CourseProps = {
  params: {
    id: string;
  };
};

export default async function Course({ params }: CourseProps) {
  const { currentUser } = await readCurrentUser();
  const { students, studentsError } = await readAllStudents();
  const { course, courseError } = await readSingleCourse(params.id);
  const { exams, examsError } = await readAllExams();

  if (!currentUser?.user) {
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
              students={students || []}
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
            students={students || []}
            studentsError={studentsError}
          />
        </>
      )}
    </main>
  );
}
