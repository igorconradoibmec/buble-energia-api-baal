const db = require('../db');

// Cupom valido = existe E (sem validade OU validade ainda nao expirou).
// A checagem temporal e feita na query (US-22): validade >= data de hoje.
const FIND_VALID = db.prepare(`
    SELECT code, discount, type, validade, max_uses, used_count
    FROM coupons
    WHERE code = ?
      AND (validade IS NULL OR validade >= date('now'))
`);

function findByCode(code) {
    if (!code) return null;
    const normalized = String(code).trim().toUpperCase();
    return FIND_VALID.get(normalized) || null;
}

module.exports = { findByCode };
