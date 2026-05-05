function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Nao autenticado' });
    }
    req.userId = token;
    next();
}

module.exports = { requireAuth };
