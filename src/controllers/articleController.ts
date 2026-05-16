import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as articleModel from '../models/articleModel';

export async function getAll(req: AuthRequest, res: Response) {
  const articles = await articleModel.getAllArticles();
  return res.json(articles);
}

export async function getById(req: AuthRequest, res: Response) {
  const article = await articleModel.getArticleById(Number(req.params.id));
  if (!article) return res.status(404).json({ message: 'Artigo não encontrado' });
  // incrementa visualizações automaticamente
  await articleModel.viewArticle(Number(req.params.id));
  return res.json(article);
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const { title, content, summary, category, tags } = req.body;
    if (!title || !content)
      return res.status(400).json({ message: 'Título e conteúdo obrigatórios' });

    const banner_image = req.file ? req.file.buffer : null;

    const id = await articleModel.createArticle({
      title, content, summary, category,
      tags: tags || null,
      banner_image,
      author_id: req.user!.id,
    });

    return res.status(201).json({ id, message: 'Artigo criado com sucesso' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const { title, content, summary, category, tags } = req.body;
    const banner_image = req.file ? req.file.buffer : undefined;

    const affected = await articleModel.updateArticle(Number(req.params.id), {
      title, content, summary, category,
      tags: tags || undefined,
      banner_image,
      author_id: req.user!.id,
    });

    if (!affected) return res.status(403).json({ message: 'Não autorizado ou artigo não encontrado' });
    return res.json({ message: 'Artigo atualizado' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  const affected = await articleModel.deleteArticle(
    Number(req.params.id),
    req.user!.id
  );
  if (!affected) return res.status(403).json({ message: 'Não autorizado ou artigo não encontrado' });
  return res.json({ message: 'Artigo removido' });
}

export async function like(req: Request, res: Response) {
  await articleModel.likeArticle(Number(req.params.id));
  return res.json({ message: 'Curtida registrada' });
}