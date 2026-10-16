import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { gerarSlug } from './util';

export type Titulo = { id: string; texto: string; nivel: number };

// Converte o markdown do artigo em HTML seguro e devolve o sumário (H2/H3).
export function renderizarMarkdown(markdown: string) {
  const titulos: Titulo[] = [];
  const renderer = new marked.Renderer();

  renderer.heading = ({ tokens, depth }) => {
    const texto = tokens.map((t) => ('text' in t ? t.text : '')).join('');
    const id = gerarSlug(texto);
    if (depth === 2 || depth === 3) titulos.push({ id, texto, nivel: depth });
    return `<h${depth} id="${id}">${marked.parseInline(texto)}</h${depth}>`;
  };

  renderer.link = ({ href, title, tokens }) => {
    const texto = marked.Parser.parseInline(tokens);
    const externo = /^https?:\/\//.test(href) && !href.includes('tiagogaze.com.br');
    const atributos = externo ? ' target="_blank" rel="noopener"' : '';
    const tit = title ? ` title="${title}"` : '';
    return `<a href="${href}"${tit}${atributos}>${texto}</a>`;
  };

  const bruto = marked.parse(markdown || '', { renderer, async: false }) as string;

  const html = sanitizeHtml(bruto, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'figure', 'figcaption']),
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'loading'],
      h1: ['id'],
      h2: ['id'],
      h3: ['id'],
      h4: ['id'],
    },
    transformTags: {
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } }),
    },
  });

  return { html, titulos };
}
