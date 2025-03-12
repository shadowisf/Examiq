"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";

type TeacherExamsProps = {
  exams: any[] | null;
  examsError: any;
};

export default function TeacherExams({ exams, examsError }: TeacherExamsProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const router = useRouter();

  function handleCreate() {}

  return (
    <section className="teacher-exams-container">
      <h1 id="exams">exams</h1>

      <div className="button-container">
        <button className="create-button" onClick={handleCreate}>
          <Image src={"/icons/plus.svg"} width={20} height={20} alt="create" />
        </button>

        <button onClick={() => router.refresh()}>
          <Image
            src={"/icons/refresh.svg"}
            width={20}
            height={20}
            alt={"refresh"}
          />
        </button>
      </div>

      {examsError ? (
        <ErrorMessage message="failed to load courses" />
      ) : exams && exams.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th className="id-column">id</th>
              <th className="id-column">course id</th>
              <th>name</th>
              <th>total items</th>
              <th>date of creation</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => {
              return (
                <tr key={exam.id}>
                  <td>{exam.id}</td>
                  <td>{exam.course_id}</td>
                  <td>{exam.name}</td>
                  <td>{exam.items ? exam.items.length : 0}</td>
                  <td>
                    {new Date(exam.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="actions-column">
                    <button onClick={() => {}}>
                      <Image
                        src="/icons/edit.svg"
                        width={20}
                        height={20}
                        alt="edit"
                      />
                    </button>
                    <button onClick={() => {}} className="delete-button">
                      <Image
                        src={"/icons/trash.svg"}
                        width={20}
                        height={20}
                        alt="delete"
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="gray">you have not created any exams yet.</p>
      )}
    </section>
  );
}
