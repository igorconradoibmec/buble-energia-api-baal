const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Isola o banco antes de qualquer modulo carregar o singleton de conexao.
// Define as duas variaveis (DB_PATH e DATABASE_PATH) para funcionar
// independente da nomenclatura da branch ativa.
const TEST_DB = path.join(os.tmpdir(), `bulbe-auth-test-${process.pid}-${Date.now()}.db`);
process.env.DB_PATH = TEST_DB;
process.env.DATABASE_PATH = TEST_DB;

// Migrations precisam rodar antes de carregar app/repository,
// pois os repositorios preparam statements no momento do require.
require('../src/db/migrate').runMigrations();
require('../src/db/seeds/seed_users').seedUsers();

const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../src/app');
const userRepository = require('../src/repositories/user.repository');

const LOGIN = '/api/v1/auth/login';

test.after(() => {
    for (const suffix of ['', '-wal', '-shm', '-journal']) {
        fs.rmSync(TEST_DB + suffix, { force: true });
    }
});

test('login com credenciais validas retorna 200 com token e usuario publico', async () => {
    const res = await request(app)
        .post(LOGIN)
        .send({ email: 'admin@bulbe.com', senha: 'admin123' });

    assert.equal(res.status, 200);
    assert.ok(res.body.token, 'deve retornar um token');
    assert.equal(res.body.expiresIn, '1h');
    assert.deepEqual(res.body.usuario, {
        id: '1',
        nome: 'Administrador',
        email: 'admin@bulbe.com',
        role: 'admin',
    });
    assert.equal(res.body.usuario.senha_hash, undefined, 'nao deve vazar senha_hash');
});

test('login de outro usuario seedado (igor) retorna 200', async () => {
    const res = await request(app)
        .post(LOGIN)
        .send({ email: 'igor@bulbe.com', senha: 'bulbe2026' });

    assert.equal(res.status, 200);
    assert.equal(res.body.usuario.email, 'igor@bulbe.com');
    assert.equal(res.body.usuario.role, 'cliente');
});

test('login com senha errada retorna 401', async () => {
    const res = await request(app)
        .post(LOGIN)
        .send({ email: 'admin@bulbe.com', senha: 'senha-errada' });

    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'Credenciais invalidas');
});

test('login com usuario inexistente retorna 401', async () => {
    const res = await request(app)
        .post(LOGIN)
        .send({ email: 'naoexiste@bulbe.com', senha: 'qualquer' });

    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'Credenciais invalidas');
});

test('login com body vazio retorna 400', async () => {
    const res = await request(app).post(LOGIN).send({});

    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Informe email e senha');
});

test('user.repository.findByEmail retorna usuario com senha_hash bcrypt', () => {
    const usuario = userRepository.findByEmail('admin@bulbe.com');

    assert.ok(usuario);
    assert.equal(usuario.email, 'admin@bulbe.com');
    assert.ok(usuario.senha_hash.startsWith('$2'), 'senha deve estar hasheada com bcrypt');
});

test('user.repository.findByEmail retorna undefined para email inexistente', () => {
    assert.equal(userRepository.findByEmail('ninguem@bulbe.com'), undefined);
});
