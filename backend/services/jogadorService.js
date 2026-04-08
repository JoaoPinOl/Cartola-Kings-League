class JogadorService {
    // Calcula a média baseada em estatísticas
    static calcularMedia(jogador) {
        if (jogador.jogos > 0) {
            const pontosBrutos = (jogador.gols * 5) + (jogador.assists * 3) - (jogador.amarelos * 1) - (jogador.vermelhos * 3);
            return pontosBrutos / jogador.jogos;
        }
        return 0.0;
    }

    // Calcula o preço baseado na média e posição
    static calcularPreco(media, posicao) {
        let bonusPosicao = 0;
        switch (posicao) {
            case 'Goleiro': bonusPosicao = 50000; break;
            case 'Zagueiro': bonusPosicao = 40000; break;
            case 'Lateral': bonusPosicao = 45000; break;
            case 'Meio-campo': bonusPosicao = 60000; break;
            case 'Atacante': bonusPosicao = 70000; break;
        }
        return (media * 10000) + bonusPosicao;
    }

    // Aplica os cálculos ao jogador
    static aplicarCalculos(jogador) {
        jogador.media = this.calcularMedia(jogador);
        jogador.preco = this.calcularPreco(jogador.media, jogador.posicao);
    }
}

module.exports = JogadorService;