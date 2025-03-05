import { retrieveDataForTeacher, updateDisplayName } from "./action";
import Link from "next/link";
import Courses from "./TeacherCourses";

export default async function TeacherDashboard() {
  const res = await retrieveDataForTeacher();

  return (
    <main className="teacher-dashboard-page">
      <section className="nav-container">
        <h1 className="big">
          aloha, teacher {res.currentUser.user.user_metadata.display_name}
        </h1>

        <div className="bento-container">
          <Link href="#courses">
            <h1>courses</h1>
            <p className="gray">view the courses you manage</p>
          </Link>

          <Link href="/teacher-dashboard/exams">
            <h1>exams</h1>
            <p className="gray">finalize scores of students</p>
          </Link>

          <Link href="/teacher-dashboard/students">
            <h1>students</h1>
            <p className="gray">manage accounts for students</p>
          </Link>

          <Link href="/teacher-dashboard/profile">
            <h1>profile</h1>
            <p className="gray">update your information</p>
          </Link>
        </div>
      </section>

      <Courses
        courseError={res.courseError}
        courses={res.courses}
        uid={res.currentUser.user.id}
      />
    </main>
  );
}
