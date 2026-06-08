const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Isola o banco antes de qualquer modulo carregar o singleton de conexao.
// Define DB_PATH e DATABASE_PATH para funcionar independente da nomenclatura.
const TEST_DB = path.join(os.tmpdir(), `bulbe-bf-test-${process.pid}-${Date.now()}.db`);
process.env.DB_PATH = TEST_DB;
process.env.DATABASE_PATH = TEST_DB;

// Migrations + seed antes de carregar os apps, pois os repositorios preparam
// statements no momento do require. O seed marca os ids 1, 3, 4 e 6 como
// black_friday, garantindo lista nao vazia.
require('../src/db/migrate').runMigrations();
require('../src/db/seeds/seed_products');

const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const blackFridayApp = require('../src/blackFridayApp');
const mainApp = require('../src/app');

const BF_PATH = '/api/v1/products/black-friday';

test.after(() => {
    for (const suffix of ['', '-wal', '-shm', '-journal']) {
        fs.rmSync(TEST_DB + suffix, { force: true });
    }
});

test('app dedicado responde 200 na black-friday com produtos e filtros', async () => {
    const res = await request(blackFridayApp).get(BF_PATH);

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.products), 'products deve ser array');
    assert.ok(res.body.products.length > 0, 'seed marca ids 1,3,4,6 como black_friday');
    assert.equal(res.body.total, res.body.products.length);
    assert.ok(Array.isArray(res.body.filters.categories), 'filters.categories deve ser array');
    assert.ok(Array.isArray(res.body.filters.priceRanges), 'filters.priceRanges deve ser array');
});

test('app dedicado rejeita priceRange invalido com 400', async () => {
    const res = await request(blackFridayApp).get(BF_PATH).query({ priceRange: 'banana' });

    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'priceRange invalido');
});

test('app dedicado aplica o filtro de priceRange valido', async () => {
    const res = await request(blackFridayApp).get(BF_PATH).query({ priceRange: '300-999' });

    assert.equal(res.status, 200);
    for (const p of res.body.products) {
        assert.ok(p.price >= 300 && p.price <= 999, `preco ${p.price} fora da faixa 300-999`);
    }
});

test('app principal NAO serve mais a black-friday (cai em /:id e retorna 404)', async () => {
    const res = await request(mainApp).get(BF_PATH);

    assert.equal(res.status, 404);
    assert.equal(res.body.error, 'Produto nao encontrado');
});

test('app principal continua servindo catalogo, destaques e produto por id', async () => {
    const list = await request(mainApp).get('/api/v1/products');
    assert.equal(list.status, 200);
    assert.ok(Array.isArray(list.body.products));

    const featured = await request(mainApp).get('/api/v1/products/featured');
    assert.equal(featured.status, 200);
    assert.ok(Array.isArray(featured.body.products));

    const byId = await request(mainApp).get('/api/v1/products/1');
    assert.equal(byId.status, 200);
    assert.equal(byId.body.id, 1);
});
