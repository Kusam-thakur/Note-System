import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api.tsx";

const TeacherDashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentName, setSelectedStudentName] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [tittle, setTittle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [button, setButton] = useState("Add Note");

  
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/user');
        const user = res.data.user;
        console.log("Teacher Dashboard:", user);
        if (user.role === "teacher") {
          setTeacherId(user.users_id);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user", error);
        navigate("/");
      }
    };

    fetchUser();
  }, [token]);

 
  useEffect(() => {
    const getAssignedStudents = async () => {
      try {
        const res = await api.get(`/notes/dashboard/${teacherId}/students`);
        setStudents(res.data);
        console.log("student data ", res)

      } catch (err) {
        console.log(err);
        setError("Failed to fetch students.");
      }
    };

    if (teacherId) getAssignedStudents();
  }, [teacherId]);

  
  const getStudentNotes = async (studentId) => {
    try {
      setLoading(true);
      console.log("i am teacher ",teacherId);
       console.log("i am student ",studentId);
      const res = await api.get(
        `/notes/dashboard/${teacherId}/student/${studentId}/notes`
      );
      setNotes(res.data.notes || res.data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
      setError("Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setTittle(note.tittle);
    setContent(note.content);
    setEditingNoteId(note.note_id);
    setButton("Update Note");
  };

  const handleDelete = async (noteId) => {
    try {
      await api.delete(`/notes/delete/${noteId}`, {
        data: { creator_id: selectedStudent },
      });
      getStudentNotes(selectedStudent);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete note.");
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      setError("Please select a student before adding/updating notes.");
      return;
    }

    try {
      if (editingNoteId) {
        await api.put(`/notes/update/${editingNoteId}`, {
          tittle,
          content,
          creator_id: selectedStudent,
        });
        setButton("Add Note");
        setEditingNoteId(null);
      } else {
        await api.post(`/notes/create`, {
          tittle,
          content,
          creator_id: selectedStudent,
        });
      }

      setTittle("");
      setContent("");
      getStudentNotes(selectedStudent);
      setErrors({});
      setServerMessage("Note saved successfully.");
    } catch (err :any ) {
      console.error("Submit error:", err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        setServerMessage(err.response.data.message);
      } else if (err.response?.data?.message) {
        setServerMessage(err.response.data.message);
      } else {
        setServerMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">📚 Teacher Dashboard</h1>

      <div className="flex justify-center space-x-6 mb-6">
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          My Notes
        </button>
        <button
          onClick={() => navigate("/logout")}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}


      {(students.length == 0) ? (
         <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">You don't have any student </h2>
        </div>
      ) : ( 
        <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Assigned Students:</h2>
        <ul className="space-y-2">
          {students.map((student) => (
            <li
              key={student.users_id}
              className={`cursor-pointer px-4 py-2 border rounded hover:bg-gray-100 ${
                selectedStudent === student.users_id ? "bg-gray-200 font-bold" : ""
              }`}
              onClick={() => {
                setSelectedStudent(student.users_id);
                setSelectedStudentName(student.username);
                getStudentNotes(student.users_id);
                setTittle("");
                setContent("");
                setEditingNoteId(null);
                setButton("Add Note");
                setErrors({});
                setServerMessage("");
              }}
            >
              {student.username}
            </li>
          ))}
        </ul>
      </div>
        )}

      {selectedStudent && (
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Selected Student: {selectedStudentName}
          </h2>
          <form
            onSubmit={handleNoteSubmit}
            className="bg-white p-4 rounded shadow mb-6"
          >
            <h2 className="text-lg font-semibold mb-3">
              {editingNoteId ? "Edit Note" : "Create New Note"}
            </h2>
            <input
              type="text"
              placeholder="Note Tittle"
              value={tittle}
              onChange={(e) => setTittle(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded mb-3"
            />
            {errors.tittle && (
              <p className="text-red-500 text-sm mt-1">{errors.tittle[0]}</p>
            )}
            <textarea
              placeholder="Note Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded mb-3"
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content[0]}</p>
            )}
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {button}
            </button>
            {serverMessage && (
              <p className="text-center mt-4 text-sm text-gray-700">
                {serverMessage}
              </p>
            )}
          </form>
        </div>
      )}

      {loading ? (
        <div>Loading notes...</div>
      ) : selectedStudent ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Notes by selected student:
          </h2>
          {notes.length === 0 ? (
            <p>No notes found.</p>
          ) : (
            <ul>
              {notes.map((note) => (
                <li
                  key={note.note_id}
                  className="border p-4 rounded mb-4 shadow"
                >
                  <h3 className="font-semibold">{note.tittle}</h3>
                  <p>
                    <em>{note.content}</em>
                  </p>
                  <div className="mt-2 flex gap-4">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.note_id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p>Please select a student to view their notes.</p>
      )}
    </div>
  );
};

export default TeacherDashboard;
