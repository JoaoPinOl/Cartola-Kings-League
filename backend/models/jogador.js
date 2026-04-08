const {DataTypes} = require('sequelize');
const db =  require('../config/database');
const JogadorService = require('../services/jogadorService');

const Jogador = db.define('jogador', {
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },

    posicao:{
        type: DataTypes.ENUM('Goleiro', 'Zagueiro', 'Lateral', 'Meio-campo', 'Atacante'),
        allowNull: false
    },

    media:{
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },

    preco:{
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
        validate: { min: 0 }
    },

    time:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },

    jogos:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    gols:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    assists:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    amarelos:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    vermelhos:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    tipo:{
        type: DataTypes.ENUM('draft', 'wildcard', 'ativo', 'reserva'),
        allowNull: false,
        defaultValue: 'draft'
    }


});

// Hook para calcular media e preco automaticamente usando o service
Jogador.addHook('beforeSave', (jogador) => {
    JogadorService.aplicarCalculos(jogador);
});

module.exports = Jogador;