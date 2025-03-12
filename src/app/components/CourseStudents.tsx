"use client";

type CourseStudentsProps = {
  students: any[];
};

export default function CourseStudents({ students }: CourseStudentsProps) {
  return (
    <section>
      <h1>students</h1>
      <ul>
        {students.length > 0 ? (
          students.map((student, index) => <li key={index}>{student.name}</li>)
        ) : (
          <p className="gray">no students enrolled</p>
        )}
      </ul>
    </section>
  );
}
