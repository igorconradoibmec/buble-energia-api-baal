-- Tabelas de pedidos e itens (US-24).
-- FK para users(id) e products(id) declaradas; ativas via PRAGMA foreign_keys
-- (connection.js). Pre-requisito: migrations 001 (users) e 002 (products).
--
-- id TEXT (ord-<hex>) preserva o identificador atual exposto pelos endpoints.
-- user_id e TEXT pois requireAuth injeta o token cru em req.userId (mesmo
-- comportamento ja adotado em carts). order_items.unit_price_snapshot congela
-- o preco no momento da compra (nao acompanha alteracoes futuras do produto).
-- Campos nao normalizaveis do contrato (customer, enderecos) ficam em colunas
-- JSON para preservar a resposta dos endpoints sem mudanca contratual.

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_code TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
    payment_method TEXT NOT NULL,
    coupon_code TEXT,
    coupon_discount REAL NOT NULL DEFAULT 0,
    pix_discount REAL NOT NULL DEFAULT 0,
    subtotal REAL NOT NULL,
    shipping REAL NOT NULL,
    total REAL NOT NULL,
    final_amount REAL NOT NULL,
    customer_json TEXT NOT NULL,
    billing_address_json TEXT NOT NULL,
    delivery_address_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    unit_price_snapshot REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Historico de pedidos do usuario, do mais recente para o mais antigo.
CREATE INDEX IF NOT EXISTS idx_orders_user_created
    ON orders (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order
    ON order_items (order_id);
