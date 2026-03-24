const express = require('express');
const db = require('../config/database');
const Jogador = require('../models/jogador');

const app = express();
app.use(express.json());

db.sync({force : false}).then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    app.listen(3000, () =>{
        console.log('Servidor do Cartola rodando na porta 3000');
    })
})
.catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
});   