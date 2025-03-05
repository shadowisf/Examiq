"use client";

import { useState } from "react";
import { handleCreateCourse } from "./action";

type CourseModalProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CourseModal({ setShowModal }: CourseModalProps) {
  const [name, setName] = useState("");
  const [students, setStudents] = useState([]);

  return (
    <section className="modal">
      <div className="modal-content">
        <h1>create new course</h1>

        <form>
          <input
            name="course name"
            type="text"
            placeholder="course name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            name="students"
            type="text"
            placeholder="students"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button onClick={() => setShowModal(false)}>cancel</button>
            <button formAction={handleCreateCourse}>confirm</button>
          </div>
        </form>
      </div>
    </section>
  );
}
