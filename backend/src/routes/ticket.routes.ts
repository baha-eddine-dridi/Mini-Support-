import { Router } from 'express';
import { assign, close, create, getOne, list, updateStatus } from '../controllers/ticket.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errors.js';
import { validateBody } from '../middleware/validate.js';
import { createTicketSchema, updateStatusSchema } from '../schemas/ticket.schema.js';

export const ticketRouter = Router();
ticketRouter.use(authenticate);
ticketRouter.post('/', authorize('user'), validateBody(createTicketSchema), asyncHandler(create));
ticketRouter.get('/', asyncHandler(list));
ticketRouter.get('/:id', asyncHandler(getOne));
ticketRouter.patch('/:id/assign', authorize('agent'), asyncHandler(assign));
ticketRouter.patch('/:id/status', authorize('agent'), validateBody(updateStatusSchema), asyncHandler(updateStatus));
ticketRouter.patch('/:id/close', authorize('user'), asyncHandler(close));

