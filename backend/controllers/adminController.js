const { Usuario, Jogador, Escalacao } = require('../models');
const bcrypt = require('bcryptjs');

exports.getUsuarios = async (req, res) => {
    const usuarios = await Usuario.findAll({
        attributes: ['id', 'nome', 'email', 'saldo', 'pontuacaoTotal', 'role']
    });
    res.json(usuarios);
};

exports.createUsuario = async (req, res) => {
    const { nome, email, senha, role, saldo } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({
        nome,
        email,
        senha: hashedSenha,
        role: role || 'user',
        saldo: saldo || 100.0
    });
    res.json(usuario);
};

exports.updateUsuario = async (req, res) => {
    const { nome, email, role, saldo, pontuacaoTotal } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    await usuario.update({ nome, email, role, saldo, pontuacaoTotal });
    res.json(usuario);
};

exports.deleteUsuario = async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    
    if (usuario.id === req.usuario.id) {
        return res.status(400).json({ error: 'Você não pode deletar sua própria conta.' });
    }

    await usuario.destroy();
    res.json({ message: 'Usuário deletado com sucesso' });
};

exports.createJogador = async (req, res) => {
    const jogador = await Jogador.create(req.body);
    res.json(jogador);
};

exports.simulateRound = async (req, res) => {
    console.log('Iniciando simulação de rodada...');
    const jogadores = await Jogador.findAll();
    
    // 1. Atualizar scouts
    for (const jogador of jogadores) {
        const jogou = Math.random() < 0.8;
        if (jogou) {
            const novosGols = Math.floor(Math.random() * 3);
            const novasAssists = Math.floor(Math.random() * 4);
            const novosAmarelos = Math.random() < 0.1 ? 1 : 0;
            const novosVermelhos = Math.random() < 0.02 ? 1 : 0;

            await jogador.update({
                jogos: jogador.jogos + 1,
                gols: jogador.gols + novosGols,
                assists: jogador.assists + novasAssists,
                amarelos: jogador.amarelos + novosAmarelos,
                vermelhos: jogador.vermelhos + novosVermelhos
            });
        }
    }

    // 2. Atualizar pontuação dos usuários
    const usuarios = await Usuario.findAll();
    for (const usuario of usuarios) {
        const escalacao = await Escalacao.findAll({
            where: { usuarioId: usuario.id },
            include: [Jogador]
        });
        
        let roundPoints = 0;
        escalacao.forEach(item => {
            roundPoints += item.jogador.media;
        });

        await usuario.update({ 
            pontuacaoTotal: usuario.pontuacaoTotal + roundPoints 
        });
    }

    res.json({ message: 'Rodada simulada com sucesso!' });
};