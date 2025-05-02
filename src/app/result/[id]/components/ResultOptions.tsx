"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import TeacherResultsModal from "@/app/dashboard/components/TeacherResultsModal";
import { updateResult } from "@/app/dashboard/actions";

type ResultOptionsProps = {
  currentUser: any;
  result: any;
};

export default function ResultOptions({
  currentUser,
  result,
}: ResultOptionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  function handleUpdatedContentStatuses(formData: FormData, result: any) {
    const updatedContents = result.contents.map((content: any) => {
      const statusKey = `status-${content.id}`;
      const newStatus = formData.get(statusKey);
      return {
        ...content,
        status: newStatus,
      };
    });

    return {
      ...result,
      contents: updatedContents,
    };
  }

  function handleCancel() {
    setShowModal(false);
  }

  function handleEdit() {
    setShowModal(true);
  }

  async function handleConfirm(formData: FormData) {
    startTransition(async () => {
      const updatedContent = handleUpdatedContentStatuses(formData, result);

      const actionResult = await updateResult(updatedContent);

      if (actionResult?.error) {
        setError(actionResult.error.message);
      }

      setShowModal(false);
    });
  }

  return (
    currentUser.user.user_metadata.role === "teacher" && (
      <>
        {isPending && <Loading />}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <button onClick={handleEdit}>
          <Image src={"/icons/edit.svg"} width={24} height={24} alt="edit" />
        </button>

        <br />

        {showModal && (
          <TeacherResultsModal
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
            selectedResult={result}
          />
        )}
      </>
    )
  );
}
