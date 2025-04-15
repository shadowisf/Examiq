import ErrorMessage from "../../components/ErrorMessage";
import Image from "next/image";
import InfoMessage from "../../components/InfoMessage";

type TeacherResultsModalProps = {
  handleConfirm: (formData: FormData) => void;
  students: any[];
  studentsError: any;
  handleCancel: () => void;
  selectedResult: any;
};

export default function TeacherResultsModal({
  handleConfirm,
  studentsError,
  students,
  handleCancel,
  selectedResult,
}: TeacherResultsModalProps) {
  return (
    <section className="modal">
      <div className="modal-content">
        <div className="header">
          <h1>edit result</h1>

          <button className="none" onClick={handleCancel}>
            <Image
              src={"/icons/close.svg"}
              alt="cancel"
              width={24}
              height={24}
            />
          </button>
        </div>

        <form action={handleConfirm}>
          <input
            name="result final grade"
            type="text"
            placeholder="final grade"
            required
            defaultValue={selectedResult.final_grade}
          />
          <textarea
            name="result likelihood of cheating"
            placeholder="chance of cheating"
            required
            defaultValue={selectedResult.likelihood_of_cheating}
          />

          <br />

          <button type="submit">
            <Image
              src={"/icons/check.svg"}
              alt="confirm"
              width={24}
              height={24}
            />
          </button>
        </form>
      </div>
    </section>
  );
}
