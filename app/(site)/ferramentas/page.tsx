import type { Metadata } from 'next';
import { CtaFinal, JsonLd } from '@/components/Blocos';
import { IconeWhatsApp } from '@/components/Icones';
import { AREAS_FERRAMENTAS, SITE, TOTAL_FERRAMENTAS, linkWhatsApp } from '@/content/site';

export const metadata: Metadata = {
  title: 'Ferramentas',
  description: `${TOTAL_FERRAMENTAS} ferramentas de IA e gestão criadas por Tiago Azevedo: SecretárIA, Polaris, Mapa de Votos BR, Celeiro e outras.`,
  alternates: { canonical: '/ferramentas' },
};

export default function Ferramentas() {
  return (
    <>
      <JsonLd
        dados={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Ferramentas de Tiago Azevedo',
          itemListElement: AREAS_FERRAMENTAS.flatMap((a) => a.ferramentas).map((f, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: { '@type': 'SoftwareApplication', name: f.nome, description: f.faz, applicationCategory: 'BusinessApplication', url: `${SITE.url}/ferramentas#${f.id}` },
          })),
        }}
      />
      <section className="hero-pagina">
        <div className="container secao-cabeca" style={{ marginBottom: 0 }}>
          <span className="rotulo">Ferramentas</span>
          <h1>Eu uso o que eu vendo.</h1>
          <p>
            {TOTAL_FERRAMENTAS} ferramentas que nasceram de problemas reais e hoje trabalham por pessoas, equipes e instituições.
          </p>
          <div className="pilulas" style={{ marginTop: 8 }}>
            {AREAS_FERRAMENTAS.map((a) => (
              <a key={a.id} href={`#${a.id}`} className="pilula">
                {a.nome}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="secao" style={{ paddingTop: 24 }}>
        <div className="container">
          {AREAS_FERRAMENTAS.map((area) => (
            <div key={area.id} id={area.id} className="area-ferramentas">
              <h2>
                {area.nome} <small>{area.ferramentas.length} {area.ferramentas.length === 1 ? 'ferramenta' : 'ferramentas'}</small>
              </h2>
              <div className="grade grade-3">
                {area.ferramentas.map((f) => (
                  <article key={f.id} id={f.id} className="cartao ferramenta interativo">
                    <span className="status-ar">Em operação</span>
                    <h3>{f.nome}</h3>
                    <p>{f.faz}</p>
                    <p className="resolve">
                      <b>Resolve:</b> {f.resolve}
                    </p>
                    <a
                      className="botao botao-secundario botao-pequeno"
                      style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
                      href={linkWhatsApp(`Olá, Tiago! Quero conhecer a ferramenta ${f.nome}.`)}
                      target="_blank"
                      rel="noopener"
                    >
                      <IconeWhatsApp />
                      Quero conhecer
                    </a>
                  </article>
                ))}
              </div>
            </div>
          ))}
          <p className="aviso aviso-info" style={{ marginTop: 56 }}>
            Princípios que valem para todas: dados protegidos e separados por cliente, comunicação só com quem autorizou receber, e decisão
            final sempre humana.
          </p>
        </div>
      </section>

      <CtaFinal titulo="Quer ver uma dessas funcionando no seu dia a dia?" texto="Me conta o seu desafio e eu mostro qual ferramenta resolve." />
    </>
  );
}
