import { z } from 'zod';
import { priorities, statuses } from '../models/Ticket.js';

export const createTicketSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(3).max(4000),
  priority: z.enum(priorities)
});

export const updateStatusSchema = z.object({
  status: z.enum(statuses)
});

