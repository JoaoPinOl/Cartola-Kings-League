const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Presidente = db.define('presidente', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Presidente;