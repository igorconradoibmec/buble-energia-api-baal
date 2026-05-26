CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price REAL NOT NULL,
    old_price REAL,
    discount INTEGER,
    rating REAL,
    rating_count INTEGER,
    image TEXT,
    em_destaque INTEGER NOT NULL DEFAULT 0,
    black_friday INTEGER NOT NULL DEFAULT 0,
    estoque INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
