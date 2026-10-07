import type { Request, Response } from 'express';
import { assignTicket, changeStatus, closeUserTicket, createTicket, getTicket, listTickets } from '../services/ticket.service.js';

export async function create(req: Request, res: Response): Promise<void> {
  const ticket = await createTicket(req.body, req.user!.id);
  res.status(201).json({ ticket });
}

export async function list(req: Request, res: Response): Promise<void> {
  const tickets = await listTickets(req.user!.id, req.user!.role);
  res.json({ tickets });
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const ticket = await getTicket(String(req.params.id), req.user!.id, req.user!.role);
  res.json({ ticket });
}

export async function assign(req: Request, res: Response): Promise<void> {
  const ticket = await assignTicket(String(req.params.id), req.user!.id);
  res.json({ ticket });
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const ticket = await changeStatus(String(req.params.id), req.body.status);
  res.json({ ticket });
}

export async function close(req: Request, res: Response): Promise<void> {
  const ticket = await closeUserTicket(String(req.params.id), req.user!.id);
  res.json({ ticket });
}
