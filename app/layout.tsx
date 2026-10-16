import type { Metadata, Viewport } from 'next';
import { SITE } from '@/content/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nome} · ${SITE.assinatura}`,
    template: `%s · ${SITE.nome}`,
  },
  description: SITE.descricao,
  authors: [{ name: SITE.nome, url: SITE.url }],
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE.nome,
    title: `${SITE.nome} · ${SITE.assinatura}`,
    description: SITE.descricao,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0f1014',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
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
