import type { Metadata, Viewport } from 'next';
import { SITE } from '@/content/site';
import { identidadeDoSite } from '@/lib/identidade';
import { cssDoTema } from '@/lib/temas';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const id = await identidadeDoSite();
  const nome = id.nome;
  const titulo = id.slogan ? `${nome} · ${id.slogan}` : nome;
  const descricao = id.usaPaginas ? id.slogan || nome : SITE.descricao;
  return {
    metadataBase: new URL(SITE.url),
    title: { default: titulo, template: `%s · ${nome}` },
    description: descricao,
    authors: [{ name: nome, url: SITE.url }],
    alternates: { canonical: '/', types: id.blogAtivo ? { 'application/rss+xml': '/feed.xml' } : undefined },
    openGraph: { type: 'website', locale: 'pt_BR', siteName: nome, title: titulo, description: descricao },
    robots: { index: true, follow: true },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const { tema } = await identidadeDoSite();
  return { themeColor: tema.fundo, width: 'device-width', initialScale: 1, viewportFit: 'cover' };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { tema, fonte } = await identidadeDoSite();
  const familias = fonte === 'elegante' ? 'Lora:wght@500;600;700&family=Inter:wght@400;500;600' : 'Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600';
  return (
    <html lang="pt-BR" data-tema={tema.id} data-fonte={fonte}>
      <head>
        {/* Cores do tema escolhido no painel (Aparência) */}
        <style id="tema" dangerouslySetInnerHTML={{ __html: cssDoTema(tema, fonte) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href={`https://fonts.googleapis.com/css2?family=${familias}&display=swap`}
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
