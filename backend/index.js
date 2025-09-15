import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import notesRoutes from './routes/NotesRoutes.js';
import AuthRoutes from "./routes/AuthRoutes.js"

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173   ', 
  credentials: true
}));

app.use(express.json());
app.use('/api/notes', notesRoutes);
app.use('/api/auth',AuthRoutes );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
