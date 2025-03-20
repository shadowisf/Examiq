import ErrorMessage from "./ErrorMessage";
import Image from "next/image";
import InfoMessage from "./InfoMessage";

type TeacherCoursesModalProps = {
  isEditMode: boolean;
  handleConfirm: (formData: FormData) => void;
  selectedCourseName: string;
  selectedCourseDescription: string;
  studentsError: any;
  students: any[] | null;
  selectedStudents: string[];
  toggleStudentSelection: (studentID: string) => void;
  handleCancel: () => void;
};

export default function TeacherCoursesModal({
  isEditMode,
  handleConfirm,
  selectedCourseName,
  selectedCourseDescription,
  studentsError,
  students,
  selectedStudents,
  toggleStudentSelection,
  handleCancel,
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
            defaultValue={isEditMode ? selectedCourseName : ""}
          />
          <textarea
            name="course description"
            placeholder="description"
            required
            defaultValue={isEditMode ? selectedCourseDescription : ""}
          />

          <div className="students-container">
            <h4>students:</h4>

            {studentsError ? (
              <ErrorMessage>failed to load student table</ErrorMessage>
            ) : students && students.length > 0 ? (
              students
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((student) => (
                  <label key={student.id} className="student-checkbox">
                    <input
                      type="checkbox"
                      value={student.id}
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                    />
                    {student.name}
                  </label>
                ))
            ) : (
              <InfoMessage>there are no existing students yet</InfoMessage>
            )}
          </div>

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
