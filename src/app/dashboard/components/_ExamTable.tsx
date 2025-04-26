import Link from "next/link";
import Image from "next/image";
import { formatDateTimeLocal } from "@/app/utils/default/formatDateTimeLocal";

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
          <th>total items</th>
          <th>deadline</th>
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
                <td>{exam.items ? exam.items.length : 0}</td>
                <td>{formatDateTimeLocal(exam.deadline, true)}</td>
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
