import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { findUserById, updateUser } from '../models/userModel';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    const user = await authService.register(name, email, password);
    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email e senha obrigatórios' });
    const result = await authService.login(email, password);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }
}

export async function getProfile(req: AuthRequest, res: Response) {
  const user = await findUserById(req.user!.id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  return res.json(user);
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { name, email, bio, avatar_url } = req.body;
    await updateUser(req.user!.id, { name, email, bio, avatar_url });
    const updated = await findUserById(req.user!.id);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}