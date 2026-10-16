import Link from 'next/link';
import { CardArtigo, CtaFinal } from '@/components/Blocos';
import { IconeSeta, IconeWhatsApp } from '@/components/Icones';
import { AREAS_FERRAMENTAS, SOLUCOES, TOTAL_FERRAMENTAS, linkWhatsApp } from '@/content/site';
import { listarArtigos } from '@/lib/blog';

export const revalidate = 60;

export default async function Home() {
  const artigos = await listarArtigos({ limite: 3 });

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="selo">Estratégia Narrativa e IA Aplicada</span>
          <h1>
            O gap entre o que você faz e o que o mercado percebe <span className="destaque-gradiente">está custando caro.</span>
          </h1>
          <div className="linha" />
          <p className="lead">
            Sou <strong>Tiago Azevedo</strong>. Há 17 anos transformo trabalho invisível em posicionamento, e hoje faço isso com{' '}
            <strong>inteligência artificial</strong> trabalhando a seu favor.
          </p>
          <div className="acoes">
            <a className="botao botao-primario" href={linkWhatsApp('Olá, Tiago! Quero fechar esse gap.')} target="_blank" rel="noopener">
              <IconeWhatsApp />
              Quero fechar esse gap
            </a>
            <Link className="botao botao-secundario" href="/solucoes">
              Ver soluções
            </Link>
          </div>
        </div>
      </section>

      <section className="secao secao-escura">
        <div className="container grade grade-2" style={{ gap: 56, alignItems: 'center' }}>
          <div className="secao-cabeca" style={{ marginBottom: 0 }}>
            <span className="rotulo">O problema</span>
            <h2>
              Você não tem um problema de <span className="destaque">produto</span>. Tem um problema de{' '}
              <span className="destaque">comunicação</span>.
            </h2>
          </div>
          <div className="problemas">
            <div className="problema">
              <span className="marcador" />
              <p>
                Você <strong>faz muito</strong>, mas consegue <strong>mostrar pouco</strong>.
              </p>
            </div>
            <div className="problema">
              <span className="marcador" />
              <p>
                Sua mensagem se perde no <strong>ruído digital</strong>.
              </p>
            </div>
            <div className="problema">
              <span className="marcador" />
              <p>
                Seu cliente demora a entender o seu <strong>valor real</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="secao-cabeca">
            <span className="rotulo">Como eu resolvo</span>
            <h2>
              Eu não entrego posts. Entrego <span className="destaque">posicionamento</span> e <span className="destaque">escala</span>.
            </h2>
            <p>Estratégia humana de um lado, inteligência artificial do outro, trabalhando juntas.</p>
          </div>
          <div className="grade grade-3">
            {SOLUCOES.slice(0, 3).map((s) => (
              <Link key={s.id} href={`/solucoes#${s.id}`} className="cartao">
                <h3>{s.nome}</h3>
                <p>{s.paraQuem}</p>
                <span className="mais">Saiba mais →</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <Link href="/solucoes" className="botao botao-secundario botao-pequeno">
              Todas as soluções <IconeSeta />
            </Link>
          </div>
        </div>
      </section>

      <section className="secao secao-escura">
        <div className="container">
          <div className="secao-cabeca">
            <span className="rotulo">Ferramentas</span>
            <h2>Não é teoria. Está funcionando.</h2>
            <p>{TOTAL_FERRAMENTAS} ferramentas criadas por mim, em operação, organizadas em quatro áreas.</p>
          </div>
          <div className="grade grade-4">
            {AREAS_FERRAMENTAS.map((area) => (
              <Link key={area.id} href={`/ferramentas#${area.id}`} className="cartao">
                <span className="status-ar">Em operação</span>
                <h3>{area.nome}</h3>
                <p>{area.ferramentas.map((f) => f.nome).join(' · ')}</p>
                <span className="mais">Ver ferramentas →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="secao-cabeca">
            <span className="rotulo">Trajetória</span>
            <h2>Pessoas, política e tecnologia.</h2>
          </div>
          <div className="numeros">
            <div>
              <strong>17 anos</strong>
              <span>de comunicação e estratégia</span>
            </div>
            <div>
              <strong>Desde 2012</strong>
              <span>em campanhas, do municipal ao federal</span>
            </div>
            <div>
              <strong>4 frentes</strong>
              <span>política, setor público, mercado e educação</span>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <Link href="/trajetoria" className="botao botao-secundario botao-pequeno">
              Conheça minha trajetória <IconeSeta />
            </Link>
          </div>
        </div>
      </section>

      {artigos.length > 0 && (
        <section className="secao secao-escura">
          <div className="container">
            <div className="secao-cabeca">
              <span className="rotulo">Do blog</span>
              <h2>Ideias para quem quer comunicar melhor.</h2>
            </div>
            <div className="lista-artigos">
              {artigos.map((a) => (
                <CardArtigo key={a.id} artigo={a} />
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Link href="/blog" className="botao botao-secundario botao-pequeno">
                Ver todos os artigos <IconeSeta />
              </Link>
            </div>
          </div>
        </section>
      )}

      <CtaFinal />
    </>
  );
}
