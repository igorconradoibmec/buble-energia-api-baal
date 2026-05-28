const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');

const JWT_SECRET = process.env.JWT_SECRET || 'bulbe-energia-secret-dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

function login(req, res) {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
        return res.status(400).json({ error: 'Informe email e senha' });
    }

    const usuario = userRepository.findByEmail(email);

    if (!usuario || !usuario.senha_hash) {
        return res.status(401).json({ error: 'Credenciais invalidas' });
    }

    if (!bcrypt.compareSync(senha, usuario.senha_hash)) {
        return res.status(401).json({ error: 'Credenciais invalidas' });
    }

    const payload = {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(200).json({
        token,
        expiresIn: JWT_EXPIRES_IN,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.role,
        },
    });
}

module.exports = { login };
