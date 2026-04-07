const express = require ('express');
const router = express.Router();
const JogadorController = require('../controllers/JogadorController');

router.get('/', JogadorController.listarTodos);
router.post('/', JogadorController.criar);

module.exports = router;