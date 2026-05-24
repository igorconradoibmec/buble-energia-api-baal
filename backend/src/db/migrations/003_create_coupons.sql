-- Tabela de cupons de desconto (US-22).
-- Sem FK: cupons sao entidade independente, identificados pelo proprio codigo.
-- validade NULL = cupom sem expiracao. A validacao temporal e feita por query
-- no repositorio (WHERE validade IS NULL OR validade >= date('now')).

CREATE TABLE IF NOT EXISTS coupons (
    code TEXT PRIMARY KEY,
    discount REAL NOT NULL CHECK (discount >= 0),
    type TEXT NOT NULL DEFAULT 'percentage' CHECK (type IN ('percentage', 'fixed')),
    validade TEXT,
    max_uses INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed inicial importado de src/data/coupons.json (US-22).
-- INSERT OR IGNORE mantem a migration idempotente: nao duplica se ja existir.
-- Todos os cupons atuais sao percentuais e sem expiracao (validade NULL).
INSERT OR IGNORE INTO coupons (code, discount, type) VALUES
    ('BULBE10', 0.10, 'percentage'),
    ('BULBE15', 0.15, 'percentage'),
    ('BULBE20', 0.20, 'percentage'),
    ('BLACKFRIDAY', 0.20, 'percentage'),
    ('WELCOME5', 0.05, 'percentage'),
    ('PROMO25', 0.25, 'percentage'),
    ('SUPERPROMO', 0.40, 'percentage'),
    ('SUPER30', 0.30, 'percentage'),
    ('CLIENTEVIP', 0.12, 'percentage'),
    ('MEGASALE', 0.18, 'percentage');
