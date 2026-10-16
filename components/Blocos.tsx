import Link from 'next/link';
import { linkWhatsApp } from '@/content/site';
import type { ArtigoComEditoria } from '@/lib/tipos';
import { formatarData, tempoDeLeitura } from '@/lib/util';
import { IconeWhatsApp } from './Icones';

export function CtaFinal({
  titulo,
  texto = 'Vamos conversar sobre como transformar sua comunicação em um ativo de crescimento?',
  mensagem,
}: {
  titulo?: React.ReactNode;
  texto?: string;
  mensagem?: string;
}) {
  return (
    <section className="secao cta-final">
      <div className="container">
        <span className="selo">O momento é agora</span>
        <h2>
          {titulo || (
            <>
              A pergunta não é mais se você vai usar IA. É se vai usar para <span className="destaque">liderar</span> ou para{' '}
              <span className="apagado">não ficar para trás</span>.
            </>
          )}
        </h2>
        <p>{texto}</p>
        <a className="botao botao-primario" href={linkWhatsApp(mensagem)} target="_blank" rel="noopener">
          <IconeWhatsApp />
          Falar com o Tiago no WhatsApp
        </a>
      </div>
    </section>
  );
}

export function Capa({ artigo, prioridade = false }: { artigo: ArtigoComEditoria; prioridade?: boolean }) {
  if (artigo.capa_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={artigo.capa_url} alt={artigo.capa_alt || artigo.titulo} loading={prioridade ? 'eager' : 'lazy'} />;
  }
  return (
    <div className="capa-sem-imagem" role="img" aria-label={artigo.capa_alt || artigo.titulo}>
      <span>{artigo.editoria?.nome || 'Blog'}</span>
    </div>
  );
}

export function MetaArtigo({ artigo }: { artigo: ArtigoComEditoria }) {
  return (
    <div className="meta">
      {artigo.editoria && <span className="editoria">{artigo.editoria.nome}</span>}
      <time dateTime={artigo.publicado_em || undefined}>{formatarData(artigo.publicado_em)}</time>
      <span>{tempoDeLeitura(artigo.corpo)} min de leitura</span>
    </div>
  );
}

export function CardArtigo({ artigo }: { artigo: ArtigoComEditoria }) {
  return (
    <Link href={`/blog/${artigo.slug}`} className="card-artigo">
      <div className="capa">
        <Capa artigo={artigo} />
      </div>
      <MetaArtigo artigo={artigo} />
      <h3>{artigo.titulo}</h3>
      <p>{artigo.resumo}</p>
    </Link>
  );
}

export function JsonLd({ dados }: { dados: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, '\\u003c') }} />;
}
