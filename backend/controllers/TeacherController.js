import db from '../db.js';

export const GetAllTeachers = async (req, res) => {
  try {
    const result = await db.query('SELECT users_id, username, role FROM users WHERE role = $1', ['teacher']);

    return res.status(200).json({
      message: 'Teachers fetched successfully',
      teachers: result.rows,
    });

  } catch (error) {
    console.error('GetAllTeachers Error:', error);
    return res.status(500).json({ message: 'Server error while fetching teachers' });
  }
};

export const GetStudentsNotesByTeacherId = async (req, res) => {
  const teacherId = req.params.teacherId;
  console.log(" teacherId " ,  teacherId)

  try {
    const result = await db.query(`
      SELECT 
        notes.note_id AS note_id,
        notes.tittle,
        notes.content,
        FROM notes
        JOIN users ON users.users_id = notes.creator_id
         WHERE users.teacher_id = $1
    `, [teacherId]);
    console.log(result)

    return res.status(200).json({
      message: 'Student notes fetched successfully',
      notes: result.rows,
    });

  } catch (error) {
    console.error('GetStudentsNotesByTeacherId Error:', error);
    return res.status(500).json({ message: 'Server error while fetching notes' });
  }
};




export const GetStudentsByTeacherId =  async (req, res) => {
  const { teacherId } = req.params;
  const result = await db.query('SELECT users_id, username FROM users WHERE teacher_id = $1', [teacherId]);
  res.json(result.rows);
};

export const GetStudentsNotes =   async (req, res) => {
  const { studentId } = req.params;
  const result = await db.query('SELECT note_id, tittle, content FROM notes WHERE creator_id = $1', [studentId]);
  res.json(result.rows);
};

