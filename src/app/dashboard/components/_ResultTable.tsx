import Link from "next/link";
import Image from "next/image";

type ResultTableProps = {
  students: any[];
  results: any[];
  handleEdit?: (result: any) => void;
  handleDelete?: (result: any) => void;
};

export function ResultTable({
  results,
  students,
  handleEdit,
  handleDelete,
}: ResultTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th className="id-column">id</th>
          <th className="id-column">exam id</th>
          <th className="id-column">student</th>
          <th>final grade</th>
          <th>chance of cheating</th>
          <th>date of creation</th>
          {handleEdit && handleDelete && <th></th>}
        </tr>
      </thead>
      <tbody>
        {results.map((result) => {
          return (
            <tr key={result.id}>
              <td>
                <Link href={`/result/${result.id}`}>{result.id}</Link>
              </td>
              <td>
                <Link href={`/exam/${result.exam_id}`}>{result.exam_id}</Link>
              </td>
              <td>
                {students.find((student) => student.id === result.student_id)
                  ?.user_metadata.display_name || "unknown student"}
              </td>
              <td>{result.final_grade}</td>
              <td> {result.likelihood_of_cheating}</td>
              <td>
                {new Date(result.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
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
