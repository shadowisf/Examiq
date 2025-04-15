import Image from "next/image";

type TeacherResultsModalProps = {
  handleConfirm: (formData: FormData) => void;
  handleCancel: () => void;
  selectedResult: any;
};

export default function TeacherResultsModal({
  handleConfirm,
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
            name="result score"
            type="text"
            placeholder="score"
            required
            defaultValue={selectedResult.score}
          />
          <input
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
