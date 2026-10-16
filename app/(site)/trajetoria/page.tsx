import type { Metadata } from 'next';
import { CtaFinal } from '@/components/Blocos';
import { AREAS_EXPERIENCIA } from '@/content/site';

export const metadata: Metadata = {
  title: 'Trajetória',
  description: 'Mais de 20 anos entre publicidade, campanhas eleitorais, setor público, educação e inteligência artificial.',
  alternates: { canonical: '/trajetoria' },
};

export default function Trajetoria() {
  return (
    <>
      <section className="hero-pagina">
        <div className="container secao-cabeca" style={{ marginBottom: 0 }}>
          <span className="rotulo">Trajetória</span>
          <h1>
            Trajetória híbrida: <span className="destaque">pessoas, política e tecnologia</span>.
          </h1>
        </div>
      </section>

      <section className="secao" style={{ paddingTop: 16 }}>
        <div className="container">
          <div className="texto-longo">
            <p>
              Me formei em Publicidade e Propaganda em 2004 e comecei escrevendo. De lá para cá, foram <strong>mais de 20 anos</strong> traduzindo ideias em mensagens que as pessoas
              entendem e lembram.
            </p>
            <p>
              Passei por agências, live marketing e eventos de marca. Coordenei campanhas eleitorais do municipal ao federal, cuidando de
              estratégia, criação, equipe, mídia e prestação de contas. Atuei com comunicação de mandatos, com projetos públicos e com
              mobilização social em saúde, junto a famílias, escolas e comunidades.
            </p>
            <p>
              Também dei aula. Fui professor na educação profissional e coordenei uma agência experimental. Ensinar me obrigou a explicar coisa
              complexa de um jeito simples, e isso virou método.
            </p>
            <p>
              Quando a inteligência artificial chegou, não fiquei só olhando. Passei a construir: atendimento automatizado, plataformas de
              estratégia, aplicativo de dados eleitorais, sistemas de gestão. Hoje uso a máquina para <strong>simplificar e escalar</strong> o
              que sempre fiz.
            </p>
            <p className="frase">Mais do que comunicar ideias, meu trabalho é transformá-las em conexões e resultados.</p>
          </div>
        </div>
      </section>

      <section className="secao secao-escura">
        <div className="container">
          <div className="secao-cabeca">
            <span className="rotulo">Áreas de experiência</span>
            <h2>Onde eu já estive.</h2>
          </div>
          <div className="tabela-areas">
            {AREAS_EXPERIENCIA.map((a) => (
              <div key={a.area}>
                <h3>{a.area}</h3>
                <p>{a.feito}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  );
}
