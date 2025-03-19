import Image from "next/image";

type AdminAccountsModalProps = {
  handleCancel: () => void;
  handleConfirm: (formData: FormData) => void;
};

export default function AdminAccountsModal({
  handleCancel,
  handleConfirm,
}: AdminAccountsModalProps) {
  return (
    <section className="modal">
      <div className="modal-content">
        <div className="header">
          <h1>create new account</h1>

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
          <select name="role" defaultValue={"student"}>
            <option value="student">student</option>
            <option value="teacher">teacher</option>
          </select>

          <input type="text" name="name" placeholder="name" />

          <input type="text" name="email" placeholder="email" />

          <input type="password" name="password" placeholder="password" />

          <br />

          <button type="submit" className="accent">
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
