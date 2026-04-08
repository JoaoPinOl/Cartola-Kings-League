const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Time = db.define('time', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    externalId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sigla: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: true
    },
    staffCompleto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    presidentes: {
        type: DataTypes.JSON,
        allowNull: true
    },
    jogadores: {
        type: DataTypes.JSON,
        allowNull: true
    }
});

module.exports = Time;
