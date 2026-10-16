import Link from 'next/link';
import { artigosDoCliente, contarPorStatus, editoriasDoCliente } from '@/lib/admin';
import { exigirSessao } from '@/lib/auth';
import { formatarData } from '@/lib/util';

type Props = { searchParams: { status?: string; editoria?: string; q?: string; excluido?: string; bemvindo?: string } };

const ROTULO_STATUS = { publicado: 'Publicado', agendado: 'Agendado', rascunho: 'Rascunho' } as const;

export default async function PainelArtigos({ searchParams }: Props) {
  const { clienteId } = await exigirSessao();
  const [lista, editorias, contagem] = await Promise.all([
    artigosDoCliente(clienteId, searchParams),
    editoriasDoCliente(clienteId),
    contarPorStatus(clienteId),
  ]);

  return (
    <>
      <div className="admin-titulo">
        <h1>Artigos</h1>
        <Link href="/admin/artigos/novo" className="botao botao-primario botao-pequeno">
          + Novo artigo
        </Link>
      </div>

      {searchParams.bemvindo && (
        <p className="aviso aviso-ok" style={{ marginBottom: 20 }}>
          Painel configurado. Os artigos e editorias do site já estão aqui. Clique num artigo para editar.
        </p>
      )}
      {searchParams.excluido && <p className="aviso aviso-ok" style={{ marginBottom: 20 }}>Artigo excluído.</p>}

      <div className="mini-cartoes">
        <div>
          <strong>{contagem.publicado}</strong>
          <span>publicados</span>
        </div>
        <div>
          <strong>{contagem.agendado}</strong>
          <span>agendados</span>
        </div>
        <div>
          <strong>{contagem.rascunho}</strong>
          <span>rascunhos</span>
        </div>
      </div>

      <form className="linha-acoes" style={{ marginBottom: 20 }}>
        <input type="text" name="q" placeholder="Buscar pelo título" defaultValue={searchParams.q} style={{ maxWidth: 280 }} aria-label="Buscar pelo título" />
        <select name="status" defaultValue={searchParams.status || ''} style={{ maxWidth: 180 }} aria-label="Status">
          <option value="">Todos os status</option>
          <option value="publicado">Publicados</option>
          <option value="agendado">Agendados</option>
          <option value="rascunho">Rascunhos</option>
        </select>
        <select name="editoria" defaultValue={searchParams.editoria || ''} style={{ maxWidth: 240 }} aria-label="Editoria">
          <option value="">Todas as editorias</option>
          {editorias.map((e) => (
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
          <p>Nenhum artigo encontrado.</p>
          <Link href="/admin/artigos/novo" className="botao botao-primario botao-pequeno" style={{ marginTop: 16 }}>
            Escrever um artigo
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
                  <td style={{ color: 'var(--texto-suave)' }}>{a.editoria_nome || '—'}</td>
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
