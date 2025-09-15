import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteCard from "../Component/NoteCard";
import api from "../Api.tsx"



const Profile = () => {
   const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [notes, setNotes] = useState([]);
  const [tittle, setTittle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [button , setButton] = useState("AddNote");

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
    setEditingNoteId(note.note_id); 
    setButton("Update");// You'll need to manage editing state
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`http://localhost:5000/api/notes/delete/${id}`);
      getNotes(); // refresh notes
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
const createNote = async (e) => {
  e.preventDefault();
  try {
    if (editingNoteId) {
      setButton("Add Note");
      await api.put(`http://localhost:5000/api/notes/update/${editingNoteId}`, { tittle, content });
      setEditingNoteId(null); 
    } else {
      setButton("AddNote");
      await api.post("http://localhost:5000/api/notes/create", { tittle, content });
    }

    setTittle("");
    setContent("");
    getNotes();
  } catch (err) {
    console.error("Submit error:", err);
  }
};

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">📒 My Profile</h1>

      <form onSubmit={createNote} className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Note Tittle"
          value={tittle}
          onChange={(e) => setTittle(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded mb-3"
        />
        <textarea
          placeholder="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded mb-3"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
         {button}
        </button>
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

export default Profile;
