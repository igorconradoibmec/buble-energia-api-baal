const bcrypt = require('bcryptjs');
const db = require('../connection');

const SALT_ROUNDS = 10;

const SEED_USERS = [
    { id: '1', nome: 'Administrador', email: 'admin@bulbe.com', senha: 'admin123', role: 'admin' },
    { id: '2', nome: 'Cliente Teste', email: 'cliente@bulbe.com', senha: 'cliente123', role: 'cliente' },
    { id: '3', nome: 'Igor Conrado', email: 'igor@bulbe.com', senha: 'bulbe2026', role: 'cliente' },
];

function seedUsers() {
    const upsert = db.prepare(`
        INSERT INTO users (id, email, nome, senha_hash, role)
        VALUES (@id, @email, @nome, @senha_hash, @role)
        ON CONFLICT(email) DO UPDATE SET
            nome = excluded.nome,
            senha_hash = excluded.senha_hash,
            role = excluded.role,
            updated_at = datetime('now')
    `);

    const run = db.transaction((users) => {
        let count = 0;
        for (const u of users) {
            const senha_hash = bcrypt.hashSync(u.senha, SALT_ROUNDS);
            upsert.run({ id: u.id, email: u.email, nome: u.nome, senha_hash, role: u.role });
            count += 1;
        }
        return count;
    });

    return run(SEED_USERS);
}

if (require.main === module) {
    const seeded = seedUsers();
    console.log(`seed_users: ${seeded} usuario(s) seedado(s).`);
}

module.exports = { seedUsers };
