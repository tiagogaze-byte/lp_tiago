import type { Metadata, Viewport } from 'next';
import { SITE } from '@/content/site';
import { identidadeDoSite } from '@/lib/identidade';
import { cssDoTema } from '@/lib/temas';
import { CLIENTE_PADRAO } from '@/lib/db';
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
    icons: iconesDoSite(id),
  };
}

// Ícone da aba: o enviado pelo cliente; senão o "t." do Tiago; senão a inicial gerada com as cores do tema.
function iconesDoSite(id: Awaited<ReturnType<typeof identidadeDoSite>>): Metadata['icons'] {
  if (id.faviconUrl) return { icon: id.faviconUrl, apple: id.faviconUrl };
  if (CLIENTE_PADRAO === 'tiagogaze') return { icon: '/icone-tiago.svg', apple: '/apple-icone-tiago.png' };
  const versao = encodeURIComponent(`${id.nome}-${id.tema.id}-${id.fonte}`); // troca o ícone na aba quando o tema muda
  return { icon: { url: `/icone.svg?v=${versao}`, type: 'image/svg+xml' } };
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
