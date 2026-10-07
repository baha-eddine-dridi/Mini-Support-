import type { JwtUser } from './user.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

export {};

