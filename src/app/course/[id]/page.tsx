import CourseOptions from "@/app/components/CourseOptions";
import CourseStudents from "../../components/CourseStudents";
import {
  readAllStudents,
  readSingleCourse,
  readCurrentUser,
} from "@/app/utils/default/actions";
import { redirect } from "next/navigation";

type CourseProps = {
  params: {
    id: string;
  };
};

export default async function Course({ params }: CourseProps) {
  const { students, studentsError } = await readAllStudents();
  const { course } = await readSingleCourse(params.id);
  const { currentUser } = await readCurrentUser();

  if (!currentUser.user) {
    redirect("/");
  }

  return (
    <main className="course-page">
      <section>
        {currentUser.user.user_metadata.role === "teacher" ? (
          <CourseOptions
            currentUser={currentUser}
            course={course}
            students={students}
            studentsError={studentsError}
          />
        ) : null}

        <h1 className="big">{course.name}</h1>
        <p>{course.id}</p>
        <br />
        <p className="gray">{course.description}</p>
      </section>

      <CourseStudents course={course} />
    </main>
  );
}
