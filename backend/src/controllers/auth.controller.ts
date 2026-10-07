import type { Request, Response } from 'express';
import { createToken, loginUser, publicUser, registerUser } from '../services/auth.service.js';

export async function register(req: Request, res: Response): Promise<void> {
  const user = await registerUser(req.body);
  res.status(201).json({ user: publicUser(user), token: createToken(user) });
}

export async function login(req: Request, res: Response): Promise<void> {
  const user = await loginUser(req.body.email, req.body.password);
  res.json({ user: publicUser(user), token: createToken(user) });
}

export async function me(req: Request, res: Response): Promise<void> {
  res.json({ user: req.user });
}

