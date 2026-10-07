import type { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    void fn(req, res, next).catch(next);
  };
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }
  if (typeof error === 'object' && error && 'code' in error && error.code === 11000) {
    res.status(409).json({ message: 'This email is already in use' });
    return;
  }
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
}

