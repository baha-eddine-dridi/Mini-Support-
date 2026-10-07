import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { authRouter } from './routes/auth.routes.js';
import { ticketRouter } from './routes/ticket.routes.js';

export const app = express();
app.use(cors({ origin: env.clientUrl }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketRouter);
app.use(notFound);
app.use(errorHandler);

