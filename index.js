import './db.js';
import spinRouter from './routes/spin.js';

import express from 'express';
import cors from 'cors';

import spinRoutes from './routes/spin.js';
import authRoutes from './routes/auth.js';

const app = express();

// ⚠️ middleware сначала
app.use(cors({
    origin: '*'
}));
app.use(express.json());

// health check
app.get('/', (req, res) => {
    res.json({ status: 'Backend running' });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/spin', spinRoutes);
app.use('/api/spin', spinRouter);

// ⚠️ Render требует process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
});