import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlocosPagina } from '@/components/BlocosPagina';
import { identidadeDoSite } from '@/lib/identidade';
import { paginaPublicada } from '@/lib/paginas';

// Qualquer página criada no painel (Sobre, Agenda, Serviços...). A home ("inicio") fica em /.

export const revalidate = 60;

type Props = { params: { pagina: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (params.pagina === 'inicio') return {};
  const pagina = await paginaPublicada(params.pagina);
  if (!pagina) return {};
  return { title: pagina.titulo, description: pagina.descricao || undefined, alternates: { canonical: `/${pagina.slug}` } };
}

export default async function PaginaDoCliente({ params }: Props) {
  if (params.pagina === 'inicio') notFound();
  const pagina = await paginaPublicada(params.pagina);
  if (!pagina) notFound();
  const { contato } = await identidadeDoSite();
  return <BlocosPagina blocos={pagina.blocos} contato={contato} />;
}
