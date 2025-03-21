import CourseOptions from "@/app/components/CourseOptions";
import CourseStudents from "../../components/CourseStudents";
import {
  readSingleCourse,
  readCurrentUser,
  readAllStudents,
} from "@/app/utils/default/actions";
import { redirect } from "next/navigation";

type CourseProps = {
  params: {
    id: string;
  };
};

export default async function Course({ params }: CourseProps) {
  const { students, studentsError } = await readAllStudents();
  const { course, courseError } = await readSingleCourse(params.id);
  const { currentUser } = await readCurrentUser();

  if (!currentUser.user) {
    redirect("/");
  }

  return (
    <main className="course-page">
      <section>
        <h1 className="big">{course.name}</h1>
        <p>{course.id}</p>
        <br />
        <p className="gray">{course.description}</p>
      </section>

      <CourseStudents
        course={course}
        courseError={courseError}
        students={students}
        studentsError={studentsError}
      />

      <CourseOptions
        currentUser={currentUser}
        course={course}
        students={students}
        studentsError={studentsError}
      />
    </main>
  );
}
