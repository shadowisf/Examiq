"use client";

import { useState } from "react";
import { createAccount } from "../dashboard/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AdminAccountsModal from "./AdminAccountsModal";
import ErrorMessage from "./ErrorMessage";
import InfoMessage from "./InfoMessage";

type AdminAccountsProps = {
  students: any[] | null;
  studentsError: any;
  teachers: any[] | null;
  teachersError: any;
};

export default function AdminAccounts({
  students,
  studentsError,
  teachers,
  teachersError,
}: AdminAccountsProps) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleRefresh() {
    setError("");
    setShowModal(false);
    setIsEditMode(false);
    router.refresh();
  }

  async function handleConfirm(formData: FormData) {
    const result = await createAccount(formData);

    if (result?.error) {
      setError(result.error.message);
    }

    setShowModal(false);
  }

  function handleCreate() {
    setShowModal(true);
  }

  function handleCancel() {
    setShowModal(false);
  }

  function handleEdit(user: any) {
    setIsEditMode(true);
    setShowModal(true);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  }

  function handleDelete(user: any) {
    const result = confirm("are you sure you want to delete this account?");

    if (result) {
    }
  }

  return (
    <>
      <section className="admin-accounts-container">
        <h1 id="accounts">accounts</h1>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="button-container">
          <button className="accent" onClick={handleCreate}>
            <Image
              src={"/icons/plus.svg"}
              alt="create"
              width={24}
              height={24}
            />
          </button>

          <button onClick={handleRefresh}>
            <Image
              src={"/icons/refresh.svg"}
              alt="referesh"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div>
          <h3>students</h3>
          {studentsError ? (
            <ErrorMessage>failed to load student table</ErrorMessage>
          ) : students && students.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>date of creation</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>
                      {new Date(student.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="actions-column">
                      <button onClick={() => handleEdit(student)}>
                        <Image
                          src={"/icons/edit.svg"}
                          alt="edit"
                          width={24}
                          height={24}
                        />
                      </button>

                      <button
                        className="accent"
                        onClick={() => handleDelete(student)}
                      >
                        <Image
                          src={"/icons/trash.svg"}
                          alt="delete"
                          width={24}
                          height={24}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <InfoMessage>
              there are no existing accounts for students yet
            </InfoMessage>
          )}
        </div>

        <div>
          <h3>teachers</h3>
          {teachersError ? (
            <ErrorMessage>failed to load teacher table</ErrorMessage>
          ) : teachers && teachers.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>date of creation</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.id}</td>
                    <td>{teacher.name}</td>
                    <td>
                      {new Date(teacher.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="actions-column">
                      <button onClick={() => handleEdit(teacher)}>
                        <Image
                          src={"/icons/edit.svg"}
                          alt="edit"
                          width={24}
                          height={24}
                        />
                      </button>

                      <button
                        className="accent"
                        onClick={() => handleDelete(teacher)}
                      >
                        <Image
                          src={"/icons/trash.svg"}
                          alt="delete"
                          width={24}
                          height={24}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <InfoMessage>
              there are no existing accounts for teachers yet
            </InfoMessage>
          )}
        </div>
      </section>

      {showModal && (
        <AdminAccountsModal
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
          isEditMode={isEditMode}
          name={name}
          email={email}
          role={role}
        />
      )}
    </>
  );
}
