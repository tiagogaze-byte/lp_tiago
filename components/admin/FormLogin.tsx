'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { entrar, type Resultado } from '@/app/admin/acoes';

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button className="botao botao-primario" type="submit" disabled={pending}>
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  );
}

export function FormLogin() {
  const [estado, acao] = useFormState<Resultado | null, FormData>(entrar, null);
  return (
    <form action={acao} className="painel">
      <div className="campo">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="campo">
        <label htmlFor="senha">Senha</label>
        <input id="senha" name="senha" type="password" required autoComplete="current-password" />
      </div>
      {estado && !estado.ok && <p className="aviso aviso-erro">{estado.mensagem}</p>}
      <Botao />
    </form>
  );
}
