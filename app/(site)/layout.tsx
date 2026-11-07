import { Cabecalho } from '@/components/Cabecalho';
import { Rodape } from '@/components/Rodape';
import { JsonLd } from '@/components/Blocos';
import { SITE, linkWhatsApp } from '@/content/site';
import { identidadeDoSite } from '@/lib/identidade';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const id = await identidadeDoSite();
  const marca = { nome: id.nome, slogan: id.slogan, logoUrl: id.logoUrl };
  const whatsapp = id.contato.whatsapp ? linkWhatsApp(id.contato.mensagem, id.contato.whatsapp) : null;

  // Dados estruturados para Google e buscadores de IA.
  const dados = id.usaPaginas
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE.url}/#pessoa`,
        name: id.nome,
        url: SITE.url,
        ...(id.slogan ? { jobTitle: id.slogan } : {}),
        ...(id.contato.email ? { email: `mailto:${id.contato.email}` } : {}),
        ...(id.contato.whatsapp ? { telephone: `+${id.contato.whatsapp}` } : {}),
        ...(id.contato.cidade ? { address: { '@type': 'PostalAddress', addressLocality: id.contato.cidade, addressCountry: 'BR' } } : {}),
      }
    : {
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
      };

  return (
    <>
      <JsonLd dados={dados} />
      <Cabecalho marca={marca} menu={id.menu} whatsapp={whatsapp} />
      <main>{children}</main>
      <Rodape marca={marca} menu={id.menu} whatsapp={whatsapp} contato={id.contato} assinaturaTiago={!id.usaPaginas} />
    </>
  );
}
