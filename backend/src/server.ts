import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { app } from './app.js';

async function start(): Promise<void> {
  await connectDatabase();
  app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}`));
}

void start();

