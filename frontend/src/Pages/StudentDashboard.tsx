import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteCard from "../Component/NoteCard";
import api from "../Api.tsx"
import { useNavigate } from "react-router-dom";


const StudentDashboard = () => {
   const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [notes, setNotes] = useState([]);
  const [tittle, setTittle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [button , setButton] = useState("AddNote");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState("");

  const getNotes = async () => {
    try {
      const res = await api.get("/notes/my-notes");
      setNotes(res.data.notes);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleEdit = (note) => {
    setTittle(note.tittle);
    setContent(note.content);
    setEditingNoteId(note.id); 
    setButton("Update");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/delete/${id}`);
      getNotes(); 
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
const createNote = async (e) => {
  e.preventDefault();

  try {
    if (editingNoteId) {
      setButton("Add Note");
      await api.put(`/notes/update/${editingNoteId}`, { tittle, content });
      setEditingNoteId(null); 
    } else {
      setButton("AddNote");
      await api.post("/notes/create", { tittle, content });
    }
    setTittle("");
    setContent("");
    getNotes();
  } catch (err:any) {
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

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">📒 Student Dashboard</h1>
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
        

      <form onSubmit={createNote} className="bg-white p-4 rounded shadow mb-6">
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
         {button}
        </button>
         {serverMessage && (
          <p className="text-center mt-4 text-sm text-gray-700">{serverMessage}</p>
        )}
      </form>

      <div>
        {notes.map((note) => (
          <NoteCard
            key={note.note_id}
            tittle={note.tittle}
            content={note.content}
            onEdit={() => handleEdit(note)}
            onDelete={() => handleDelete(note.note_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
