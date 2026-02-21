CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       telegram_id BIGINT UNIQUE NOT NULL,
                       username TEXT,
                       avatar TEXT,
                       stars_balance INT DEFAULT 0,
                       ton_balance NUMERIC(10,4) DEFAULT 0,
                       is_admin BOOLEAN DEFAULT FALSE,
                       blocked BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE spins (
                       id SERIAL PRIMARY KEY,
                       user_id INT REFERENCES users(id),
                       cost INT,
                       reward_type TEXT,
                       reward_amount NUMERIC(10,4),
                       created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE star_payments (
                               id SERIAL PRIMARY KEY,
                               telegram_payment_id TEXT,
                               user_id INT REFERENCES users(id),
                               amount INT,
                               refunded BOOLEAN DEFAULT FALSE,
                               created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ton_withdrawals (
                                 id SERIAL PRIMARY KEY,
                                 user_id INT REFERENCES users(id),
                                 amount NUMERIC(10,4),
                                 address TEXT,
                                 status TEXT DEFAULT 'pending',
                                 created_at TIMESTAMP DEFAULT NOW()
);
