import express from 'express';
import { authRoutes } from './modules/auth/auth.routes';
import { errorHandler } from './common/middleware/error-handler';

const app = express();

// Use Express JSON middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Error handling (must be last)
app.use(errorHandler);

export default app;