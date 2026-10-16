import type { Metadata } from 'next';
import { BlogLista } from '@/components/BlogLista';
import { listarArtigos, listarEditorias } from '@/lib/blog';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Comunicação, política e inteligência artificial, explicadas por quem usa todo dia.',
  alternates: { canonical: '/blog' },
};

export default async function Blog() {
  const [artigos, editorias] = await Promise.all([listarArtigos(), listarEditorias()]);
  return (
    <BlogLista
      titulo="Ideias para quem quer comunicar melhor."
      descricao="Comunicação, política e inteligência artificial, explicadas por quem usa todo dia."
      artigos={artigos}
      editorias={editorias}
    />
  );
}
