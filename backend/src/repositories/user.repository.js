const db = require('../db/connection');

const INSERT_USER = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, nome, senha_hash, role, created_at)
    VALUES (@id, null, null, null, 'guest', @created_at)
`);

function insert(user) {
    INSERT_USER.run({ id: user.userId, created_at: user.createdAt });
    return user;
}

const FIND_BY_EMAIL = db.prepare(`
    SELECT id, email, nome, senha_hash, role
    FROM users
    WHERE email = ?
`);

function findByEmail(email) {
    return FIND_BY_EMAIL.get(email);
}

module.exports = { insert, findByEmail };
