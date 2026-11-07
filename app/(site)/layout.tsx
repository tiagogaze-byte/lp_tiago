import { Cabecalho } from '@/components/Cabecalho';
import { Rodape } from '@/components/Rodape';
import { JsonLd } from '@/components/Blocos';
import { SITE } from '@/content/site';
import { identidadeDoSite } from '@/lib/identidade';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const identidade = await identidadeDoSite();
  const marca = { nome: identidade.nome, slogan: identidade.slogan, logoUrl: identidade.logoUrl };
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
      <Cabecalho marca={marca} />
      <main>{children}</main>
      <Rodape marca={marca} />
    </>
  );
}
