<div style="color:red;">BUILD VERSION 3</div>
import './db.js';

import spinRoutes from './routes/spin.js';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';

const app = express();

app.use('/api/spin', spinRoutes);
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/auth', authRoutes);

app.listen(3000, () => {
    console.log('Backend running on :3000');
});
