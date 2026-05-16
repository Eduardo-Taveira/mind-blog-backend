import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as commentModel from '../models/commentModel';

export async function getComments(req: AuthRequest, res: Response) {
  const comments = await commentModel.getCommentsByArticle(Number(req.params.id));
  return res.json(comments);
}

export async function createComment(req: AuthRequest, res: Response) {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Conteúdo obrigatório' });
  const id = await commentModel.createComment(
    Number(req.params.id),
    req.user!.id,
    content
  );
  return res.status(201).json({ id, message: 'Comentário publicado' });
}

export async function likeComment(req: AuthRequest, res: Response) {
  await commentModel.likeComment(Number(req.params.id));
  return res.json({ message: 'Curtida registrada' });
}