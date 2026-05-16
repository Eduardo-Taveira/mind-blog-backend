import pool from '../config/db';

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar_url?: string;
}

export async function findUserByEmail(email: string) {
  const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function findUserById(id: number) {
  const [rows]: any = await pool.query(
    'SELECT id, name, email, bio, avatar_url, created_at FROM users WHERE id = ?', [id]
  );
  return rows[0] || null;
}

export async function createUser(user: User) {
  const [result]: any = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [user.name, user.email, user.password]
  );
  return result.insertId;
}

export async function updateUser(id: number, data: { name?: string; email?: string; bio?: string; avatar_url?: string }) {
  const [result]: any = await pool.query(
    'UPDATE users SET name = ?, email = ?, bio = ?, avatar_url = ? WHERE id = ?',
    [data.name, data.email, data.bio ?? null, data.avatar_url ?? null, id]
  );
  return result.affectedRows;
}