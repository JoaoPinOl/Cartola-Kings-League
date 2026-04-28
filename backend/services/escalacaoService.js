// Responsabilidade: Validar as regras de negócio da Kings League (7 jogadores) e financeira
const { Jogador, Escalacao, EscalacaoJogador } = require('../models');

const validar7Jogadores = (jogadores) => {
    if (jogadores.length !== 7) {
        const err = new Error('Uma escalação na Kings League deve ter exatamente 7 jogadores');
        err.statusCode = 400;
        throw err;
    }
};

const validarSaldo = (usuario, custoTotal) => {
    if (usuario.saldo < custoTotal) {
        const err = new Error('Saldo insuficiente para realizar esta escalação');
        err.statusCode = 400;
        throw err;
    }
};

const salvarEscalacao = async (usuarioId, rodadaId, jogadoresIds, capitaoId) => {
    const jogadores = await Jogador.findAll({ where: { id: jogadoresIds } });
    const custoTotal = jogadores.reduce((acc, j) => acc + parseFloat(j.preco), 0);
    
    // Validações delegadas
    validar7Jogadores(jogadoresIds);

    const escalacao = await Escalacao.create({ usuarioId, rodadaId });
    
    const dataPivot = jogadoresIds.map(id => ({
        escalacaoId: escalacao.id,
        jogadorId: id,
        ehCapitao: id === capitaoId,
        pontuacao: 0
    }));

    await EscalacaoJogador.bulkCreate(dataPivot);
    return escalacao;
};

module.exports = {
    salvarEscalacao
};