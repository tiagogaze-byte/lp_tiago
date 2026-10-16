import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogLista } from '@/components/BlogLista';
import { listarArtigos, listarEditorias } from '@/lib/blog';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const editoria = (await listarEditorias()).find((e) => e.slug === params.slug);
  if (!editoria) return {};
  return {
    title: `${editoria.nome} · Blog`,
    description: editoria.descricao,
    alternates: { canonical: `/blog/editoria/${editoria.slug}` },
  };
}

export default async function EditoriaPagina({ params }: Props) {
  const editorias = await listarEditorias();
  const editoria = editorias.find((e) => e.slug === params.slug);
  if (!editoria) notFound();
  const artigos = await listarArtigos({ editoriaSlug: editoria.slug });

  return (
    <BlogLista
      titulo={editoria.nome}
      descricao={editoria.descricao}
      artigos={artigos}
      editorias={editorias}
      editoriaAtiva={editoria.slug}
      destacar={false}
    />
  );
}
