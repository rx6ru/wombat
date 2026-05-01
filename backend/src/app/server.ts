import { config } from '../infrastructure/config/env.js';
import { createApp } from './app.js';

export function startServer() {
  const app = createApp();
  app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
}
