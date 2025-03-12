import CourseStudents from "../../components/CourseStudents";
import {
  readAllStudents,
  readCurrentUser,
  readSingleCourse,
} from "@/app/utils/supabase/server";
import Image from "next/image";

type CourseProps = {
  params: {
    id: string;
  };
};

export default async function Course({ params }: CourseProps) {
  const { course } = await readSingleCourse(params.id);
  const { currentUser } = await readCurrentUser();

  return (
    <main className="course-page">
      <section>
        {currentUser.user.user_metadata.role === "teacher" ? (
          <>
            <div className="button-container">
              <button>
                <Image
                  src={"/icons/edit.svg"}
                  width={20}
                  height={20}
                  alt="edit"
                />
              </button>
              <button className="delete-button">
                <Image
                  src={"/icons/trash.svg"}
                  width={20}
                  height={20}
                  alt="delete"
                />
              </button>
            </div>

            <br />
          </>
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
