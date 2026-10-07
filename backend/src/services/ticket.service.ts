import { Types } from 'mongoose';
import { Ticket, type TicketStatus } from '../models/Ticket.js';
import { AppError } from '../middleware/errors.js';

const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: [],
  CLOSED: []
};

const populatedTicket = [
  { path: 'creator', select: 'name email role' },
  { path: 'assignedAgent', select: 'name email role' }
];

function validId(id: string): void {
  if (!Types.ObjectId.isValid(id)) throw new AppError(404, 'Ticket not found');
}

export async function createTicket(input: { title: string; description: string; priority: string }, creatorId: string) {
  const ticket = await Ticket.create({ ...input, creator: creatorId, status: 'OPEN' });
  return ticket.populate(populatedTicket);
}

export async function listTickets(userId: string, role: string) {
  const query = role === 'agent' ? {} : { creator: userId };
  const result = Ticket.find(query);
  if (role === 'agent') result.sort({ priorityWeight: -1, createdAt: 1 });
  else result.sort({ createdAt: -1 });
  return result.populate(populatedTicket);
}

export async function getTicket(ticketId: string, userId: string, role: string) {
  validId(ticketId);
  const ticket = await Ticket.findById(ticketId).populate(populatedTicket);
  if (!ticket) throw new AppError(404, 'Ticket not found');
  if (role !== 'agent' && ticket.creator._id.toString() !== userId) throw new AppError(403, 'You can only access your own tickets');
  return ticket;
}

export async function assignTicket(ticketId: string, agentId: string) {
  validId(ticketId);
  // This conditional update is atomic: only one agent can claim an unassigned ticket.
  const ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId, assignedAgent: null },
    { $set: { assignedAgent: agentId } },
    { new: true }
  ).populate(populatedTicket);
  if (ticket) return ticket;

  const exists = await Ticket.exists({ _id: ticketId });
  if (!exists) throw new AppError(404, 'Ticket not found');
  throw new AppError(409, 'Ticket is already assigned to another agent');
}

export async function changeStatus(ticketId: string, requestedStatus: TicketStatus) {
  validId(ticketId);
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new AppError(404, 'Ticket not found');
  if (!allowedTransitions[ticket.status as TicketStatus].includes(requestedStatus)) {
    throw new AppError(400, `Invalid transition from ${ticket.status} to ${requestedStatus}`);
  }
  ticket.status = requestedStatus;
  await ticket.save();
  return ticket.populate(populatedTicket);
}

export async function closeUserTicket(ticketId: string, userId: string) {
  validId(ticketId);
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new AppError(404, 'Ticket not found');
  
  // Only the creator can close their own ticket
  if (ticket.creator.toString() !== userId) {
    throw new AppError(403, 'You can only close your own tickets');
  }
  
  // Only OPEN tickets can be closed by users
  if (ticket.status !== 'OPEN') {
    throw new AppError(400, 'Only open tickets can be closed');
  }
  
  ticket.status = 'CLOSED';
  await ticket.save();
  return ticket.populate(populatedTicket);
}
