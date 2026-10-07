import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../middleware/errors.js';
import type { Role } from '../types/user.js';

export async function registerUser(input: { name: string; email: string; password: string }) {
  const passwordHash = await bcrypt.hash(input.password, 12);
  // The public endpoint deliberately never accepts a role: new accounts are users only.
  const user = await User.create({ name: input.name, email: input.email, passwordHash, role: 'user' });
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, 'Invalid email or password');
  }
  return user;
}

export function createToken(user: { _id: { toString(): string }; email: string; role: Role }): string {
  return jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, env.jwtSecret, { expiresIn: '8h' });
}

export function publicUser(user: { _id: { toString(): string }; name: string; email: string; role: Role; createdAt?: Date }) {
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
}
