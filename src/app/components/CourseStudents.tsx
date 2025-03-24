import ErrorMessage from "./_ErrorMessage";
import InfoMessage from "./_InfoMessage";

type CourseStudentsProps = {
  course: any;
  courseError: any;
  students: any[] | null;
  studentsError: any;
};

export default async function CourseStudents({
  course,
  courseError,
  students,
  studentsError,
}: CourseStudentsProps) {
  const studentIDsInCourse = course?.students?.uid || [];

  const filteredStudents =
    students
      ?.filter((student: any) => studentIDsInCourse.includes(student.id))
      .map((student: any) => ({
        id: student.id,
        name: student.user_metadata?.display_name || "unknown student",
      })) || [];

  return courseError ? (
    <ErrorMessage>{courseError.message}</ErrorMessage>
  ) : (
    <section className="student-list-container">
      <h1>student list</h1>
      <ul>
        {studentsError ? (
          <ErrorMessage>{studentsError.message}</ErrorMessage>
        ) : filteredStudents && filteredStudents.length > 0 ? (
          filteredStudents
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((student) => <li key={student.id}>{student.name}</li>)
        ) : (
          <InfoMessage>no students enrolled</InfoMessage>
        )}
      </ul>
    </section>
  );
}
