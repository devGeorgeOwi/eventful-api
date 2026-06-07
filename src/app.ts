import express from 'express';
import { authRoutes } from './modules/auth/auth.routes';
import { eventsRoutes } from './modules/events/events.routes';
import { ticketsRoutes } from './modules/tickets/tickets.routes';
import { notificationsRoutes } from './modules/notifications/notifications.routes';
import { errorHandler } from './common/middleware/error-handler';

const app = express();

// Use Express JSON middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/notifications', notificationsRoutes);
// Health check
app.get('/health', (req, res) => res.send('OK'));

// Error handling (must be last)
app.use(errorHandler);

export default app;