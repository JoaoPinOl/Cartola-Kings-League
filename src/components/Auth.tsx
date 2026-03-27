import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, Trophy } from 'lucide-react';

interface AuthProps {
  onLogin: (userData: any, token: string) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, senha } : { nome, email, senha };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao processar requisição');

      onLogin(data.usuario, data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#000_100%)]">
      <div className="w-full max-w-md animate-slide-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl rotate-3 mb-6 shadow-[0_0_30px_rgba(242,125,38,0.3)]">
            <Trophy className="w-8 h-8 text-black -rotate-3" />
          </div>
          <h1 className="text-5xl font-display uppercase tracking-tighter mb-2">Cartola Kings</h1>
          <p className="text-muted font-mono text-[10px] uppercase tracking-[0.3em]">The Ultimate Fantasy League</p>
        </div>

        <div className="card border-white/5 backdrop-blur-xl bg-white/[0.02]">
          <h2 className="text-2xl font-display uppercase tracking-tight mb-8 text-center">
            {isLogin ? 'Acessar Conta' : 'Criar Conta'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-muted uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    placeholder="EX: NEYMAR JR"
                    className="input-field pl-12"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-muted uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  placeholder="PLAYER@KINGS.COM"
                  className="input-field pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-muted uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-12"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[10px] uppercase">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-sm mt-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'ENTRAR NO JOGO' : 'COMEÇAR CARREIRA'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-mono text-muted uppercase tracking-widest hover:text-accent transition-colors"
            >
              {isLogin ? 'Não tem conta? Registre-se agora' : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[9px] font-mono text-muted/30 uppercase tracking-[0.2em]">
          © 2026 Cartola Kings League • All Rights Reserved
        </p>
      </div>
    </div>
  );
}
