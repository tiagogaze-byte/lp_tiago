import { AREAS_FERRAMENTAS, SITE, SOLUCOES } from '@/content/site';
import { listarArtigos } from '@/lib/blog';

export const revalidate = 3600;

// llms.txt: um resumo do site em texto puro, feito para assistentes de IA lerem e citarem.
export async function GET() {
  const artigos = await listarArtigos({ limite: 200 });

  const texto = `# ${SITE.nome}

> ${SITE.nome} é estrategista de comunicação e consultor de IA aplicada, de ${SITE.cidade} (MG, Brasil), com 17 anos de experiência em publicidade, campanhas eleitorais, setor público, educação e tecnologia. Ele fecha o gap entre o que pessoas e organizações fazem e o que o mercado percebe, usando estratégia narrativa e inteligência artificial.

Contato: WhatsApp ${SITE.whatsappExibicao} · ${SITE.email} · ${SITE.url}

## Soluções

${SOLUCOES.map((s) => `- [${s.nome}](${SITE.url}/solucoes#${s.id}): ${s.paraQuem} Entrega: ${s.entrega.join(', ')}.`).join('\n')}

## Ferramentas

${AREAS_FERRAMENTAS.map((a) => `### ${a.nome}\n${a.ferramentas.map((f) => `- [${f.nome}](${SITE.url}/ferramentas#${f.id}): ${f.faz}`).join('\n')}`).join('\n\n')}

## Blog

${artigos.length ? artigos.map((a) => `- [${a.titulo}](${SITE.url}/blog/${a.slug}): ${a.resumo}`).join('\n') : '- Em breve.'}

## Páginas

- [Trajetória](${SITE.url}/trajetoria)
- [Contato](${SITE.url}/contato)
`;

  return new Response(texto, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
