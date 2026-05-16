import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/userModel';

export async function register(name: string, email: string, password: string) {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error('Email já cadastrado');

  const hashed = await bcrypt.hash(password, 10);
  const id = await createUser({ name, email, password: hashed });
  return { id, name, email };
}

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Usuário não encontrado');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Senha incorreta');

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

 return { token, user: { id: user.id, name: user.name, email: user.email, bio: user.bio, avatar_url: user.avatar_url } };
}