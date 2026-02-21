import express from 'express';
import { db } from '../db.js';

const router = express.Router();

const SPIN_COST = 10; // стоимость одного спина в stars

// простая логика выпадения
function generateReward() {
    const random = Math.random();

    if (random < 0.6) {
        return { type: 'none', amount: 0 };
    } else if (random < 0.9) {
        return { type: 'stars', amount: 5 };
    } else {
        return { type: 'ton', amount: 0.1 };
    }
}

router.post('/', async (req, res) => {
    try {
        const { telegram_id } = req.body;

        if (!telegram_id) {
            return res.status(400).json({ error: 'telegram_id required' });
        }

        const userResult = await db.query(
            'SELECT * FROM users WHERE telegram_id = $1',
            [telegram_id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        if (user.stars_balance < SPIN_COST) {
            return res.status(400).json({ error: 'Not enough stars' });
        }

        const reward = generateReward();

        // списываем stars
        let newStarsBalance = user.stars_balance - SPIN_COST;
        let newTonBalance = user.ton_balance;

        if (reward.type === 'stars') {
            newStarsBalance += reward.amount;
        }

        if (reward.type === 'ton') {
            newTonBalance = Number(newTonBalance) + reward.amount;
        }

        await db.query(
            'UPDATE users SET stars_balance = $1, ton_balance = $2 WHERE id = $3',
            [newStarsBalance, newTonBalance, user.id]
        );

        await db.query(
            `INSERT INTO spins (user_id, cost, reward_type, reward_amount)
             VALUES ($1, $2, $3, $4)`,
            [user.id, SPIN_COST, reward.type, reward.amount]
        );

        res.json({
            reward,
            stars_balance: newStarsBalance,
            ton_balance: newTonBalance
        });

    } catch (error) {
        console.error('Spin error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
