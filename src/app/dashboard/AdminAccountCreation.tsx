"use client";

import { useState } from "react";
import { handleCreateAccount } from "./_adminAction";

type AdminAccountCreationProps = {
  students: any[] | null;
  studentsError: any;
  teachers: any[] | null;
  teachersError: any;
};

export default function AdminAccountCreation({
  students,
  studentsError,
  teachers,
  teachersError,
}: AdminAccountCreationProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="admin-account-creation-container">
        <h1 id="account-creation">accounts</h1>

        <button className="create-button" onClick={() => setShowModal(true)}>
          create new account
        </button>

        <div>
          <h3>students</h3>
          {studentsError ? (
            <p style={{ color: "red" }}>failed to load student table</p>
          ) : students && students.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>date of creation</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>
                      {new Date(student.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>there are no students yet</p>
          )}
        </div>

        <div>
          <h3>teachers</h3>
          {teachersError ? (
            <p style={{ color: "red" }}>failed to load teacher table</p>
          ) : teachers && teachers.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>date of creation</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.id}</td>
                    <td>{teacher.name}</td>
                    <td>
                      {new Date(teacher.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>there are no teachers yet</p>
          )}
        </div>
      </section>

      {showModal && (
        <section className="modal">
          <div className="modal-content">
            <h1>create new account</h1>

            <form>
              <select name="role" defaultValue={"student"}>
                <option value="student">student</option>
                <option value="teacher">teacher</option>
              </select>

              <input type="text" name="name" placeholder="name" />

              <input type="text" name="email" placeholder="email" />

              <input type="password" name="password" placeholder="password" />

              <br />

              <div className="modal-actions">
                <button onClick={() => setShowModal(false)}>cancel</button>

                <button formAction={handleCreateAccount}>create</button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
