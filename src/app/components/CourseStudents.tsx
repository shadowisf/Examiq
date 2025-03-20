import { readSingleStudent } from "../utils/default/actions";
import InfoMessage from "./InfoMessage";

type CourseStudentsProps = {
  course: any;
};

export default async function CourseStudents({ course }: CourseStudentsProps) {
  const studentIDs = course?.students?.uid || [];
  const students = await Promise.all(
    studentIDs.map(async (id: string) => {
      const { student } = await readSingleStudent(id);

      return student;
    })
  );

  return (
    <section className="student-list-container">
      <h1>student list</h1>
      <ul>
        {students.length > 0 ? (
          students
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((student, index) => <li key={index}>{student.name}</li>)
        ) : (
          <InfoMessage>no students enrolled</InfoMessage>
        )}
      </ul>
    </section>
  );
}
