import type { Metadata } from 'next';
import { CtaFinal } from '@/components/Blocos';
import { IconeWhatsApp } from '@/components/Icones';
import { SOLUCOES, linkWhatsApp } from '@/content/site';

export const metadata: Metadata = {
  title: 'Soluções',
  description: 'Consultoria estratégica, IA aplicada, inteligência eleitoral, negócios digitais e capacitação em IA.',
  alternates: { canonical: '/solucoes' },
};

export default function Solucoes() {
  return (
    <>
      <section className="hero-pagina">
        <div className="container secao-cabeca" style={{ marginBottom: 0 }}>
          <span className="rotulo">Soluções</span>
          <h1>Estratégia de um lado, tecnologia do outro.</h1>
          <p>E eu no meio, fazendo as duas conversarem. Cinco formas de trabalhar juntos.</p>
        </div>
      </section>

      <section className="secao" style={{ paddingTop: 24 }}>
        <div className="container">
          {SOLUCOES.map((s) => (
            <article key={s.id} id={s.id} className="solucao">
              <div>
                <h2>{s.nome}</h2>
                <p className="para-quem">
                  <strong style={{ color: 'var(--texto)' }}>Para quem:</strong> {s.paraQuem}
                </p>
              </div>
              <div className="direita">
                <ul className="lista-check">
                  {s.entrega.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
                <p className="frase">{s.frase}</p>
                <div>
                  <a
                    className="botao botao-secundario botao-pequeno"
                    href={linkWhatsApp(`Olá, Tiago! Quero saber mais sobre ${s.nome}.`)}
                    target="_blank"
                    rel="noopener"
                  >
                    <IconeWhatsApp />
                    Conversar sobre {s.nome}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaFinal />
    </>
  );
}
