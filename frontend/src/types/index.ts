export type Role = 'user' | 'agent';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface TicketPerson {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  creator: TicketPerson;
  assignedAgent: TicketPerson | null;
  createdAt: string;
  updatedAt: string;
}

