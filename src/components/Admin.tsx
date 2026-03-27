import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Play, Shield, Trash2, Edit2, X, Check, UserCog } from 'lucide-react';

interface Usuario {
    id: number;
    nome: string;
    email: string;
    saldo: number;
    pontuacaoTotal: number;
    role: string;
}

export default function Admin() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [novoJogador, setNovoJogador] = useState({
        nome: '',
        posicao: 'ATA',
        time: '',
        preco: 0
    });
    const [novoUsuario, setNovoUsuario] = useState({
        nome: '',
        email: '',
        senha: '',
        role: 'user',
        saldo: 100
    });
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const token = localStorage.getItem('cartola_token');
            const res = await fetch('/api/admin/usuarios', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsuarios(data);
            }
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    const handleAddJogador = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('cartola_token');
            const res = await fetch('/api/jogadores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novoJogador)
            });
            if (res.ok) {
                setMessage('Jogador adicionado com sucesso!');
                setNovoJogador({ nome: '', posicao: 'ATA', time: '', preco: 0 });
            } else {
                const data = await res.json();
                setMessage('Erro: ' + (data.error || 'Erro ao adicionar jogador.'));
            }
        } catch (error) {
            setMessage('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('cartola_token');
            const res = await fetch('/api/admin/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novoUsuario)
            });
            if (res.ok) {
                setMessage('Usuário criado com sucesso!');
                setNovoUsuario({ nome: '', email: '', senha: '', role: 'user', saldo: 100 });
                fetchUsuarios();
            } else {
                const data = await res.json();
                setMessage('Erro: ' + (data.error || 'Erro ao criar usuário.'));
            }
        } catch (error) {
            setMessage('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('cartola_token');
            const res = await fetch(`/api/admin/usuarios/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editingUser)
            });
            if (res.ok) {
                setMessage('Usuário atualizado com sucesso!');
                setEditingUser(null);
                fetchUsuarios();
            } else {
                const data = await res.json();
                setMessage('Erro: ' + (data.error || 'Erro ao atualizar usuário.'));
            }
        } catch (error) {
            setMessage('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUsuario = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar este usuário?')) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('cartola_token');
            const res = await fetch(`/api/admin/usuarios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMessage('Usuário deletado com sucesso!');
                fetchUsuarios();
            } else {
                const data = await res.json();
                setMessage('Erro: ' + (data.error || 'Erro ao deletar usuário.'));
            }
        } catch (error) {
            setMessage('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleSimulateRound = async () => {
        if (!confirm('Tem certeza que deseja simular a rodada? Isso atualizará as pontuações de todos os usuários.')) return;
        
        setLoading(true);
        try {
            const token = localStorage.getItem('cartola_token');
            const res = await fetch('/api/simulate-round', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMessage('Rodada simulada com sucesso!');
                fetchUsuarios();
            } else {
                setMessage('Erro ao simular rodada.');
            }
        } catch (error) {
            setMessage('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-slide-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-4xl font-display uppercase tracking-tighter flex items-center gap-3">
                    <Shield className="text-accent w-10 h-10" />
                    Painel Administrativo
                </h1>
                <button 
                    onClick={handleSimulateRound}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700 w-full md:w-auto"
                >
                    <Play className="w-5 h-5" />
                    Simular Rodada
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg border ${message.includes('Erro') ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'} font-mono text-xs uppercase tracking-wider`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cadastro de Jogadores */}
                <div className="card bg-surface/30 backdrop-blur-md border-white/5">
                    <h2 className="text-2xl font-display uppercase mb-6 flex items-center gap-2">
                        <UserPlus className="text-accent" />
                        Cadastrar Novo Jogador
                    </h2>
                    <form onSubmit={handleAddJogador} className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase font-mono text-muted mb-1 tracking-widest">Nome do Jogador</label>
                            <input 
                                type="text"
                                value={novoJogador.nome}
                                onChange={(e) => setNovoJogador({...novoJogador, nome: e.target.value})}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase font-mono text-muted mb-1 tracking-widest">Posição</label>
                                <select 
                                    value={novoJogador.posicao}
                                    onChange={(e) => setNovoJogador({...novoJogador, posicao: e.target.value})}
                                    className="input-field bg-black"
                                >
                                    <option value="GOL">Goleiro (GOL)</option>
                                    <option value="ZAG">Zagueiro (ZAG)</option>
                                    <option value="LAT">Lateral (LAT)</option>
                                    <option value="MEI">Meia (MEI)</option>
                                    <option value="ATA">Atacante (ATA)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-mono text-muted mb-1 tracking-widest">Preço (C$)</label>
                                <input 
                                    type="number"
                                    value={novoJogador.preco}
                                    onChange={(e) => setNovoJogador({...novoJogador, preco: parseFloat(e.target.value)})}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase font-mono text-muted mb-1 tracking-widest">Time</label>
                            <input 
                                type="text"
                                value={novoJogador.time}
                                onChange={(e) => setNovoJogador({...novoJogador, time: e.target.value})}
                                className="input-field"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-4">
                            {loading ? 'Processando...' : 'Cadastrar Jogador'}
                        </button>
                    </form>
                </div>

                {/* Cadastro de Usuários */}
                <div className="card bg-surface/30 backdrop-blur-md border-white/5">
                    <h2 className="text-2xl font-display uppercase mb-6 flex items-center gap-2">
                        <UserCog className="text-accent" />
                        Cadastrar Novo Usuário
                    </h2>
                    <form onSubmit={handleAddUsuario} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase font-mono text-muted mb-1 tracking-widest">Nome</label>
                                <input 
                                    type="text"
                                    value={novoUsuario.nome}
                                    onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-mono text-muted mb-1 tracking-widest">Email</label>
                                <input 
                                    type="email"
                                    value={novoUsuario.email}
                                    onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase font-mono text-muted mb-1 tracking-widest">Senha</label>
                                <input 
                                    type="password"
                                    value={novoUsuario.senha}
                                    onChange={(e) => setNovoUsuario({...novoUsuario, senha: e.target.value})}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-mono text-muted mb-1 tracking-widest">Papel (Role)</label>
                                <select 
                                    value={novoUsuario.role}
                                    onChange={(e) => setNovoUsuario({...novoUsuario, role: e.target.value})}
                                    className="input-field bg-black"
                                >
                                    <option value="user">Jogador Normal</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase font-mono text-muted mb-1 tracking-widest">Saldo Inicial (C$)</label>
                            <input 
                                type="number"
                                value={novoUsuario.saldo}
                                onChange={(e) => setNovoUsuario({...novoUsuario, saldo: parseFloat(e.target.value)})}
                                className="input-field"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-4">
                            {loading ? 'Processando...' : 'Criar Usuário'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Lista de Usuários */}
            <div className="card bg-surface/30 backdrop-blur-md border-white/5">
                <h2 className="text-2xl font-display uppercase mb-6 flex items-center gap-2">
                    <Users className="text-accent" />
                    Gerenciar Usuários
                </h2>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-4 text-[10px] uppercase font-mono text-muted tracking-widest">Nome / Email</th>
                                <th className="pb-4 text-[10px] uppercase font-mono text-muted tracking-widest">Pontos</th>
                                <th className="pb-4 text-[10px] uppercase font-mono text-muted tracking-widest">Saldo</th>
                                <th className="pb-4 text-[10px] uppercase font-mono text-muted tracking-widest">Role</th>
                                <th className="pb-4 text-[10px] uppercase font-mono text-muted tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {usuarios.map(user => (
                                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4">
                                        {editingUser?.id === user.id ? (
                                            <div className="space-y-2">
                                                <input 
                                                    className="input-field py-1 text-xs" 
                                                    value={editingUser.nome} 
                                                    onChange={e => setEditingUser({...editingUser, nome: e.target.value})}
                                                />
                                                <input 
                                                    className="input-field py-1 text-xs" 
                                                    value={editingUser.email} 
                                                    onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="font-display uppercase text-sm">{user.nome}</div>
                                                <div className="text-[10px] font-mono text-muted">{user.email}</div>
                                            </>
                                        )}
                                    </td>
                                    <td className="py-4">
                                        {editingUser?.id === user.id ? (
                                            <input 
                                                type="number"
                                                className="input-field py-1 text-xs w-20" 
                                                value={editingUser.pontuacaoTotal} 
                                                onChange={e => setEditingUser({...editingUser, pontuacaoTotal: parseFloat(e.target.value)})}
                                            />
                                        ) : (
                                            <span className="font-mono text-accent">{user.pontuacaoTotal.toFixed(1)}</span>
                                        )}
                                    </td>
                                    <td className="py-4">
                                        {editingUser?.id === user.id ? (
                                            <input 
                                                type="number"
                                                className="input-field py-1 text-xs w-24" 
                                                value={editingUser.saldo} 
                                                onChange={e => setEditingUser({...editingUser, saldo: parseFloat(e.target.value)})}
                                            />
                                        ) : (
                                            <span className="font-mono">C$ {user.saldo.toFixed(2)}</span>
                                        )}
                                    </td>
                                    <td className="py-4">
                                        {editingUser?.id === user.id ? (
                                            <select 
                                                className="input-field py-1 text-xs bg-black" 
                                                value={editingUser.role} 
                                                onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-tighter ${user.role === 'admin' ? 'bg-accent text-black shadow-[0_0_10px_rgba(242,125,38,0.3)]' : 'bg-white/10 text-muted'}`}>
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {editingUser?.id === user.id ? (
                                                <>
                                                    <button onClick={handleUpdateUsuario} className="p-2 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition-colors">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setEditingUser(null)} className="p-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => setEditingUser(user)} className="p-2 text-muted hover:text-accent hover:bg-white/5 rounded transition-all">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteUsuario(user.id)} className="p-2 text-muted hover:text-red-500 hover:bg-red-500/5 rounded transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
