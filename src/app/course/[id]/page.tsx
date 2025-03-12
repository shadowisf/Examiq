import CourseOptions from "@/app/components/CourseOptions";
import CourseStudents from "../../components/CourseStudents";
import {
  readAllStudents,
  readCurrentUser,
  readSingleCourse,
  readSingleStudent,
} from "@/app/utils/supabase/server";

type CourseProps = {
  params: {
    id: string;
  };
};

export default async function Course({ params }: CourseProps) {
  const { students: allStudents, studentsError } = await readAllStudents();
  const { course } = await readSingleCourse(params.id);
  const { currentUser } = await readCurrentUser();

  const studentIDs = course?.students?.uid || [];
  const students = await Promise.all(
    studentIDs.map(async (id: string) => {
      const { student } = await readSingleStudent(id);

      return student;
    })
  );

  return (
    <main className="course-page">
      <section>
        {currentUser.user.user_metadata.role === "teacher" ? (
          <CourseOptions
            currentUser={currentUser}
            course={course}
            students={allStudents}
            studentsError={studentsError}
          />
        ) : null}

        <h1 className="big">{course.name}</h1>
        <p>{course.id}</p>
        <br />
        <p className="gray">{course.description}</p>
      </section>

      <CourseStudents students={students} />
    </main>
  );
}
