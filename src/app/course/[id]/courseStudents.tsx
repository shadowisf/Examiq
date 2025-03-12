import { readSingleStudent } from "@/app/utils/supabase/server";

type CourseStudentsProps = {
  params: {
    course: any | null;
    students: any[] | null;
  };
};

export default function CourseStudents({ params }: CourseStudentsProps) {
  const studentIDs = params.course?.students?.uid || [];

  return (
    <section>
      <h1>students</h1>
      <ul>
        {studentIDs && studentIDs.length > 0 ? (
          studentIDs.map(async (id: string) => {
            const { student } = await readSingleStudent(id);

            return <li>{student.name}</li>;
          })
        ) : (
          <p className="gray">no students enrolled</p>
        )}
      </ul>
    </section>
  );
}
