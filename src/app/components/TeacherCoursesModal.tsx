import ErrorMessage from "./ErrorMessage";

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
        <h1>{isEditMode ? "edit course" : "create new course"}</h1>

        <form action={(formData) => handleConfirm(formData)}>
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

          <div>
            <h4>students:</h4>

            {studentsError ? (
              <ErrorMessage message="failed to load student table" />
            ) : (
              students?.map((student) => (
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
            )}
          </div>

          <br />

          <div className="modal-actions">
            <button type="button" onClick={handleCancel}>
              cancel
            </button>
            <button type="submit">confirm</button>
          </div>
        </form>
      </div>
    </section>
  );
}
