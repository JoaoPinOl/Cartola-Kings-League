// Responsabilidade: Modelar a relação entre escalação e jogadores com metadados
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const EscalacaoJogador = db.define('EscalacaoJogador', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ehCapitao: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    pontuacao: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    escalacaoId: {
        type: DataTypes.INTEGER,
        references: { model: 'Escalacaos', key: 'id' }
    },
    jogadorId: {
        type: DataTypes.INTEGER,
        references: { model: 'Jogadors', key: 'id' }
    }
});

module.exports = EscalacaoJogador;