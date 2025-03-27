import ErrorMessage from "../../../components/ErrorMessage";
import InfoMessage from "../../../components/InfoMessage";

type CourseStudentsProps = {
  students: any[];
  studentsError: any;
};

export default async function CourseStudents({
  students,
  studentsError,
}: CourseStudentsProps) {
  return (
    <section className="student-list-container">
      <h1>students</h1>
      <ul style={students && students.length > 0 ? { marginLeft: "16px" } : {}}>
        {studentsError ? (
          <ErrorMessage>failed to load students</ErrorMessage>
        ) : students && students.length > 0 ? (
          students
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((student) => <li key={student.id}>{student.name}</li>)
        ) : (
          <InfoMessage>no students enrolled</InfoMessage>
        )}
      </ul>
    </section>
  );
}
