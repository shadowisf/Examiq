import Link from "next/link";
import AdminAccountCreation from "./adminAccounts";
import TeacherCourses from "./teacherCourses";
import {
  readCourse,
  readCurrentUser,
  readStudents,
  readTeachers,
} from "./pageActions";

export default async function Dashboard() {
  const { currentUser } = await readCurrentUser();
  const { teachers, teachersError } = await readTeachers();
  const { students, studentsError } = await readStudents();
  const { courses, coursesError } = await readCourse();

  const displayName = currentUser.user.user_metadata?.display_name;
  const firstName = displayName ? displayName.split(" ")[0] : "";

  const email = currentUser.user.email;
  const username = email?.split("@")[0];

  const name = displayName ? firstName : username;

  const role = currentUser.user.user_metadata?.role;

  let bentoContent;
  let mainContent;

  // admin role
  if (role === undefined) {
    bentoContent = (
      <>
        <Link href="#accounts">
          <h1>accounts</h1>
          <p className="gray">create accounts for students & teachers</p>
        </Link>
      </>
    );

    mainContent = (
      <>
        <AdminAccountCreation
          students={students}
          studentsError={studentsError}
          teachers={teachers}
          teachersError={teachersError}
        />
      </>
    );
  }

  // teacher role
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
        <TeacherCourses
          students={students}
          studentsError={studentsError}
          courses={courses}
          courseError={coursesError}
        />
      </>
    );
  }

  // student role
  if (role === "student") {
    bentoContent = <></>;
  }

  return (
    <main className="dashboard-page">
      <section className="nav-container">
        <h1 className="big">
          aloha, {role} {name}
        </h1>

        <div className="bento-container">{bentoContent}</div>
      </section>

      {mainContent}
    </main>
  );
}
