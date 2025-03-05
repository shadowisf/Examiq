import { retrieveDataForTeacher, updateDisplayName } from "./_teacherActions";
import Link from "next/link";
import Courses from "./TeacherCourses";
import AdminAccountCreation from "./AdminAccountCreation";
import { retrieveDataForAdmin } from "./_adminAction";

export default async function TeacherDashboard() {
  const resTeacher = await retrieveDataForTeacher();
  const resAdmin = await retrieveDataForAdmin();

  const displayName = resTeacher.currentUser.user.user_metadata?.display_name;
  const firstName = displayName ? displayName.split(" ")[0] : "";

  const email = resTeacher.currentUser.user.email;
  const username = email?.split("@")[0];

  const name = displayName ? firstName : username;

  const role = resTeacher.currentUser.user.user_metadata?.role;

  let bentoContent;
  let mainContent;

  // admin role
  if (role === undefined) {
    bentoContent = (
      <>
        <Link href="#account-creation">
          <h1>accounts</h1>
          <p className="gray">create accounts for students and teachers</p>
        </Link>
      </>
    );

    mainContent = (
      <>
        <AdminAccountCreation
          students={resAdmin.students}
          studentsError={resAdmin.studentsError}
          teachers={resAdmin.teachers}
          teachersError={resAdmin.teachersError}
        />
      </>
    );
  }

  if (role === "teacher") {
    bentoContent = (
      <>
        <Link href="#courses">
          <h1>courses</h1>
          <p className="gray">view the courses you manage</p>
        </Link>

        <Link href="#exams">
          <h1>exams</h1>
          <p className="gray">finalize scores of students</p>
        </Link>

        <Link href="#profile">
          <h1>profile</h1>
          <p className="gray">update your information</p>
        </Link>
      </>
    );

    mainContent = (
      <>
        <Courses
          students={resTeacher.students}
          studentsError={resTeacher.studentsError}
          courses={resTeacher.courses}
          courseError={resTeacher.coursesError}
        />
      </>
    );
  }

  if (role === "student") {
    bentoContent = <></>;
  }

  return (
    <main className="teacher-dashboard-page">
      <section className="nav-container">
        <h1 className="big">
          aloha, {role} {name}
        </h1>

        <div className="bento-container">{bentoContent}</div>
      </section>

      {mainContent}

      {/* <section>
        <form>
          <input name="display name" type="text" placeholder="display name" />
          <button formAction={updateDisplayName}>confirm</button>
        </form>
      </section> */}
    </main>
  );
}
