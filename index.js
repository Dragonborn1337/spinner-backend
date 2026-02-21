import './db.js';

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

// ⚠️ Render требует process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});