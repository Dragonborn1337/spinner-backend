import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

console.log('DATABASE_URL:', process.env.DATABASE_URL);

export const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});

db.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => {
        console.error('PostgreSQL connection error:', err.message);
    });
