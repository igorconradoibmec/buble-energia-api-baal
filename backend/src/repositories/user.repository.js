const db = require('../db');

const INSERT_USER = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, nome, senha_hash, role, created_at)
    VALUES (@id, null, null, null, 'guest', @created_at)
`);

function insert(user) {
    INSERT_USER.run({ id: user.userId, created_at: user.createdAt });
    return user;
}

module.exports = { insert };
