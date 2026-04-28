const Jogador = require('../models/jogador');

exports.listarTodos = async (req, rep) =>{
    try{
        const jogadores = await Jogador.findAll();
        rep.json(jogadores);
    }catch (error){
        rep.status(500).json({ error: "Erro ao Buscar jogadores"});
    }
};

exports.criar = async (req, rep) => {
    try{
        const novoJogador = await Jogador.create(req.body);
        rep.status(201).json(novoJogador);
    }catch (error){
        rep.status(500).json({ error: "Erro ao Criar jogador. Verifique os dados enviados."});
    }
};
