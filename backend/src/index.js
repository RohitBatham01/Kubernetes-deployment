import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { taskRouter } from './routes/tasks.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security & parsing middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Health check endpoints for Kubernetes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.json({ status: 'ready', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/tasks', taskRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
