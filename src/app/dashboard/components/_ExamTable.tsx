import Link from "next/link";
import Image from "next/image";

type ExamTableProps = {
  exams: any[];
  handleEdit?: (exam: any) => void;
  handleDelete?: (exam: any) => void;
};

export function ExamTable({ exams, handleEdit, handleDelete }: ExamTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th className="id-column">id</th>
          <th className="id-column">course id</th>
          <th>name</th>
          <th>duration</th>
          <th>total items</th>
          <th>date of creation</th>
          {handleEdit && handleDelete && <th></th>}
        </tr>
      </thead>
      <tbody>
        {exams
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((exam) => {
            return (
              <tr key={exam.id}>
                <td>
                  <Link href={`/exam/${exam.id}`}>{exam.id}</Link>
                </td>
                <td>
                  <Link href={`/course/${exam.course_id}`}>
                    {exam.course_id}
                  </Link>
                </td>
                <td>{exam.name}</td>
                <td>
                  {exam.duration} {exam.duration === 1 ? "hour" : "hours"}
                </td>
                <td>{exam.items ? exam.items.length : 0}</td>
                <td>
                  {new Date(exam.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                {handleEdit && handleDelete && (
                  <td className="actions-column">
                    <button onClick={() => handleEdit(exam)}>
                      <Image
                        src="/icons/edit.svg"
                        width={24}
                        height={24}
                        alt="edit"
                      />
                    </button>
                    <button onClick={() => handleDelete(exam)}>
                      <Image
                        src={"/icons/trash.svg"}
                        width={24}
                        height={24}
                        alt="delete"
                      />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
