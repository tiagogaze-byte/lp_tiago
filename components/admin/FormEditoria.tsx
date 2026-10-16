'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { salvarEditoria, type Resultado } from '@/app/admin/acoes';
import type { Editoria } from '@/lib/tipos';

function Enviar({ rotulo }: { rotulo: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="botao botao-primario botao-pequeno" type="submit" disabled={pending}>
      {pending ? 'Salvando...' : rotulo}
    </button>
  );
}

export function FormEditoria({ editoria, proximaOrdem = 0 }: { editoria?: Editoria; proximaOrdem?: number }) {
  const [estado, acao] = useFormState<Resultado | null, FormData>(salvarEditoria, null);
  const sufixo = editoria?.id || 'nova';

  return (
    <form action={acao} className="painel" style={{ gap: 14 }}>
      <input type="hidden" name="id" value={editoria?.id || ''} />
      <div className="grade grade-2" style={{ gap: 14 }}>
        <div className="campo">
          <label htmlFor={`nome-${sufixo}`}>Nome</label>
          <input id={`nome-${sufixo}`} name="nome" type="text" defaultValue={editoria?.nome} required />
        </div>
        <div className="campo">
          <label htmlFor={`slug-${sufixo}`}>
            Slug <small>/blog/editoria/...</small>
          </label>
          <input id={`slug-${sufixo}`} name="slug" type="text" defaultValue={editoria?.slug} placeholder="gerado a partir do nome" />
        </div>
      </div>
      <div className="campo">
        <label htmlFor={`descricao-${sufixo}`}>Descrição</label>
        <input id={`descricao-${sufixo}`} name="descricao" type="text" defaultValue={editoria?.descricao} placeholder="Aparece no topo da página da editoria e no Google" />
      </div>
      <div className="linha-acoes">
        <div className="campo" style={{ width: 110 }}>
          <label htmlFor={`ordem-${sufixo}`}>Ordem</label>
          <input id={`ordem-${sufixo}`} name="ordem" type="number" defaultValue={editoria?.ordem ?? proximaOrdem} />
        </div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', marginTop: 22 }}>
          <input type="checkbox" name="ativa" defaultChecked={editoria ? editoria.ativa : true} />
          Ativa no site
        </label>
        <div style={{ marginTop: 22, marginLeft: 'auto' }}>
          <Enviar rotulo={editoria ? 'Salvar' : 'Criar editoria'} />
        </div>
      </div>
      {estado && <p className={`aviso ${estado.ok ? 'aviso-ok' : 'aviso-erro'}`}>{estado.mensagem}</p>}
    </form>
  );
}
