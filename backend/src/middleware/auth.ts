import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './errors.js';
import type { JwtUser, Role } from '../types/user.js';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = req.header('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return next(new AppError(401, 'Authentication required'));

  try {
    req.user = jwt.verify(token, env.jwtSecret) as JwtUser;
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) return next(new AppError(403, 'Insufficient permissions'));
    next();
  };
}

