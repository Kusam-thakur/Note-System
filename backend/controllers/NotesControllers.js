import db from '../db.js';
import { NoteSchema } from "../ZodSchemas/noteSchema.js"
import dotenv from "dotenv";
dotenv.config();

export const CreateNotes = async (req, res) => {
  try {
    const parsedData = NoteSchema.safeParse(req.body);
    if (!parsedData.success) {
      const errors = parsedData.error.flatten().fieldErrors;
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }
    const { tittle, content, creator_id } = parsedData.data;
    // const userId = req.user.id;
    // const userId = req.id;
    console.log("mai hu ", req.user)
    let userId
    if (creator_id) {
      userId = creator_id;
    } else {
      userId = req.user.id;
    }

    console.log("data ", userId, tittle, content)
    const now = new Date();
    // const currentDateTime = now.toLocaleString();
    // console.log(`Current Date and Time: ${currentDateTime}`);
    await db.query(
      'INSERT INTO notes (creator_id, tittle, content ) VALUES ($1, $2, $3)',
      [userId, tittle, content]
    );

    return res.status(201).json({ message: 'Note created successfully' });
  } catch (error) {
    console.error("CreateNotes Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const UpdateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    // const userId = req.id;
    // const userId = req.user.id;
    // const userId = 123;


    // Validate input
    const parsedData = NoteSchema.safeParse(req.body);
    if (!parsedData.success) {
      const errors = parsedData.error.flatten().fieldErrors;
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    const { tittle, content, creator_id } = parsedData.data;
    let userId
    if (creator_id) {
      userId = creator_id;
    } else {
      userId = req.user.id;
    }

    const note = await db.query(
      "SELECT * FROM notes WHERE note_id = $1 AND creator_id = $2",
      [id, userId]
    );
    if (note.rows.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    const now = new Date();
    const currentDateTime = now.toLocaleString();
    console.log(`Current Date and Time: ${currentDateTime}`);
    await db.query(
      "UPDATE notes SET tittle = $1, content = $2 WHERE note_id = $3 AND creator_id = $4",
      [tittle || note.rows[0].tittle, content || note.rows[0].content, id, userId ]
    );

    return res.status(200).json({ message: "Note updated successfully" });
  } catch (error) {
    console.error("UpdateNotes Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const DeleteNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { creator_id } = req.body || {};

    let userId = creator_id ? creator_id : req.user?.id;
    const note = await db.query(
      "SELECT * FROM notes WHERE note_id = $1 AND creator_id = $2",
      [id, userId]
    );
    if (note.rows.length === 0) {
      return res.status(404).json({ message: "Note not found or unauthorized." });
    }

    await db.query("DELETE FROM notes WHERE note_id = $1 AND creator_id = $2", [id, userId]);

    return res.status(200).json({ message: "Note deleted successfully." });
  } catch (error) {
    console.error("DeleteNotes Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};


export const GetNotesByUserId = async (req, res) => {
  try {
    // const userId = req.user.id;
    //  const userId = 123;
    // const userId = req.id;
    const userId = req.user.id;

    const result = await db.query("SELECT * FROM notes WHERE creator_id = $1", [userId]);

    return res.status(200).json({ notes: result.rows });
  } catch (error) {
    console.error("GetNotesByUserId Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};







