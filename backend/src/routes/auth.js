const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * POST /auth/login
 *
 * Rota publica responsavel por autenticar um usuario com email e senha.
 * Em caso de sucesso, devolve um JWT que deve ser enviado no header
 * Authorization (formato `Bearer <token>`) nas proximas requisicoes.
 *
 * @name POST/auth/login
 * @function
 * @public
 *
 * @param {import('express').Request} req - Requisicao HTTP do Express.
 * @param {string} req.body.email - Email do usuario cadastrado na tabela `users`.
 * @param {string} req.body.senha - Senha do usuario (validada contra `senha_hash` via bcrypt).
 * @param {import('express').Response} res - Resposta HTTP do Express.
 *
 * @returns {{ token: string, expiresIn: string, usuario: { id: string, nome: string, email: string, role: string } }}
 *   Objeto contendo o JWT assinado, o tempo de expiracao e os dados publicos do usuario.
 *
 * @example
 * // Requisicao
 * // POST /auth/login
 * // { "email": "admin@bulbe.com", "senha": "admin123" }
 *
 * @throws {400} Quando email ou senha nao sao informados no corpo da requisicao.
 * @throws {401} Quando as credenciais nao batem com nenhum usuario cadastrado.
 */
router.post('/login', authController.login);

module.exports = router;
