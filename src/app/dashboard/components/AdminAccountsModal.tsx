import Image from "next/image";

type AdminAccountsModalProps = {
  isEditMode: boolean;
  handleCancel: () => void;
  handleConfirm: (formData: FormData) => void;
  selectedUser: any;
};

export default function AdminAccountsModal({
  handleCancel,
  handleConfirm,
  isEditMode,
  selectedUser,
}: AdminAccountsModalProps) {
  return (
    <section className="modal">
      <div className="modal-content">
        <div className="header">
          <h1>{isEditMode ? "edit account" : "create new account"}</h1>

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
          <select
            name="role"
            defaultValue={
              isEditMode ? selectedUser.user_metadata.role : "student"
            }
            required
          >
            <option value="student">student</option>
            <option value="teacher">teacher</option>
          </select>

          <input
            type="text"
            name="name"
            placeholder="name"
            defaultValue={
              isEditMode ? selectedUser.user_metadata.display_name : ""
            }
            required
          />

          <input
            type="text"
            name="email"
            placeholder="email"
            defaultValue={isEditMode ? selectedUser.email : ""}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="password"
            required
            disabled={isEditMode ? true : false}
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
