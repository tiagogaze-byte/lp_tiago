import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';
import { listarArtigos, listarEditorias } from '@/lib/blog';
import { identidadeDoSite } from '@/lib/identidade';
import { paginasPublicadas } from '@/lib/paginas';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const id = await identidadeDoSite();
  const caminhos = id.usaPaginas
    ? (await paginasPublicadas()).map((p) => (p.slug === 'inicio' ? '' : `/${p.slug}`))
    : ['', '/solucoes', '/ferramentas', '/trajetoria', '/contato'];
  if (id.blogAtivo) caminhos.push('/blog');

  const fixas = caminhos.map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: p === '/blog' ? ('daily' as const) : ('monthly' as const),
    priority: p === '' ? 1 : 0.8,
  }));
  if (!id.blogAtivo) return fixas;

  const [artigos, editorias] = await Promise.all([listarArtigos({ limite: 5000 }), listarEditorias()]);
  return [
    ...fixas,
    ...editorias.map((e) => ({ url: `${SITE.url}/blog/editoria/${e.slug}`, changeFrequency: 'weekly' as const, priority: 0.6 })),
    ...artigos.map((a) => ({ url: `${SITE.url}/blog/${a.slug}`, lastModified: a.atualizado_em, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
