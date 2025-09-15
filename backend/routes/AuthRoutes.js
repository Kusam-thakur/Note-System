import express from "express";
// import IsAuthenticated from "../AuthMiddelware/IsAuthenticated.js"
import { login , register , GetUserById } from "../controllers/AuthControllers.js"
import {GetAllTeachers} from "../controllers/TeacherController.js"
import isAuthenticated from "../IsAuthenticated.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/teachers", GetAllTeachers);
router.get("/user",isAuthenticated, GetUserById )

export default router;
