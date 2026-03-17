import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';
import tasksRouter from './routes/tasks.js';
import categoriesRouter from './routes/categories.js';
import sseRouter from './routes/sse.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api', tasksRouter);
app.use('/api', categoriesRouter);
app.use('/api', sseRouter);

app.use(errorHandler);

export default app;
