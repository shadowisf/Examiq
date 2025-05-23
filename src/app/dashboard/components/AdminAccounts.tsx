"use client";

import { useState, useTransition } from "react";
import {
  createAccount,
  deleteAccount,
  deleteStudentFromCourse,
  updateAccount,
} from "../actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AdminAccountsModal from "./AdminAccountsModal";
import ErrorMessage from "../../components/ErrorMessage";
import InfoMessage from "../../components/InfoMessage";
import Loading from "../../components/Loading";
import { EntityTable } from "./_EntityTable";

type AdminAccountsProps = {
  currentUser: any;
  students: any[];
  studentsError: any;
  teachers: any[];
  teachersError: any;
};

export default function AdminAccounts({
  currentUser,
  students,
  studentsError,
  teachers,
  teachersError,
}: AdminAccountsProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  function handleCreate() {
    setShowModal(true);
    setIsEditMode(false);
    setSelectedUser(null);
  }

  function handleCancel() {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedUser(null);
  }

  function handleEdit(user: any) {
    setShowModal(true);
    setIsEditMode(true);
    setSelectedUser(user);
  }

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
      setShowModal(false);
      setIsEditMode(false);
      setError("");
      setSelectedUser(null);
    });
  }

  async function handleConfirm(formData: FormData) {
    startTransition(async () => {
      let result;

      if (isEditMode) {
        result = await updateAccount(formData, selectedUser);
      } else {
        result = await createAccount(formData);
      }

      if (result?.error) {
        setError(result.error.message);
      }

      setShowModal(false);
    });
  }

  async function handleDelete(user: any) {
    startTransition(async () => {
      const isConfirmed = confirm(
        "are you sure you want to delete this account?"
      );

      if (isConfirmed) {
        if (user.user_metadata.role === "student") {
          const courseResult = await deleteStudentFromCourse(user);

          if (courseResult?.error) {
            setError(courseResult.error.message);
          }
        }

        const userResult = await deleteAccount(user);

        if (userResult?.error) {
          setError(userResult.error.message);
        }
      }
    });
  }

  return (
    currentUser.user.user_metadata.role !== "teacher" &&
    currentUser.user.user_metadata.role !== "student" && (
      <>
        {isPending && <Loading />}

        <section className="admin-accounts-container">
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <div className="button-container">
            <button onClick={handleCreate}>
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

          <br />

          <h1 id="students">students</h1>
          <div>
            {studentsError ? (
              <ErrorMessage>failed to load students</ErrorMessage>
            ) : students && students.length > 0 ? (
              <EntityTable
                entities={students}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ) : (
              <InfoMessage>there are no existing students yet</InfoMessage>
            )}
          </div>
          <br />
          <h1 id="teachers">teachers</h1>
          <div>
            {teachersError ? (
              <ErrorMessage>failed to load teachers</ErrorMessage>
            ) : teachers && teachers.length > 0 ? (
              <EntityTable
                entities={teachers}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ) : (
              <InfoMessage>there are no existing teachers yet</InfoMessage>
            )}
          </div>
        </section>

        {showModal && (
          <AdminAccountsModal
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
            isEditMode={isEditMode}
            selectedUser={selectedUser}
          />
        )}
      </>
    )
  );
}
