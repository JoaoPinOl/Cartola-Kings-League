const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Tecnico = db.define('tecnico', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Tecnico;