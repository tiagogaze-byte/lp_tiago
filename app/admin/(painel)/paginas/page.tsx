import Link from 'next/link';
import { paginasDoCliente } from '@/lib/admin';
import { exigirSessao } from '@/lib/auth';
import { formatarData } from '@/lib/util';
import { criarPagina } from '../../acoes';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { excluida?: string; bemvindo?: string } };

export default async function Paginas({ searchParams }: Props) {
  const { clienteId } = await exigirSessao();
  const paginas = await paginasDoCliente(clienteId);

  return (
    <>
      <div className="admin-titulo">
        <h1>Páginas</h1>
      </div>
      {searchParams.bemvindo && (
        <p className="aviso aviso-ok" style={{ marginBottom: 20 }}>
          Seu site está no ar com três páginas de exemplo. Abra cada uma e troque os textos pelos seus.
        </p>
      )}
      {searchParams.excluida && <p className="aviso aviso-ok" style={{ marginBottom: 20 }}>Página excluída.</p>}

      <div style={{ display: 'grid', gap: 24, maxWidth: 860 }}>
        <div className="envolve-tabela">
          <table className="tabela-admin">
            <thead>
              <tr>
                <th>Página</th>
                <th>Endereço</th>
                <th>Menu</th>
                <th>Situação</th>
                <th>Atualizada</th>
              </tr>
            </thead>
            <tbody>
              {paginas.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/paginas/${p.id}`} className="titulo-link">
                      {p.titulo}
                    </Link>
                    <div style={{ color: 'var(--texto-fraco)', fontSize: '0.82rem' }}>{p.blocos.length} bloco(s)</div>
                  </td>
                  <td>
                    <code>{p.slug === 'inicio' ? '/' : `/${p.slug}`}</code>
                  </td>
                  <td>{p.no_menu ? `Sim (${p.ordem})` : 'Não'}</td>
                  <td>
                    <span className={`status status-${p.publicada ? "publicado" : "rascunho"}`}>{p.publicada ? 'No ar' : 'Rascunho'}</span>
                  </td>
                  <td>{formatarData(p.atualizado_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form action={criarPagina} className="painel linha-acoes" style={{ justifyContent: 'flex-start', alignItems: 'flex-end' }}>
          <div className="campo" style={{ flex: 1, minWidth: 220 }}>
            <label htmlFor="titulo">Nova página</label>
            <input id="titulo" name="titulo" type="text" placeholder="Ex.: Serviços, Agenda, Depoimentos" required />
          </div>
          <button className="botao botao-primario botao-pequeno" type="submit">
            Criar página
          </button>
        </form>
      </div>
    </>
  );
}
