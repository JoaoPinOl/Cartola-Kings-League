// Responsabilidade: Popular o banco de dados a partir dos arquivos JSON na pasta data
const fs = require('fs');
const path = require('path');
const { db, Jogador, Usuario } = require('../models');
const bcrypt = require('bcryptjs');

async function runSeed() {
    try {
        console.log('--- Iniciando Seed do Banco de Dados ---');
        
        // Sincroniza o banco garantindo que as tabelas existam
        await db.sync();

        const dataPath = path.join(__dirname, '..', 'data');

        // 1. Seed de Jogadores
        const jogadoresFile = path.join(dataPath, 'jogadores.json');
        if (fs.existsSync(jogadoresFile)) {
            const jogadores = JSON.parse(fs.readFileSync(jogadoresFile, 'utf-8'));
            console.log(`Carregando ${jogadores.length} jogadores...`);
            
            for (const j of jogadores) {
                await Jogador.findOrCreate({
                    where: { nome: j.nome },
                    defaults: j
                });
            }
            console.log('✅ Jogadores processados.');
        }

        // 2. Seed de Usuários (Exemplo: Admin e Users iniciais)
        const usuariosFile = path.join(dataPath, 'usuarios.json');
        if (fs.existsSync(usuariosFile)) {
            const usuarios = JSON.parse(fs.readFileSync(usuariosFile, 'utf-8'));
            for (const u of usuarios) {
                // Hashear senha se não estiver hasheada
                if (u.senha && !u.senha.startsWith('$2')) {
                    u.senha = await bcrypt.hash(u.senha, 10);
                }
                await Usuario.findOrCreate({
                    where: { email: u.email },
                    defaults: u
                });
            }
            console.log('✅ Usuários processados.');
        }

        console.log('--- Seed Finalizado com Sucesso ---');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro durante o seed:', error);
        process.exit(1);
    }
}

runSeed();