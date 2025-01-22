import express from 'express';
import { PORT } from './config.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import clientsRoutes from './routes/clients.routes.js';
import medicalNeedTypeRoutes from './routes/medicalNeedType.routes.js';
import medicalHistoryRoutes from './routes/medicalHistory.routes.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use(usersRoutes);
app.use(clientsRoutes);
app.use(medicalNeedTypeRoutes);
app.use(medicalHistoryRoutes);

app.listen(PORT);
console.log('server on port', PORT);
