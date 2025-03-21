import Link from "next/link";
import AdminAccountCreation from "../components/AdminAccounts";
import TeacherCourses from "../components/TeacherCourses";
import TeacherExams from "../components/TeacherExams";
import {
  readAllCourses,
  readAllExams,
  readAllStudents,
  readAllTeachers,
  readCurrentUser,
} from "../utils/default/actions";
import { redirect } from "next/navigation";
import Image from "next/image";
import BigLogo from "../components/BigLogo";

export default async function Dashboard() {
  const { currentUser } = await readCurrentUser();
  const { teachers, teachersError } = await readAllTeachers();
  const { students, studentsError } = await readAllStudents();
  const { courses, coursesError } = await readAllCourses();
  const { exams, examsError } = await readAllExams();

  if (!currentUser.user) {
    redirect("/");
  }

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
      <div className="bento-container">
        <Link href="#accounts">
          <h1>accounts</h1>
          <p className="gray">create accounts for students & teachers</p>
        </Link>
      </div>
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
      <div className="bento-container">
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
      </div>
    );

    mainContent = (
      <>
        <TeacherCourses
          students={students}
          studentsError={studentsError}
          courses={courses}
          courseError={coursesError}
        />

        <TeacherExams
          courses={courses}
          coursesError={coursesError}
          exams={exams}
          examsError={examsError}
        />
      </>
    );
  }

  // student role
  if (role === "student") {
    bentoContent = <></>;

    mainContent = <></>;
  }

  return (
    <main className="dashboard-page">
      <section className="header-container">
        <BigLogo />

        <h1 className="big">
          aloha,{" "}
          <span>
            {role} {name}
          </span>
        </h1>

        {bentoContent}
      </section>

      {mainContent}
    </main>
  );
}
