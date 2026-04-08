const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const Jogador = require('../models/jogador');
const Tecnico = require('../models/tecnico');
const Presidente = require('../models/presidente');
const Time = require('../models/time');

const dataDir = path.join(__dirname, '..', 'data');

const normalizePosicao = (posicao) => {
    if (!posicao) return null;
    const value = posicao.toString().trim().toLowerCase();
    if (['goleiro', 'gol', 'gk', 'g'].includes(value)) return 'Goleiro';
    if (['zagueiro', 'zag', 'z'].includes(value)) return 'Zagueiro';
    if (['lateral', 'lat', 'l'].includes(value)) return 'Lateral';
    if (['meio-campo', 'meio campo', 'mei', 'm', 'mc', 'meia'].includes(value)) return 'Meio-campo';
    if (['atacante', 'ata', 'a', 'fw', 'st'].includes(value)) return 'Atacante';
    return posicao;
};

const normalizeType = (tipo) => {
    if (!tipo) return 'draft';
    const value = tipo.toString().trim().toLowerCase();
    if (['wildcard', 'wild', 'wc'].includes(value)) return 'wildcard';
    if (['ativo', 'active'].includes(value)) return 'ativo';
    if (['reserva', 'reserve'].includes(value)) return 'reserva';
    return 'draft';
};

const normalizeJogador = (item) => ({
    nome: item.nome,
    posicao: normalizePosicao(item.posicao),
    time: item.time || item.clube || item.team || null,
    tipo: normalizeType(item.tipo),
    jogos: Number(item.jogos || item.games || 0),
    gols: Number(item.gols || item.goals || 0),
    assists: Number(item.assists || item.assist || 0),
    amarelos: Number(item.amarelos || item.yellowCards || 0),
    vermelhos: Number(item.vermelhos || item.redCards || 0),
    preco: Number(item.preco || item.price || 0),
    media: Number(item.media || item.average || 0)
});

const normalizeTime = (item) => ({
    nome: item.nome || item.name,
    externalId: item.id?.toString() || null,
    link: item.link || item.url || null,
    sigla: item.sigla || null,
    cidade: item.cidade || item.city || null,
    staffCompleto: item.staffCompleto || item.staff || null,
    presidentes: Array.isArray(item.presidentes) ? item.presidentes : item.presidentes ? [item.presidentes] : null,
    jogadores: Array.isArray(item.jogadores) ? item.jogadores : item.jogadores ? [item.jogadores] : null
});

const normalizePresidente = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return { nome: item, time: null };
    return { nome: item.nome, time: item.time || item.club || item.team || null };
};

const normalizeTecnico = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return { nome: item, time: null };
    return { nome: item.nome, time: item.time || item.club || item.team || null };
};

const loadJsonFiles = () => {
    if (!fs.existsSync(dataDir)) return [];
    return fs.readdirSync(dataDir)
        .filter((name) => name.toLowerCase().endsWith('.json'))
        .map((name) => ({
            name,
            data: JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'))
        }));
};

const buildDatasetEntries = (file) => {
    if (Array.isArray(file.data)) return [{ name: file.name, data: file.data }];
    if (!file.data || typeof file.data !== 'object') return [];

    return Object.entries(file.data)
        .filter(([, value]) => Array.isArray(value))
        .map(([key, value]) => ({ name: key, data: value }));
};

const fileExists = (files, name) => files.some((file) => file.name.toLowerCase() === name.toLowerCase());

const shouldSkipDataset = (datasetName, fileName, files) => {
    if (fileName.toLowerCase() !== 'dados-completos.json') return false;

    const normalized = datasetName.toLowerCase();
    if (normalized.includes('jogadores_draft') && fileExists(files, 'jogadores_draft.json')) return true;
    if (normalized.includes('jogadores_wildcard') && fileExists(files, 'jogadores_wildcard.json')) return true;
    if (normalized === 'times' && fileExists(files, 'times.json')) return true;
    if (normalized === 'tecnicos' && fileExists(files, 'tecnicos.json')) return true;
    if (normalized === 'presidentes' && fileExists(files, 'presidentes.json')) return true;

    return false;
};

async function main() {
    await db.sync({ alter: true });

    const files = loadJsonFiles();
    if (!files.length) {
        console.log('Nenhum arquivo JSON encontrado em backend/data/.');
        process.exit(0);
    }

    for (const file of files) {
        const entries = buildDatasetEntries(file);
        if (!entries.length) {
            console.log(`Arquivo ${file.name} não contém dados importáveis e foi ignorado.`);
            continue;
        }

        for (const { name, data } of entries) {
            if (shouldSkipDataset(name, file.name, files)) {
                console.log(`Pulando dataset ${name} em ${file.name} porque há arquivo separado correspondente.`);
                continue;
            }

            if (/jogador|wildcard|draft/i.test(name)) {
                const jogadores = data.map(normalizeJogador).filter((item) => item.nome && item.posicao);
                await Jogador.bulkCreate(jogadores, { validate: true, individualHooks: true });
                console.log(`Importados ${jogadores.length} jogadores do dataset ${name} em ${file.name}.`);
                continue;
            }

            if (/time/i.test(name)) {
                const times = data.map(normalizeTime).filter((item) => item.nome);
                await Time.bulkCreate(times, { validate: true });
                console.log(`Importados ${times.length} times do dataset ${name} em ${file.name}.`);
                continue;
            }

            if (/tecnico/i.test(name)) {
                const tecnicos = data.map(normalizeTecnico).filter((item) => item && item.nome);
                await Tecnico.bulkCreate(tecnicos, { validate: true });
                console.log(`Importados ${tecnicos.length} técnicos do dataset ${name} em ${file.name}.`);
                continue;
            }

            if (/presidente/i.test(name)) {
                const presidentes = data.map(normalizePresidente).filter((item) => item && item.nome);
                await Presidente.bulkCreate(presidentes, { validate: true });
                console.log(`Importados ${presidentes.length} presidentes do dataset ${name} em ${file.name}.`);
                continue;
            }

            console.log(`Dataset ${name} em ${file.name} não corresponde a modelo conhecido e foi ignorado.`);
        }
    }

    console.log('Importação concluída com sucesso.');
    process.exit(0);
}

main().catch((error) => {
    console.error('Erro ao importar dados:', error);
    process.exit(1);
});
