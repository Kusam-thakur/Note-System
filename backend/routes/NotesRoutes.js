import express from "express";
import {
  CreateNotes,
  UpdateNotes,
  DeleteNotes,
  GetNotesByUserId,
} from "../controllers/NotesControllers.js";
import {GetStudentsNotesByTeacherId , GetStudentsByTeacherId , GetStudentsNotes} from "../controllers/TeacherController.js"
import isAuthenticated from "../IsAuthenticated.js";

const router = express.Router();
router.post("/create",isAuthenticated, CreateNotes);
router.put("/update/:id",isAuthenticated, UpdateNotes);
router.delete("/delete/:id",isAuthenticated, DeleteNotes);
router.get("/my-notes/",isAuthenticated, GetNotesByUserId);    
router.get("/Dashboard/:teacherId/notes", GetStudentsNotesByTeacherId);  
router.get("/Dashboard/:teacherId/students", GetStudentsByTeacherId);    
router.get("/Dashboard/:teacherId/student/:studentId/notes", GetStudentsNotes);     

export default router;
