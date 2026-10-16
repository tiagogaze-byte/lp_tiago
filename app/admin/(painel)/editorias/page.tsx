import { FormEditoria } from '@/components/admin/FormEditoria';
import { supabaseServidor } from '@/lib/supabase/server';
import type { Editoria } from '@/lib/tipos';
import { excluirEditoria } from '../../acoes';

type Props = { searchParams: { erro?: string; excluida?: string } };

export default async function Editorias({ searchParams }: Props) {
  const supabase = supabaseServidor();
  const [{ data }, { data: artigos }] = await Promise.all([
    supabase.from('editorias').select('*').order('ordem'),
    supabase.from('artigos').select('editoria_id'),
  ]);
  const editorias = (data || []) as Editoria[];
  const total = (id: string) => (artigos || []).filter((a) => a.editoria_id === id).length;

  return (
    <>
      <div className="admin-titulo">
        <h1>Editorias</h1>
      </div>
      {searchParams.erro && <p className="aviso aviso-erro" style={{ marginBottom: 20 }}>{searchParams.erro}</p>}
      {searchParams.excluida && <p className="aviso aviso-ok" style={{ marginBottom: 20 }}>Editoria excluída.</p>}

      <div style={{ display: 'grid', gap: 28, maxWidth: 820 }}>
        <section style={{ display: 'grid', gap: 12 }}>
          <h2 style={{ fontSize: '1.2rem' }}>Nova editoria</h2>
          <FormEditoria proximaOrdem={editorias.length + 1} />
        </section>

        <section style={{ display: 'grid', gap: 16 }}>
          <h2 style={{ fontSize: '1.2rem' }}>Editorias existentes</h2>
          <p style={{ color: 'var(--texto-fraco)', fontSize: '0.9rem' }}>
            Desativar esconde a editoria do site sem apagar nada. Excluir só funciona quando ela não tem artigos.
          </p>
          {editorias.map((e) => (
            <div key={e.id} style={{ display: 'grid', gap: 8 }}>
              <div className="linha-acoes" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--texto-fraco)' }}>
                  {total(e.id)} artigo(s) · {e.ativa ? 'ativa' : 'inativa'}
                </span>
                <form action={excluirEditoria}>
                  <input type="hidden" name="id" value={e.id} />
                  <button type="submit" className="botao-texto botao-perigo" disabled={total(e.id) > 0} title={total(e.id) > 0 ? 'Tem artigos vinculados' : 'Excluir editoria'}>
                    Excluir
                  </button>
                </form>
              </div>
              <FormEditoria editoria={e} />
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
