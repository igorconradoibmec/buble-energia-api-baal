const crypto = require('crypto');
const userRepository = require('../repositories/user.repository');

function createGuestSession() {
    const userId = `guest-${crypto.randomBytes(3).toString('hex')}`;
    const createdAt = new Date().toISOString();
    const user = { userId, createdAt };
    userRepository.insert(user);
    return { userId, token: userId, createdAt };
}

module.exports = { createGuestSession };
