import { SITE } from '@/content/site';
import { listarArtigos } from '@/lib/blog';

export const revalidate = 3600;

const escapar = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const artigos = await listarArtigos({ limite: 50 });
  const itens = artigos
    .map(
      (a) => `
    <item>
      <title>${escapar(a.titulo)}</title>
      <link>${SITE.url}/blog/${a.slug}</link>
      <guid>${SITE.url}/blog/${a.slug}</guid>
      <description>${escapar(a.resumo)}</description>
      ${a.editoria ? `<category>${escapar(a.editoria.nome)}</category>` : ''}
      <pubDate>${new Date(a.publicado_em || a.criado_em).toUTCString()}</pubDate>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog · ${SITE.nome}</title>
    <link>${SITE.url}/blog</link>
    <description>Comunicação, política e inteligência artificial, explicadas por quem usa todo dia.</description>
    <language>pt-BR</language>${itens}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
