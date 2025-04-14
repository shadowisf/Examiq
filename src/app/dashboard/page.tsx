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
import StudentExams from "./components/StudentExams";
import InfoMessage from "../components/InfoMessage";
import StudentCourses from "./components/StudentCourses";

export default async function Dashboard() {
  const { currentUser, currentUserError } = await readCurrentUser();
  const { teachers = [], teachersError } = await readAllTeachers();
  const { students = [], studentsError } = await readAllStudents();
  const { courses, coursesError } = await readAllCourses();
  const { exams, examsError } = await readAllExams();

  let filteredCourses: any;
  let filteredExams: any;

  if (!currentUser?.user || currentUserError) {
    redirect("/");
  }

  switch (currentUser.user.user_metadata?.role) {
    case "student":
      filteredCourses =
        courses?.filter((course) =>
          course.students?.id?.includes(currentUser.user.id)
        ) || [];
      var filteredCourseIDs =
        filteredCourses?.map((course: any) => course.id) || [];
      filteredExams =
        exams
          ?.filter((exam) => filteredCourseIDs.includes(exam.course_id))
          .map((exam) => ({
            ...exam,
            course_name: filteredCourses.find(
              (course: any) => course.id === exam.course_id
            )?.name,
          })) || [];
      break;
    case "teacher":
      filteredCourses =
        courses?.filter((course) => course.author === currentUser.user.id) ||
        [];
      var filteredCourseIDs =
        filteredCourses?.map((course: any) => course.id) || [];
      filteredExams =
        exams
          ?.filter((exam) => exam.author === currentUser.user.id)
          .map((exam) => ({
            ...exam,
            course_name: filteredCourses.find(
              (course: any) => course.id === exam.course_id
            )?.name,
          })) || [];
      break;
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
          <p className="gray">view the exams under the courses you manage</p>
        </Link>
      </>
    );

    mainContent = (
      <>
        <TeacherCourses
          students={students}
          studentsError={studentsError}
          courses={filteredCourses}
          courseError={coursesError}
          exams={filteredExams}
          examsError={examsError}
        />

        <TeacherExams
          courses={filteredCourses}
          coursesError={coursesError}
          exams={filteredExams}
          examsError={examsError}
        />
      </>
    );
  }

  // student role
  if (role === "student") {
    bentoContent = (
      <>
        <Link href="#exams">
          <h1>exams</h1>
          <InfoMessage>
            take the required exams of the courses are you enrolled in
          </InfoMessage>
        </Link>

        <Link href="#courses">
          <h1>courses</h1>
          <InfoMessage>view the courses you are enrolled in</InfoMessage>
        </Link>
      </>
    );

    mainContent = (
      <>
        <StudentExams exams={filteredExams} examsError={examsError} />

        <StudentCourses
          exams={filteredExams}
          examsError={examsError}
          courses={filteredCourses}
          coursesError={coursesError}
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
