import InfoMessage from "@/app/components/InfoMessage";
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
          <div className="exam-create-container">
            {selectedResult.contents?.map((content: any, index: number) => (
              <div key={content.id} className="exam-item">
                <div>
                  <InfoMessage>{index + 1}</InfoMessage>

                  <p>
                    correct answer:{" "}
                    <strong>
                      {content.correctAnswer.replace(
                        /\\boxed{([\s\S]*?)}/,
                        "$1"
                      )}
                    </strong>
                  </p>
                  <p>
                    student answer: <strong>{content.studentAnswer}</strong>
                  </p>

                  <select
                    name={`status-${content.id}`}
                    defaultValue={content.status}
                    required
                  >
                    <option value="correct">correct</option>
                    <option value="incorrect">incorrect</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

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
