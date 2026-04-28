const db = require('../config/database');
const Usuario = require('./usuario');
const Jogador = require('./jogador');
const Escalacao = require('./escalacao');

// Definição de Associações
Usuario.hasMany(Escalacao, { foreignKey: 'usuarioId' });
Escalacao.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Jogador.hasMany(Escalacao, { foreignKey: 'jogadorId' });
Escalacao.belongsTo(Jogador, { foreignKey: 'jogadorId' });

module.exports = {
    db,
    Usuario,
    Jogador,
    Escalacao
};