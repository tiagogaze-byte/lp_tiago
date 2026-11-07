import type { Metadata, Viewport } from 'next';
import { SITE } from '@/content/site';
import { identidadeDoSite } from '@/lib/identidade';
import { cssDoTema } from '@/lib/temas';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const { nome, slogan } = await identidadeDoSite();
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${nome} · ${slogan}`,
      template: `%s · ${nome}`,
    },
    description: SITE.descricao,
    authors: [{ name: nome, url: SITE.url }],
    alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: nome,
      title: `${nome} · ${slogan}`,
      description: SITE.descricao,
    },
    robots: { index: true, follow: true },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const { tema } = await identidadeDoSite();
  return { themeColor: tema.fundo, width: 'device-width', initialScale: 1, viewportFit: 'cover' };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { tema } = await identidadeDoSite();
  return (
    <html lang="pt-BR" data-tema={tema.id}>
      <head>
        {/* Cores do tema escolhido no painel (Aparência) */}
        <style id="tema" dangerouslySetInnerHTML={{ __html: cssDoTema(tema) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
