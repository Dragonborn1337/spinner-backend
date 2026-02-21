import crypto from 'crypto';

export function verifyTelegramInitData(initData, botToken) {
    const urlParams = new URLSearchParams(initData);

    const hash = urlParams.get('hash');
    if (!hash) return false;

    urlParams.delete('hash');

    const dataCheckString = [...urlParams.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    // 🔥 ПРАВИЛЬНЫЙ secret key по документации Telegram
    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

    const hmac = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    return hmac === hash;
}

export function extractTelegramUser(initData) {
    const urlParams = new URLSearchParams(initData);
    const user = urlParams.get('user');
    if (!user) return null;
    return JSON.parse(user);
}