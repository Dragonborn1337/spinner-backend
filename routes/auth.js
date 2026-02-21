import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { verifyTelegramInitData, extractTelegramUser } from '../services/telegramAuth.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { initData } = req.body;

        if (!initData) {
            return res.status(400).json({ error: 'initData required' });
        }

        if (!process.env.BOT_TOKEN) {
            console.error("BOT_TOKEN missing");
            return res.status(500).json({ error: 'Server config error' });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET missing");
            return res.status(500).json({ error: 'Server config error' });
        }

        const isValid = verifyTelegramInitData(initData, process.env.BOT_TOKEN);

        if (!isValid) {
            console.log("Invalid Telegram signature");
            return res.status(401).json({ error: 'Invalid Telegram signature' });
        }

        const tgUser = extractTelegramUser(initData);

        if (!tgUser) {
            return res.status(400).json({ error: 'Telegram user not found' });
        }

        const { id: telegram_id, username, photo_url: avatar } = tgUser;

        let userResult = await db.query(
            'SELECT * FROM users WHERE telegram_id = $1',
            [telegram_id]
        );

        let user;

        if (userResult.rows.length === 0) {
            const newUser = await db.query(
                `INSERT INTO users (telegram_id, username, avatar)
                 VALUES ($1, $2, $3)
                     RETURNING *`,
                [telegram_id, username || null, avatar || null]
            );

            user = newUser.rows[0];
        } else {
            user = userResult.rows[0];
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user
        });

    } catch (error) {
        console.error('Auth crash:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;