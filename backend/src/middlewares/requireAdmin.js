const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bulbe-energia-secret-dev';

// Protege rotas de escrita: exige um JWT valido (POST /auth/login) com role admin.
// 401 quando falta/expira o token; 403 quando o usuario nao e administrador.
function requireAdmin(req, res, next) {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Token nao fornecido' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: 'Token invalido ou expirado' });
    }

    if (!decoded || decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso restrito a administradores' });
    }

    req.usuario = decoded;
    return next();
}

module.exports = requireAdmin;
