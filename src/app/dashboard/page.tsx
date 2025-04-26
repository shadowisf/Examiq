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
  readAllResults,
} from "../utils/default/readEntities";
import TeacherCourses from "./components/TeacherCourses";
import TeacherExams from "./components/TeacherExams";
import StudentExams from "./components/StudentExams";
import InfoMessage from "../components/InfoMessage";
import StudentCourses from "./components/StudentCourses";
import TeacherResults from "./components/TeacherResults";

export default async function Dashboard() {
  const { currentUser, currentUserError } = await readCurrentUser();
  const { teachers = [], teachersError } = await readAllTeachers();
  const { students = [], studentsError } = await readAllStudents();
  const { courses = [], coursesError } = await readAllCourses();
  const { exams = [], examsError } = await readAllExams();
  const { results = [], resultsError } = await readAllResults();

  let filteredCourses: any;
  let filteredCourseIDs: any;
  let filteredExams: any;
  let filteredResults: any;

  if (!currentUser?.user || currentUserError) {
    redirect("/");
  }

  switch (currentUser.user.user_metadata?.role) {
    case "student":
      filteredCourses =
        courses?.filter((course) =>
          course.students?.id?.includes(currentUser.user.id)
        ) || [];

      filteredCourseIDs =
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

      filteredResults = results?.filter(
        (result: any) => result.student_id === currentUser.user.id
      );

      break;
    case "teacher":
      filteredCourses =
        courses?.filter((course) => course.author === currentUser.user.id) ||
        [];

      filteredCourseIDs =
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
          <InfoMessage>view courses you manage</InfoMessage>
        </Link>

        <Link href="#exams">
          <h1>exams</h1>
          <InfoMessage>view exams of courses you manage</InfoMessage>
        </Link>

        <Link href="#results">
          <h1>results</h1>
          <InfoMessage>view results made by students</InfoMessage>
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

        <TeacherResults
          results={results}
          resultsError={resultsError}
          students={students}
          studentsError={studentsError}
          exams={exams}
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
          <InfoMessage>take exams of courses you are enrolled in</InfoMessage>
        </Link>

        <Link href="#courses">
          <h1>courses</h1>
          <InfoMessage>view courses you are enrolled in</InfoMessage>
        </Link>
      </>
    );

    mainContent = (
      <>
        <StudentCourses
          exams={filteredExams}
          examsError={examsError}
          courses={filteredCourses}
          coursesError={coursesError}
        />

        <StudentExams
          results={filteredResults}
          resultsError={resultsError}
          exams={filteredExams}
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
