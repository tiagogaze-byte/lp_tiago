'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseNavegador } from '@/lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    const dados = new FormData(evento.currentTarget);
    const { error } = await supabaseNavegador().auth.signInWithPassword({
      email: String(dados.get('email')),
      password: String(dados.get('senha')),
    });
    setEnviando(false);
    if (error) {
      setErro('E-mail ou senha incorretos. Confira e tente de novo.');
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <div className="container login-caixa">
      <div style={{ display: 'grid', gap: 8 }}>
        <span className="marca">
          Tiago Azevedo<span style={{ color: 'var(--laranja)' }}>.</span>
        </span>
        <h1 style={{ fontSize: '1.8rem' }}>Entrar no painel</h1>
      </div>
      <form onSubmit={entrar} className="painel">
        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input id="senha" name="senha" type="password" required autoComplete="current-password" />
        </div>
        {erro && <p className="aviso aviso-erro">{erro}</p>}
        <button className="botao botao-primario" type="submit" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
