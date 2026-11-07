import Link from 'next/link';
import { linkWhatsApp } from '@/content/site';
import type { Contato } from '@/lib/identidade';
import { renderizarMarkdown } from '@/lib/markdown';
import type { Bloco } from '@/lib/tipos';
import { IconeWhatsApp } from './Icones';

// Monta uma página a partir dos blocos salvos no painel.

type Contexto = { contato: Contato };

function Botao({ texto, link, contato, primario }: { texto: string; link: string; contato: Contato; primario?: boolean }) {
  if (!texto) return null;
  const classe = `botao ${primario ? 'botao-primario' : 'botao-secundario'}`;
  const alvo = (link || '').trim();
  if (!alvo || alvo.toLowerCase() === 'whatsapp') {
    if (!contato.whatsapp) return null;
    return (
      <a className={classe} href={linkWhatsApp(contato.mensagem, contato.whatsapp)} target="_blank" rel="noopener">
        <IconeWhatsApp />
        {texto}
      </a>
    );
  }
  if (alvo.startsWith('/')) {
    return (
      <Link className={classe} href={alvo}>
        {texto}
      </Link>
    );
  }
  const href = /^(https?:|mailto:|tel:)/.test(alvo) ? alvo : `https://${alvo}`;
  return (
    <a className={classe} href={href} target="_blank" rel="noopener">
      {texto}
    </a>
  );
}

function Cabeca({ rotulo, titulo, texto, principal }: { rotulo?: string; titulo?: string; texto?: string; principal?: boolean }) {
  if (!rotulo && !titulo && !texto) return null;
  const Titulo = principal ? 'h1' : 'h2';
  return (
    <div className="secao-cabeca">
      {rotulo && <span className="rotulo">{rotulo}</span>}
      {titulo && <Titulo>{titulo}</Titulo>}
      {texto && <p>{texto}</p>}
    </div>
  );
}

