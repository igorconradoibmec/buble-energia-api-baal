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
