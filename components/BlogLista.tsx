import Link from 'next/link';
import type { ArtigoComEditoria, Editoria } from '@/lib/tipos';
import { Capa, CardArtigo, MetaArtigo } from './Blocos';

export function BlogLista({
  titulo,
  descricao,
  artigos,
  editorias,
  editoriaAtiva,
  destacar = true,
}: {
  titulo: string;
  descricao: string;
  artigos: ArtigoComEditoria[];
  editorias: Editoria[];
  editoriaAtiva?: string;
  destacar?: boolean;
}) {
  const [primeiro, ...resto] = artigos;
  const lista = destacar ? resto : artigos;

  return (
    <>
      <section className="hero-pagina" style={{ paddingBottom: 40 }}>
        <div className="container blog-topo">
          <div className="secao-cabeca" style={{ marginBottom: 0 }}>
            <span className="rotulo">Blog</span>
            <h1>{titulo}</h1>
            <p>{descricao}</p>
          </div>
          <nav className="pilulas" aria-label="Editorias">
            <Link href="/blog" className={`pilula ${!editoriaAtiva ? 'ativa' : ''}`}>
              Todas
            </Link>
            {editorias.map((e) => (
              <Link key={e.id} href={`/blog/editoria/${e.slug}`} className={`pilula ${editoriaAtiva === e.slug ? 'ativa' : ''}`}>
                {e.nome}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="secao" style={{ paddingTop: 16 }}>
        <div className="container">
          {artigos.length === 0 && (
            <div className="vazio">
              <p>Ainda não tem artigo publicado aqui. Os primeiros chegam em breve.</p>
            </div>
          )}

          {destacar && primeiro && (
            <Link href={`/blog/${primeiro.slug}`} className="artigo-destaque">
              <div className="card-artigo" style={{ gap: 0 }}>
                <div className="capa">
                  <Capa artigo={primeiro} prioridade />
                </div>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                <MetaArtigo artigo={primeiro} />
                <h2>{primeiro.titulo}</h2>
                <p style={{ color: 'var(--texto-suave)', fontSize: '1.08rem' }}>{primeiro.resumo}</p>
                <span className="destaque" style={{ fontWeight: 500 }}>
                  Ler artigo →
                </span>
              </div>
            </Link>
          )}

          {lista.length > 0 && (
            <div className="lista-artigos">
              {lista.map((a) => (
                <CardArtigo key={a.id} artigo={a} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
