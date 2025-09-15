import { registerSchema } from "../ZodSchemas/registerSchema.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginSchema } from '../ZodSchemas/loginSchema.js';
import db from '../db.js';
import dotenv from "dotenv";
dotenv.config();


export const register = async (req, res) => {
  try {
    const parsedData = registerSchema.safeParse(req.body);
    console.log("parsedData ", parsedData)

    if (!parsedData.success) {
      const errors = parsedData.error.flatten().fieldErrors;
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }
    const { username, password, role, teacherId } = parsedData.data;
    console.log(username, password, role, teacherId)

    const existingUser = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'student') {
      const teacherExists = await db.query(
        'SELECT * FROM users WHERE users_id = $1 AND role = $2',
        [teacherId, 'teacher']);
      console.log("teacherExists", teacherExists)

      if (teacherExists.rows.length === 0) {
        return res.status(400).json({ message: 'Selected teacher does not exist' });
      }

      await db.query(
        'INSERT INTO users (username, password, role, teacher_id) VALUES ($1, $2, $3, $4)',
        [username, hashedPassword, role, teacherId]
      );
      console.log("added")
    } else {
      await db.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
        [username, hashedPassword, role]
      );
    }

    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.users_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    return res.status(200).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.users_id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {
    console.log('Registration Error:', error)
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const parsedData = loginSchema.safeParse(req.body);
    console.log("Parsed data: ", parsedData);
    if (!parsedData.success) {
      const errors = parsedData.error.flatten().fieldErrors;
      console.log("Validation Errors:", errors);

      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    const { username, password } = parsedData.data;

    const userResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = userResult.rows[0];
    console.log("user",user)

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }


    const token = jwt.sign(
      { id: user.users_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.users_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const GetUserById = async (req, res) => {
  try {
    const userId = req.user.id;  

    const result = await db.query('SELECT * FROM users WHERE users_id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User fetched successfully',
      user: result.rows[0], 
    });

  } catch (error) {
    console.error('Get user by Id Error:', error);
    return res.status(500).json({ message: 'Server error while fetching user' });
  }
};





