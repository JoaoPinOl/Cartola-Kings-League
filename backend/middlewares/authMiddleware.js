// Responsabilidade: Validar o Token JWT e injetar o usuário na requisição
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'cartola_secret_key_123';

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: true, message: 'Token não fornecido', statusCode: 401 });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario) throw new Error();
        req.usuario = usuario;
        return next();
    } catch (err) {
        return res.status(401).json({ error: true, message: 'Token inválido', statusCode: 401 });
    }
};