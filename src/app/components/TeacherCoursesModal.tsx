import ErrorMessage from "./ErrorMessage";
import Image from "next/image";
import InfoMessage from "./InfoMessage";

type TeacherCoursesModalProps = {
  isEditMode: boolean;
  handleConfirm: (formData: FormData) => void;
  students: any[] | null;
  studentsError: any;
  selectedStudents: string[];
  toggleStudentSelection: (studentID: string) => void;
  handleCancel: () => void;
  selectedCourse: any;
};

export default function TeacherCoursesModal({
  isEditMode,
  handleConfirm,
  studentsError,
  students,
  selectedStudents,
  toggleStudentSelection,
  handleCancel,
  selectedCourse,
}: TeacherCoursesModalProps) {
  return (
    <section className="modal">
      <div className="modal-content">
        <div className="header">
          <h1>{isEditMode ? "edit course" : "create new course"}</h1>

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
            name="course name"
            type="text"
            placeholder="name"
            required
            defaultValue={isEditMode ? selectedCourse.name : ""}
          />
          <textarea
            name="course description"
            placeholder="description"
            required
            defaultValue={isEditMode ? selectedCourse.description : ""}
          />

          <div className="students-container">
            {studentsError ? (
              <ErrorMessage>failed to load student table</ErrorMessage>
            ) : students && students.length > 0 ? (
              students
                .sort((a, b) =>
                  a.user_metadata.display_name.localeCompare(
                    b.user_metadata.display_name
                  )
                )
                .map((student) => (
                  <label key={student.id} className="student-checkbox">
                    <input
                      type="checkbox"
                      value={student.id}
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                    />
                    {student.user_metadata.display_name}
                  </label>
                ))
            ) : (
              <InfoMessage>there are no existing students yet</InfoMessage>
            )}
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
