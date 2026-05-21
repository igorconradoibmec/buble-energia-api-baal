const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bulbe-energia-secret-dev';

function autenticar(req, res, next) {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Token nao fornecido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalido ou expirado' });
    }
}

module.exports = autenticar;
