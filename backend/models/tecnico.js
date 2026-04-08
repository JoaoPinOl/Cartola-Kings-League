const {dataTypes} = require('sequelize');
const db = require('../config/database');

const Tecnico = db.define('tecnico', {
    nome:{
        type: dataTypes.STRING,
        allowNull: false
    },
    time:{
        type: dataTypes.STRING,
        allowNull: false
    }
});

module.exports = Tecnico;