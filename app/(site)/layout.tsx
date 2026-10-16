import { Cabecalho } from '@/components/Cabecalho';
import { Rodape } from '@/components/Rodape';
import { JsonLd } from '@/components/Blocos';
import { SITE } from '@/content/site';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        dados={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': `${SITE.url}/#tiago`,
          name: SITE.nome,
          url: SITE.url,
          email: `mailto:${SITE.email}`,
          telephone: '+55-31-99718-0531',
          jobTitle: 'Estrategista de comunicação e consultor de IA aplicada',
          address: { '@type': 'PostalAddress', addressLocality: SITE.cidade, addressRegion: 'MG', addressCountry: 'BR' },
          knowsAbout: ['Comunicação política', 'Inteligência artificial aplicada', 'Dados eleitorais', 'Automação de atendimento', 'Estratégia de posicionamento'],
        }}
      />
      <Cabecalho />
      <main>{children}</main>
      <Rodape />
    </>
  );
}