function BlocoUnico({ bloco, indice, contexto, home }: { bloco: Bloco; indice: number; contexto: Contexto; home: boolean }) {
  const { contato } = contexto;
  const faixa = indice % 2 === 1 ? 'secao secao-escura' : 'secao';
  const principal = indice === 0; // o primeiro título da página é o h1

  switch (bloco.tipo) {
    case 'topo': {
      const comFoto = Boolean(bloco.imagem_url);
      return (
        <section className={`${home ? 'hero' : 'hero hero-pagina'}${comFoto ? ' hero-com-foto' : ''}`}>
          <div className="container">
            <div className="hero-texto">
              {bloco.rotulo && <span className="rotulo">{bloco.rotulo}</span>}
              {principal ? (
                <h1>
                  {bloco.titulo} {bloco.destaque && <span className="destaque-gradiente">{bloco.destaque}</span>}
                </h1>
              ) : (
                <h2 className="hero-titulo">
                  {bloco.titulo} {bloco.destaque && <span className="destaque-gradiente">{bloco.destaque}</span>}
                </h2>
              )}
              {bloco.texto && <p className="lead">{bloco.texto}</p>}
              {(bloco.botao_texto || bloco.botao2_texto) && (
                <div className="acoes">
                  <Botao texto={bloco.botao_texto} link={bloco.botao_link} contato={contato} primario />
                  <Botao texto={bloco.botao2_texto} link={bloco.botao2_link} contato={contato} />
                </div>
              )}
            </div>
            {comFoto && (
              <figure className="hero-foto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bloco.imagem_url} alt={bloco.imagem_alt || ''} loading="eager" />
              </figure>
            )}
          </div>
        </section>
      );
    }

    case 'cartoes': {
      const itens = bloco.itens.filter((i) => i.titulo || i.texto);
      const colunas = itens.length === 2 || itens.length === 4 ? 'grade-2' : 'grade-3';
      return (
        <section className={faixa}>
          <div className="container">
            <Cabeca rotulo={bloco.rotulo} titulo={bloco.titulo} texto={bloco.texto} principal={principal} />
            <div className={`grade ${colunas}`}>
              {itens.map((item, i) => (
                <div key={i} className="cartao">
                  {bloco.numerados && <span className="cartao-numero">{String(i + 1).padStart(2, '0')}</span>}
                  {item.titulo && <h3>{item.titulo}</h3>}
                  {item.texto && <p>{item.texto}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'texto': {
      const { html } = renderizarMarkdown(bloco.corpo || '');
      const corpo = (
        <div>
          <Cabeca rotulo={bloco.rotulo} titulo={bloco.titulo} principal={principal} />
          {bloco.corpo && <div className="prosa" dangerouslySetInnerHTML={{ __html: html }} />}
        </div>
      );
      return (
        <section className={faixa}>
          <div className="container">
            {bloco.imagem_url ? (
              <div className="texto-com-imagem">
                {corpo}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bloco.imagem_url} alt={bloco.imagem_alt || ''} loading="lazy" />
              </div>
            ) : (
              <div className="texto-largura">{corpo}</div>
            )}
          </div>
        </section>
      );
    }

    case 'citacao':
      return (
        <section className={`${faixa} citacao`}>
          <div className="container">
            <figure>
              <blockquote>
                <p>“{bloco.texto}”</p>
              </blockquote>
              {bloco.autor && <figcaption>{bloco.autor}</figcaption>}
            </figure>
          </div>
        </section>
      );

    case 'contato':
      return (
        <section className={faixa}>
          <div className="container">
            <Cabeca rotulo={bloco.rotulo} titulo={bloco.titulo} texto={bloco.texto} principal={principal} />
            <div className="canais">
              {contato.whatsapp && (
                <div className="cartao canal">
                  <span className="rotulo">WhatsApp</span>
                  <span className="valor">{contato.whatsappExibicao}</span>
                  <a className="botao botao-primario" style={{ alignSelf: 'flex-start' }} href={linkWhatsApp(contato.mensagem, contato.whatsapp)} target="_blank" rel="noopener">
                    <IconeWhatsApp />
                    Enviar mensagem
                  </a>
                </div>
              )}
              {contato.telefone && (
                <div className="cartao canal">
                  <span className="rotulo">Telefone</span>
                  <span className="valor">{contato.telefone}</span>
                  <a className="botao botao-secundario" style={{ alignSelf: 'flex-start' }} href={`tel:${contato.telefone.replace(/[^\d+]/g, '')}`}>
                    Ligar
                  </a>
                </div>
              )}
              {contato.email && (
                <div className="cartao canal">
                  <span className="rotulo">E-mail</span>
                  <span className="valor">{contato.email}</span>
                  <a className="botao botao-secundario" style={{ alignSelf: 'flex-start' }} href={`mailto:${contato.email}`}>
                    Escrever
                  </a>
                </div>
              )}
            </div>
            {(contato.registro || contato.cidade) && (
              <p className="contato-rodape">{[contato.registro, contato.cidade].filter(Boolean).join(' · ')}</p>
            )}
          </div>
        </section>
      );

    case 'chamada':
      return (
        <section className="secao cta-final">
          <div className="container">
            {principal ? <h1>{bloco.titulo}</h1> : <h2>{bloco.titulo}</h2>}
            {bloco.texto && <p>{bloco.texto}</p>}
            <Botao texto={bloco.botao_texto} link={bloco.botao_link} contato={contato} primario />
          </div>
        </section>
      );
  }
}

export function BlocosPagina({ blocos, contato, home = false }: { blocos: Bloco[]; contato: Contato; home?: boolean }) {
  return (
    <>
      {blocos.map((bloco, i) => (
        <BlocoUnico key={bloco.id || i} bloco={bloco} indice={i} contexto={{ contato }} home={home} />
      ))}
    </>
  );
}
