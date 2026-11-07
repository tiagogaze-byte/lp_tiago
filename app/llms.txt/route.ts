import { AREAS_FERRAMENTAS, SITE, SOLUCOES } from '@/content/site';
import { listarArtigos } from '@/lib/blog';
import { identidadeDoSite } from '@/lib/identidade';
import { paginaPublicada, paginasPublicadas } from '@/lib/paginas';

export const revalidate = 3600;

// llms.txt: um resumo do site em texto puro, feito para assistentes de IA lerem e citarem.
export async function GET() {
  const id = await identidadeDoSite();
  if (id.usaPaginas) return new Response(await resumoDasPaginas(id), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  const artigos = await listarArtigos({ limite: 200 });

  const texto = `# ${SITE.nome}

> ${SITE.nome} é estrategista de comunicação e consultor de IA aplicada, de ${SITE.cidade} (MG, Brasil), formado em Publicidade e Propaganda em 2004, com mais de 20 anos de experiência em publicidade, campanhas eleitorais, setor público, educação e tecnologia. Ele fecha o gap entre o que pessoas e organizações fazem e o que o mercado percebe, usando estratégia narrativa e inteligência artificial.

Contato: WhatsApp ${SITE.whatsappExibicao} · ${SITE.email} · ${SITE.url}

## Soluções

${SOLUCOES.map((s) => `- [${s.nome}](${SITE.url}/solucoes#${s.id}): ${s.paraQuem} Entrega: ${s.entrega.join(', ')}.`).join('\n')}

## Ferramentas

${AREAS_FERRAMENTAS.map((a) => `### ${a.nome}\n${a.ferramentas.map((f) => `- [${f.nome}](${SITE.url}/ferramentas#${f.id})${f.status === 'testes' ? ' (em testes)' : ''}: ${f.faz}`).join('\n')}`).join('\n\n')}

## Blog

${artigos.length ? artigos.map((a) => `- [${a.titulo}](${SITE.url}/blog/${a.slug}): ${a.resumo}`).join('\n') : '- Em breve.'}

## Páginas

- [Trajetória](${SITE.url}/trajetoria)
- [Contato](${SITE.url}/contato)
`;

  return new Response(texto, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

// Resumo para sites montados em blocos: nome, assinatura, contato e o texto de cada página.
async function resumoDasPaginas(id: Awaited<ReturnType<typeof identidadeDoSite>>) {
  const linhas = [`# ${id.nome}`, ''];
  if (id.slogan) linhas.push(`> ${id.slogan}`, '');
  const contato = [id.contato.registro, id.contato.cidade, id.contato.whatsappExibicao && `WhatsApp ${id.contato.whatsappExibicao}`, id.contato.email, SITE.url].filter(Boolean);
  linhas.push(`Contato: ${contato.join(' · ')}`, '');
  for (const { slug } of await paginasPublicadas()) {
    const pagina = await paginaPublicada(slug);
    if (!pagina) continue;
    linhas.push(`## ${pagina.titulo} (${SITE.url}${slug === 'inicio' ? '/' : `/${slug}`})`, '');
    for (const b of pagina.blocos) {
      const partes: string[] = [];
      if (b.tipo === 'topo') partes.push([b.titulo, b.destaque].filter(Boolean).join(' '), b.texto);
      if (b.tipo === 'cartoes') partes.push(b.titulo, b.texto, ...b.itens.map((i) => `- ${i.titulo}: ${i.texto}`));
      if (b.tipo === 'texto') partes.push(b.titulo, b.corpo);
      if (b.tipo === 'citacao') partes.push(`"${b.texto}"${b.autor ? ` (${b.autor})` : ''}`);
      if (b.tipo === 'chamada') partes.push(b.titulo, b.texto);
      if (b.tipo === 'contato') partes.push(b.titulo, b.texto);
      linhas.push(...partes.filter(Boolean), '');
    }
  }
  return linhas.join('\n');
}
