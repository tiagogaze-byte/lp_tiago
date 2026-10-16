import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Capa, CardArtigo, CtaFinal, JsonLd, MetaArtigo } from '@/components/Blocos';
import { SITE } from '@/content/site';
import { buscarArtigo, buscarRelacionados } from '@/lib/blog';
import { renderizarMarkdown } from '@/lib/markdown';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artigo = await buscarArtigo(params.slug);
  if (!artigo) return {};
  return {
    title: artigo.titulo,
    description: artigo.resumo,
    keywords: [artigo.palavra_chave, ...artigo.palavras_secundarias, ...artigo.tags].filter(Boolean),
    alternates: { canonical: `/blog/${artigo.slug}` },
    openGraph: {
      type: 'article',
      title: artigo.titulo,
      description: artigo.resumo,
      publishedTime: artigo.publicado_em || undefined,
      modifiedTime: artigo.atualizado_em,
      authors: [SITE.nome],
      section: artigo.editoria?.nome,
      tags: artigo.tags,
      images: artigo.capa_url ? [{ url: artigo.capa_url, alt: artigo.capa_alt }] : undefined,
    },
  };
}

export default async function ArtigoPagina({ params }: Props) {
  const artigo = await buscarArtigo(params.slug);
  if (!artigo) notFound();

  const { html, titulos } = renderizarMarkdown(artigo.corpo);
  const relacionados = await buscarRelacionados(artigo);
  const url = `${SITE.url}/blog/${artigo.slug}`;

  const dados: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: artigo.titulo,
      description: artigo.resumo,
      url,
      mainEntityOfPage: url,
      datePublished: artigo.publicado_em,
      dateModified: artigo.atualizado_em,
      inLanguage: 'pt-BR',
      articleSection: artigo.editoria?.nome,
      keywords: [artigo.palavra_chave, ...artigo.tags].filter(Boolean).join(', '),
      image: artigo.capa_url || undefined,
      author: { '@type': 'Person', '@id': `${SITE.url}/#tiago`, name: SITE.nome, url: SITE.url },
      publisher: { '@type': 'Person', '@id': `${SITE.url}/#tiago`, name: SITE.nome },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Blog', item: `${SITE.url}/blog` },
        ...(artigo.editoria
          ? [{ '@type': 'ListItem', position: 2, name: artigo.editoria.nome, item: `${SITE.url}/blog/editoria/${artigo.editoria.slug}` }]
          : []),
        { '@type': 'ListItem', position: artigo.editoria ? 3 : 2, name: artigo.titulo, item: url },
      ],
    },
  ];
  if (artigo.faq.length > 0) {
    dados.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: artigo.faq.map((f) => ({ '@type': 'Question', name: f.pergunta, acceptedAnswer: { '@type': 'Answer', text: f.resposta } })),
    });
  }

  return (
    <>
      {dados.map((d, i) => (
        <JsonLd key={i} dados={d} />
      ))}
      <article>
        <header className="container">
          <div className="artigo-cabeca">
            <nav className="meta" aria-label="Caminho">
              <Link href="/blog">Blog</Link>
              {artigo.editoria && (
                <>
                  <span>/</span>
                  <Link href={`/blog/editoria/${artigo.editoria.slug}`}>{artigo.editoria.nome}</Link>
                </>
              )}
            </nav>
            <h1>{artigo.titulo}</h1>
            <p className="resumo">{artigo.resumo}</p>
            <MetaArtigo artigo={artigo} />
          </div>
        </header>

        <div className="container">
          <div className="artigo-capa">
            <Capa artigo={artigo} prioridade />
          </div>

          <div className="artigo-corpo-wrap">
            <div>
              <div className="prosa" dangerouslySetInnerHTML={{ __html: html }} />

              {artigo.faq.length > 0 && (
                <section className="faq" aria-labelledby="perguntas-frequentes">
                  <h2 id="perguntas-frequentes">Perguntas frequentes</h2>
                  {artigo.faq.map((f, i) => (
                    <details key={i} open={i === 0}>
                      <summary>{f.pergunta}</summary>
                      <p>{f.resposta}</p>
                    </details>
                  ))}
                </section>
              )}

              {artigo.tags.length > 0 && (
                <div className="pilulas" style={{ marginTop: 40 }}>
                  {artigo.tags.map((t) => (
                    <Link key={t} href={`/blog/tag/${encodeURIComponent(t)}`} className="pilula">
                      #{t}
                    </Link>
                  ))}
                </div>
              )}

              <div className="autor">
                <div className="avatar">TA</div>
                <div>
                  <strong>Tiago Azevedo</strong>
                  <p>Estrategista de comunicação e consultor de IA aplicada. 17 anos entre publicidade, campanhas, setor público e tecnologia.</p>
                </div>
              </div>
            </div>

            {titulos.length > 1 && (
              <aside className="sumario" aria-label="Neste artigo">
                <span className="rotulo">Neste artigo</span>
                {titulos.map((t) => (
                  <a key={t.id} href={`#${t.id}`} className={t.nivel === 3 ? 'n3' : ''}>
                    {t.texto}
                  </a>
                ))}
              </aside>
            )}
          </div>
        </div>
      </article>

      {relacionados.length > 0 && (
        <section className="secao">
          <div className="container">
            <div className="secao-cabeca">
              <span className="rotulo">Continue lendo</span>
              <h2>Artigos relacionados</h2>
            </div>
            <div className="lista-artigos">
              {relacionados.map((a) => (
                <CardArtigo key={a.id} artigo={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaFinal titulo="Quer aplicar isso no seu caso?" texto="Me conta o seu desafio. Quem responde primeiro é a SecretárIA, e ela marca a conversa comigo." />
    </>
  );
}
