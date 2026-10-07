import { Schema, model, type InferSchemaType } from 'mongoose';

export const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;
export type Priority = (typeof priorities)[number];
export type TicketStatus = (typeof statuses)[number];

const priorityWeight: Record<Priority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4
};

const ticketSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 3, maxlength: 4000 },
    priority: { type: String, required: true, enum: priorities },
    // Stored solely to make the agent's priority ordering efficient in MongoDB.
    priorityWeight: { type: Number, required: true },
    status: { type: String, required: true, enum: statuses, default: 'OPEN' },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedAgent: { type: Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

ticketSchema.pre('validate', function setPriorityWeight(next) {
  this.priorityWeight = priorityWeight[this.priority as Priority];
  next();
});

ticketSchema.index({ priorityWeight: -1, createdAt: 1 });
ticketSchema.index({ creator: 1, createdAt: -1 });

export type TicketDocument = InferSchemaType<typeof ticketSchema>;
export const Ticket = model('Ticket', ticketSchema);

