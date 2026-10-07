import { Router } from 'express';
import { login, me, register } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errors.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

export const authRouter = Router();
authRouter.post('/register', validateBody(registerSchema), asyncHandler(register));
authRouter.post('/login', validateBody(loginSchema), asyncHandler(login));
authRouter.get('/me', authenticate, asyncHandler(me));

