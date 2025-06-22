import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// router imports
import healthCheckRouter from './routes/healthcheck.routes.js';
import userRoutes from './routes/auth.routes.js';

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRoutes);
export default app;
