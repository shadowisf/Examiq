import ErrorMessage from "@/app/components/ErrorMessage";
import { CourseTable } from "./_CourseTable";
import InfoMessage from "@/app/components/InfoMessage";

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
  return (
    <section className="student-courses-container">
      <h1 id="courses">courses</h1>

      {coursesError ? (
        <ErrorMessage>failed to load course table</ErrorMessage>
      ) : courses && courses.length > 0 ? (
        <CourseTable courses={courses} exams={exams} examsError={examsError} />
      ) : (
        <InfoMessage>no enrolled courses</InfoMessage>
      )}
    </section>
  );
}
