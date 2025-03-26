import ErrorMessage from "../../../components/ErrorMessage";
import InfoMessage from "../../../components/InfoMessage";

type CourseStudentsProps = {
  course: any;
  students: any[];
  studentsError: any;
};

export default async function CourseStudents({
  course,
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

  return (
    <section className="student-list-container">
      <h1>student list</h1>
      <ul
        style={
          filteredStudents && filteredStudents.length > 0
            ? { marginLeft: "16px" }
            : {}
        }
      >
        {studentsError ? (
          <ErrorMessage>failed to load students</ErrorMessage>
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
