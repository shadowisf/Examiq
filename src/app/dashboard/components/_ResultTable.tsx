import Link from "next/link";
import Image from "next/image";
import { formatDateTimeLocal } from "@/app/utils/default/formatDateTimeLocal";

type ResultTableProps = {
  students?: any[];
  results: any[];
  exams: any[];
  handleEdit?: (result: any) => void;
  handleDelete?: (result: any) => void;
};

export function ResultTable({
  results,
  students,
  handleEdit,
  handleDelete,
  exams,
}: ResultTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th className="id-column">id</th>
          {students && <th className="id-column">exam id</th>}
          {students && <th className="id-column">student</th>}
          <th>score</th>
          <th>date of creation</th>
          {handleEdit && handleDelete && <th />}
        </tr>
      </thead>
      <tbody>
        {results.map((result) => {
          return (
            <tr key={result.id}>
              <td>
                <Link href={`/result/${result.id}`}>{result.id}</Link>
              </td>
              {students && (
                <td>
                  <Link href={`/exam/${result.exam_id}`}>{result.exam_id}</Link>
                </td>
              )}
              {students && (
                <td>
                  {students?.find((student) => student.id === result.student_id)
                    ?.user_metadata.display_name || "unknown student"}
                </td>
              )}
              <td>
                {result.score}
                {"/"}
                {exams.find((exam: any) => exam.id === result.exam_id)?.items
                  .length ?? 0}
              </td>
              <td>{formatDateTimeLocal(result.created_at, true)}</td>
              {handleEdit && handleDelete && (
                <td className="actions-column">
                  {handleEdit && (
                    <button onClick={() => handleEdit(result)}>
                      <Image
                        src="/icons/edit.svg"
                        width={24}
                        height={24}
                        alt="edit"
                      />
                    </button>
                  )}
                  {handleDelete && (
                    <button onClick={() => handleDelete(result)}>
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
