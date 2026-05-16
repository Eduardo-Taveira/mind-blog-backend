import pool from '../config/db';

export interface Article {
  id?: number;
  title: string;
  content: string;
  summary?: string;
  category?: string;
  tags?: string;
  banner_image?: Buffer | null;
  author_id: number;
  likes?: number;
  views?: number;
}

export async function getAllArticles() {
  const [rows]: any = await pool.query(`
    SELECT a.id, a.title, a.content, a.summary, a.category, a.tags,
           a.likes, a.views, a.created_at, a.updated_at,
           u.id as author_id, u.name as author_name, u.avatar_url as author_avatar
    FROM articles a
    JOIN users u ON a.author_id = u.id
    ORDER BY a.created_at DESC
  `);
  return rows;
}

export async function getArticleById(id: number) {
  const [rows]: any = await pool.query(`
    SELECT a.*, u.name as author_name, u.avatar_url as author_avatar
    FROM articles a
    JOIN users u ON a.author_id = u.id
    WHERE a.id = ?
  `, [id]);
  return rows[0] || null;
}

export async function createArticle(article: Article) {
  const [result]: any = await pool.query(
    'INSERT INTO articles (title, content, summary, category, tags, banner_image, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [article.title, article.content, article.summary ?? null, article.category ?? 'Geral',
     article.tags ?? null, article.banner_image ?? null, article.author_id]
  );
  return result.insertId;
}

export async function updateArticle(id: number, article: Partial<Article>) {
  const fields: string[] = [];
  const values: any[] = [];

  if (article.title !== undefined)   { fields.push('title = ?');        values.push(article.title); }
  if (article.content !== undefined) { fields.push('content = ?');      values.push(article.content); }
  if (article.summary !== undefined) { fields.push('summary = ?');      values.push(article.summary); }
  if (article.category !== undefined){ fields.push('category = ?');     values.push(article.category); }
  if (article.tags !== undefined)    { fields.push('tags = ?');         values.push(article.tags); }
  if (article.banner_image !== undefined) { fields.push('banner_image = ?'); values.push(article.banner_image); }

  if (fields.length === 0) return 0;
  values.push(id, article.author_id);

  const [result]: any = await pool.query(
    `UPDATE articles SET ${fields.join(', ')} WHERE id = ? AND author_id = ?`,
    values
  );
  return result.affectedRows;
}

export async function deleteArticle(id: number, author_id: number) {
  const [result]: any = await pool.query(
    'DELETE FROM articles WHERE id = ? AND author_id = ?',
    [id, author_id]
  );
  return result.affectedRows;
}

export async function likeArticle(id: number) {
  await pool.query('UPDATE articles SET likes = likes + 1 WHERE id = ?', [id]);
}

export async function viewArticle(id: number) {
  await pool.query('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);
}