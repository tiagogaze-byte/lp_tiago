'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { configurarPortal, type Resultado } from '@/app/admin/acoes';

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button className="botao botao-primario" type="submit" disabled={pending}>
      {pending ? 'Preparando o banco...' : 'Criar acesso e configurar'}
    </button>
  );
}

export function FormConfigurar() {
  const [estado, acao] = useFormState<Resultado | null, FormData>(configurarPortal, null);
  return (
    <form action={acao} className="painel">
      <div className="campo">
        <label htmlFor="nome">Seu nome</label>
        <input id="nome" name="nome" type="text" required defaultValue="Tiago Azevedo" autoComplete="name" />
      </div>
      <div className="campo">
        <label htmlFor="email">E-mail de acesso</label>
        <input id="email" name="email" type="email" required defaultValue="tiago.gaze@gmail.com" autoComplete="email" />
      </div>
      <div className="campo">
        <label htmlFor="senha">
          Senha <small>mínimo de 10 caracteres</small>
        </label>
        <input id="senha" name="senha" type="password" required minLength={10} autoComplete="new-password" />
      </div>
      <div className="campo">
        <label htmlFor="confirmacao">Repita a senha</label>
        <input id="confirmacao" name="confirmacao" type="password" required minLength={10} autoComplete="new-password" />
      </div>
      {estado && !estado.ok && <p className="aviso aviso-erro">{estado.mensagem}</p>}
      <Botao />
    </form>
  );
}
