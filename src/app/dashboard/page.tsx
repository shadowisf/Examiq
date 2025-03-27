import Link from "next/link";
import AdminAccountCreation from "./components/AdminAccounts";
import { redirect } from "next/navigation";
import BigLogo from "../components/BigLogo";
import {
  readCurrentUser,
  readAllTeachers,
  readAllStudents,
  readAllCourses,
  readAllExams,
} from "../utils/default/read";
import TeacherCourses from "./components/TeacherCourses";
import TeacherExams from "./components/TeacherExams";
import StudentTimeline from "./components/StudentTimeline";

export default async function Dashboard() {
  const { currentUser } = await readCurrentUser();
  const { teachers, teachersError } = await readAllTeachers();
  const { students, studentsError } = await readAllStudents();
  const { courses, coursesError } = await readAllCourses();
  const { exams, examsError } = await readAllExams();

  if (!currentUser?.user) {
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
  if (role === undefined || role === "admin") {
    bentoContent = (
      <>
        <Link href="#students">
          <h1>students</h1>
          <p className="gray">create accounts for students</p>
        </Link>

        <Link href="#teachers">
          <h1>teachers</h1>
          <p className="gray">create accounts for teachers</p>
        </Link>
      </>
    );

    mainContent = (
      <>
        <AdminAccountCreation
          currentUser={currentUser}
          students={students || []}
          studentsError={studentsError}
          teachers={teachers || []}
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
      </>
    );

    mainContent = (
      <>
        <TeacherCourses
          students={students || []}
          studentsError={studentsError}
          courses={courses || []}
          courseError={coursesError}
          exams={exams || []}
          examsError={examsError}
        />

        <TeacherExams
          courses={courses || []}
          coursesError={coursesError}
          exams={exams || []}
          examsError={examsError}
        />
      </>
    );
  }

  // student role
  if (role === "student") {
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
      </>
    );

    mainContent = (
      <>
        <StudentTimeline
          courses={courses || []}
          coursesError={coursesError}
          exams={exams || []}
          examsError={examsError}
        />
      </>
    );
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

        <div className="bento-container">{bentoContent}</div>
      </section>

      {mainContent}
    </main>
  );
}
