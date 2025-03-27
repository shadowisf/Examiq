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
  const { currentUser, currentUserError } = await readCurrentUser();
  const { students = [], studentsError } = await readAllStudents();
  const { course, courseError } = await readSingleCourse(params.id);
  const { exams, examsError } = await readAllExams();

  if (!currentUser?.user || currentUserError) {
    redirect("/");
  }

  const studentIDsInCourse = course?.students?.id || [];
  const filteredStudents =
    students
      ?.filter((student: any) => studentIDsInCourse.includes(student.id))
      .map((student: any) => ({
        id: student.id,
        name: student.user_metadata?.display_name || "unknown student",
      })) || [];
  const filteredExams =
    exams?.filter((exam) => exam.course_id === course.id) || [];

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

          <CourseExams exams={filteredExams} examsError={examsError} />

          <CourseStudents
            students={filteredStudents}
            studentsError={studentsError}
          />
        </>
      )}
    </main>
  );
}
