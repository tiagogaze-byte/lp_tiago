import Link from 'next/link';
import { supabaseServidor } from '@/lib/supabase/server';
import type { ArtigoComEditoria, Editoria } from '@/lib/tipos';
import { formatarData } from '@/lib/util';

type Props = { searchParams: { status?: string; editoria?: string; q?: string; excluido?: string } };

const ROTULO_STATUS = { publicado: 'Publicado', agendado: 'Agendado', rascunho: 'Rascunho' } as const;

export default async function PainelArtigos({ searchParams }: Props) {
  const supabase = supabaseServidor();

  let consulta = supabase
    .from('artigos')
    .select('id, titulo, slug, status, publicado_em, atualizado_em, editoria:editorias(id, nome, slug)')
    .order('atualizado_em', { ascending: false })
    .limit(500);
  if (searchParams.status) consulta = consulta.eq('status', searchParams.status);
  if (searchParams.editoria) consulta = consulta.eq('editoria_id', searchParams.editoria);
  if (searchParams.q) consulta = consulta.ilike('titulo', `%${searchParams.q}%`);

  const [{ data: artigos }, { data: editorias }, { data: todos }] = await Promise.all([
    consulta,
    supabase.from('editorias').select('*').order('ordem'),
    supabase.from('artigos').select('status'),
  ]);

  const lista = (artigos || []) as unknown as ArtigoComEditoria[];
  const contagem = (s: string) => (todos || []).filter((a) => a.status === s).length;

  return (
    <>
      <div className="admin-titulo">
        <h1>Artigos</h1>
        <Link href="/admin/artigos/novo" className="botao botao-primario botao-pequeno">
          + Novo artigo
        </Link>
      </div>

      {searchParams.excluido && <p className="aviso aviso-ok" style={{ marginBottom: 20 }}>Artigo excluído.</p>}

      <div className="mini-cartoes">
        <div>
          <strong>{contagem('publicado')}</strong>
          <span>publicados</span>
        </div>
        <div>
          <strong>{contagem('agendado')}</strong>
          <span>agendados</span>
        </div>
        <div>
          <strong>{contagem('rascunho')}</strong>
          <span>rascunhos</span>
        </div>
      </div>

      <form className="linha-acoes" style={{ marginBottom: 20 }}>
        <input type="text" name="q" placeholder="Buscar pelo título" defaultValue={searchParams.q} style={{ maxWidth: 280 }} />
        <select name="status" defaultValue={searchParams.status || ''} style={{ maxWidth: 180 }}>
          <option value="">Todos os status</option>
          <option value="publicado">Publicados</option>
          <option value="agendado">Agendados</option>
          <option value="rascunho">Rascunhos</option>
        </select>
        <select name="editoria" defaultValue={searchParams.editoria || ''} style={{ maxWidth: 240 }}>
          <option value="">Todas as editorias</option>
          {((editorias || []) as Editoria[]).map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>
        <button className="botao botao-secundario botao-pequeno" type="submit">
          Filtrar
        </button>
      </form>

      {lista.length === 0 ? (
        <div className="vazio">
          <p>Nenhum artigo por aqui ainda.</p>
          <Link href="/admin/artigos/novo" className="botao botao-primario botao-pequeno" style={{ marginTop: 16 }}>
            Escrever o primeiro artigo
          </Link>
        </div>
      ) : (
        <div className="envolve-tabela">
          <table className="tabela-admin">
            <thead>
              <tr>
                <th>Título</th>
                <th>Editoria</th>
                <th>Status</th>
                <th>Publicação</th>
                <th>Editado</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link href={`/admin/artigos/${a.id}`} className="titulo-link">
                      {a.titulo}
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--texto-fraco)' }}>/blog/{a.slug}</div>
                  </td>
                  <td style={{ color: 'var(--texto-suave)' }}>{a.editoria?.nome || '—'}</td>
                  <td>
                    <span className={`status status-${a.status}`}>{ROTULO_STATUS[a.status]}</span>
                  </td>
                  <td style={{ color: 'var(--texto-suave)', whiteSpace: 'nowrap' }}>{formatarData(a.publicado_em) || '—'}</td>
                  <td style={{ color: 'var(--texto-fraco)', whiteSpace: 'nowrap' }}>{formatarData(a.atualizado_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
