import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5433,
  database: 'NoteSystem'
});
pool.connect()
  .then(client => {
    console.log('✅ Database connected successfully');
    client.release(); 
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1); 
  });

export default {
  query: (text, params) => pool.query(text, params),
};
