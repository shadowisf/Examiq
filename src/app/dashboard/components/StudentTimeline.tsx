"use client";

type StudentTimelineProps = {
  courses: any[];
  coursesError: any;
  exams: any[];
  examsError: any;
};

export default function StudentTimeline({
  courses,
  coursesError,
  exams,
  examsError,
}: StudentTimelineProps) {
  console.log(courses);

  return (
    <section className="student-timeline-container">
      <h1>timeline</h1>
    </section>
  );
}
