import pool from '../config/db';

export async function getCommentsByArticle(article_id: number) {
  const [rows]: any = await pool.query(`
    SELECT c.*, u.name as author_name, u.avatar_url as author_avatar
    FROM comments c
    JOIN users u ON c.author_id = u.id
    WHERE c.article_id = ?
    ORDER BY c.created_at ASC
  `, [article_id]);
  return rows;
}

export async function createComment(article_id: number, author_id: number, content: string) {
  const [result]: any = await pool.query(
    'INSERT INTO comments (article_id, author_id, content) VALUES (?, ?, ?)',
    [article_id, author_id, content]
  );
  return result.insertId;
}

export async function likeComment(id: number) {
  await pool.query('UPDATE comments SET likes = likes + 1 WHERE id = ?', [id]);
}