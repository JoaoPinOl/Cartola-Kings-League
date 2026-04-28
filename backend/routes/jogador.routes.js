// Responsabilidade: Definir rotas de jogadores com validação e proteção
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { Jogador } = require('../models');
const { query, validationResult } = require('express-validator');

router.get('/', 
    authMiddleware,
    query('posicao').optional().isIn(['GOL', 'ZAG', 'LAT', 'MEI', 'ATA']),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const filters = req.query.posicao ? { where: { posicao: req.query.posicao } } : {};
            const jogadores = await Jogador.findAll(filters);
            res.json(jogadores);
        } catch (e) { next(e); }
    }
);

module.exports = router;