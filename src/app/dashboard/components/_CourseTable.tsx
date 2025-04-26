import { formatDateTimeLocal } from "@/app/utils/default/formatDateTimeLocal";
import Image from "next/image";
import Link from "next/link";

type CourseTableProps = {
  courses: any[];
  exams: any[];
  examsError: any;
  handleEdit?: (course: any) => void;
  handleDelete?: (course: any) => void;
};

export function CourseTable({
  courses,
  exams,
  examsError,
  handleEdit,
  handleDelete,
}: CourseTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th className="id-column">id</th>
          <th>name</th>
          <th>total students</th>
          <th>total exams</th>
          <th>date of creation</th>
          {handleEdit && handleDelete && <th></th>}
        </tr>
      </thead>
      <tbody>
        {courses
          .sort((a, b) => b.name.localeCompare(a.name))
          .map((course) => {
            return (
              <tr key={course.id}>
                <td>
                  <Link href={`course/${course.id}`}>{course.id}</Link>
                </td>
                <td>{course.name}</td>
                <td>{course.students?.id.length || 0}</td>
                <td>
                  {examsError
                    ? "?"
                    : exams.filter((exam) => exam.course_id === course.id)
                        .length}
                </td>
                <td>{formatDateTimeLocal(course.created_at, true)}</td>
                {handleEdit && handleDelete && (
                  <td className="actions-column">
                    {handleEdit && (
                      <button onClick={() => handleEdit(course)}>
                        <Image
                          src="/icons/edit.svg"
                          width={24}
                          height={24}
                          alt="edit"
                        />
                      </button>
                    )}
                    {handleDelete && (
                      <button onClick={() => handleDelete(course)}>
                        <Image
                          src="/icons/trash.svg"
                          width={24}
                          height={24}
                          alt="delete"
                        />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
