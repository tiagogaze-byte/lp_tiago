import type { Metadata } from 'next';
import { BlogLista } from '@/components/BlogLista';
import { listarArtigos, listarEditorias } from '@/lib/blog';

export const revalidate = 60;

type Props = { params: { tag: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  return { title: `${tag} · Blog`, description: `Artigos sobre ${tag}.`, robots: { index: false, follow: true } };
}

export default async function TagPagina({ params }: Props) {
  const tag = decodeURIComponent(params.tag);
  const [artigos, editorias] = await Promise.all([listarArtigos({ tag }), listarEditorias()]);
  return <BlogLista titulo={`Tudo sobre ${tag}`} descricao={`Artigos marcados com “${tag}”.`} artigos={artigos} editorias={editorias} destacar={false} />;
}
