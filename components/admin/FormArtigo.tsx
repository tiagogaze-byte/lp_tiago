'use client';

import { useMemo, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { marked } from 'marked';
import { excluirArtigo, salvarArtigo, type Resultado } from '@/app/admin/acoes';
import type { Artigo, Editoria, ItemFaq, StatusArtigo } from '@/lib/tipos';
import { gerarSlug, tempoDeLeitura } from '@/lib/util';

type Props = {
  artigo?: Artigo;
  editorias: Editoria[];
  outros: { id: string; titulo: string }[];
  avisoInicial?: string;
  dataInicial?: string;
};

function paraDataLocal(iso: string | null | undefined) {
  if (!iso) return '';
  const partes = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
  return partes.replace(' ', 'T');
}

function BotaoSalvar({ status }: { status: StatusArtigo }) {
  const { pending } = useFormStatus();
  const texto = { rascunho: 'Salvar rascunho', agendado: 'Agendar', publicado: 'Publicar' }[status];
  return (
    <button className="botao botao-primario" type="submit" disabled={pending} style={{ width: '100%' }}>
      {pending ? 'Salvando...' : texto}
    </button>
  );
}

export function FormArtigo({ artigo, editorias, outros, avisoInicial, dataInicial }: Props) {
  const [estado, acao] = useFormState<Resultado | null, FormData>(salvarArtigo, avisoInicial ? { ok: true, mensagem: avisoInicial } : null);

  const [titulo, setTitulo] = useState(artigo?.titulo || '');
  const [slug, setSlug] = useState(artigo?.slug || '');
  const [slugManual, setSlugManual] = useState(Boolean(artigo?.slug));
  const [resumo, setResumo] = useState(artigo?.resumo || '');
  const [corpo, setCorpo] = useState(artigo?.corpo || '');
  const [palavraChave, setPalavraChave] = useState(artigo?.palavra_chave || '');
  const [capaUrl, setCapaUrl] = useState(artigo?.capa_url || '');
  const [capaAlt, setCapaAlt] = useState(artigo?.capa_alt || '');
  const [faq, setFaq] = useState<ItemFaq[]>(artigo?.faq?.length ? artigo.faq : [{ pergunta: '', resposta: '' }]);
  const [status, setStatus] = useState<StatusArtigo>(artigo?.status || (dataInicial ? 'agendado' : 'rascunho'));
  const [aba, setAba] = useState<'escrever' | 'previa'>('escrever');
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erroImagem, setErroImagem] = useState('');
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const textoRef = useRef<HTMLTextAreaElement>(null);

  const slugFinal = slugManual ? slug : gerarSlug(titulo);
  const previa = useMemo(() => (aba === 'previa' ? (marked.parse(corpo || '*Nada escrito ainda.*', { async: false }) as string) : ''), [aba, corpo]);

  // ---------- Barra do editor ----------
  function envolver(antes: string, depois = antes, exemplo = 'texto') {
    const el = textoRef.current;
    if (!el) return;
    const { selectionStart: ini, selectionEnd: fim } = el;
    const selecionado = corpo.slice(ini, fim) || exemplo;
    const novo = corpo.slice(0, ini) + antes + selecionado + depois + corpo.slice(fim);
    setCorpo(novo);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(ini + antes.length, ini + antes.length + selecionado.length);
    });
  }
  function prefixarLinha(prefixo: string) {
    const el = textoRef.current;
    if (!el) return;
    const ini = corpo.lastIndexOf('\n', el.selectionStart - 1) + 1;
    setCorpo(corpo.slice(0, ini) + prefixo + corpo.slice(ini));
    requestAnimationFrame(() => el.focus());
  }
  function inserirLink() {
    envolver('[', '](https://)', 'texto do link');
  }

  async function enviarImagem(arquivo: File, destino: 'capa' | 'corpo') {
    setErroImagem('');
    setEnviandoImagem(true);
    const dados = new FormData();
    dados.append('arquivo', arquivo);
    dados.append('nome', slugFinal || titulo || 'imagem');
    try {
      const resposta = await fetch('/api/upload', { method: 'POST', body: dados });
      const json = (await resposta.json()) as { url?: string; erro?: string };
      if (!resposta.ok || !json.url) {
        setErroImagem(json.erro || 'Não foi possível enviar a imagem.');
        return;
      }
      if (destino === 'capa') setCapaUrl(json.url);
      else envolver('![', `](${json.url})`, 'descreva a imagem');
    } catch {
      setErroImagem('Não foi possível enviar a imagem. Confira sua conexão e tente de novo.');
    } finally {
      setEnviandoImagem(false);
    }
  }

  // ---------- Checagem de SEO e busca por IA ----------
  const pc = palavraChave.trim().toLowerCase();
  const primeiroParagrafo = corpo.split(/\n\s*\n/)[0]?.toLowerCase() || '';
  const linksInternos = (corpo.match(/\]\((\/|https?:\/\/(www\.)?tiagogaze\.com\.br)/g) || []).length;
  const subtitulos = (corpo.match(/^##\s/gm) || []).length;
  const faqValidas = faq.filter((f) => f.pergunta.trim() && f.resposta.trim()).length;
  const checagens = [
    { ok: titulo.length > 0 && titulo.length <= 60, texto: 'Título com até 60 caracteres' },
    { ok: resumo.length >= 110 && resumo.length <= 160, texto: 'Resumo entre 110 e 160 caracteres' },
    { ok: Boolean(pc) && titulo.toLowerCase().includes(pc), texto: 'Palavra-chave no título' },
    { ok: Boolean(pc) && primeiroParagrafo.includes(pc), texto: 'Palavra-chave no primeiro parágrafo' },
    { ok: subtitulos >= 2, texto: 'Pelo menos 2 subtítulos (##), de preferência em forma de pergunta' },
    { ok: faqValidas >= 3, texto: 'Pelo menos 3 perguntas frequentes' },
    { ok: linksInternos >= 1, texto: 'Pelo menos 1 link para outra página do site' },
    { ok: !capaUrl || capaAlt.trim().length > 0, texto: 'Texto alternativo da capa preenchido' },
  ];
  const nota = checagens.filter((c) => c.ok).length;

  return (
    <>
      <form action={acao} className="form-artigo">
        <input type="hidden" name="id" value={artigo?.id || ''} />
        <input type="hidden" name="slug" value={slugFinal} />
        <input type="hidden" name="faq" value={JSON.stringify(faq)} />
        <input type="hidden" name="capa_url" value={capaUrl} />

        <div style={{ display: 'grid', gap: 20, minWidth: 0 }}>
          {estado && <p className={`aviso ${estado.ok ? 'aviso-ok' : 'aviso-erro'}`}>{estado.mensagem}</p>}

          <div className="campo campo-titulo">
            <label htmlFor="titulo">
              Título <small className={titulo.length > 60 ? 'passou' : ''}>{titulo.length}/60</small>
            </label>
            <input id="titulo" name="titulo" type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Uma pergunta que as pessoas fazem de verdade" />
          </div>

          <div className="campo">
            <label htmlFor="slug-visivel">
              Endereço (slug) <small>tiagogaze.com.br/blog/{slugFinal || '...'}</small>
            </label>
            <input
              id="slug-visivel"
              type="text"
              value={slugFinal}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(gerarSlug(e.target.value));
              }}
            />
            {slugManual && (
              <button type="button" className="botao-texto" style={{ justifySelf: 'start' }} onClick={() => setSlugManual(false)}>
                Gerar a partir do título
              </button>
            )}
          </div>

          <div className="campo">
            <label htmlFor="resumo">
              Resumo / meta description{' '}
              <small className={resumo.length > 160 ? 'passou' : ''}>{resumo.length}/160</small>
            </label>
            <textarea id="resumo" name="resumo" rows={3} value={resumo} onChange={(e) => setResumo(e.target.value)} placeholder="A resposta direta, em uma ou duas frases. É o que aparece no Google e o que as IAs costumam citar." />
          </div>

          <div className="campo">
            <label htmlFor="corpo">
              Texto do artigo <small>{tempoDeLeitura(corpo)} min de leitura</small>
            </label>
            <div>
              <div className="editor-barra" role="toolbar" aria-label="Formatação">
                <button type="button" onClick={() => prefixarLinha('## ')} title="Subtítulo">H2</button>
                <button type="button" onClick={() => prefixarLinha('### ')} title="Subtítulo menor">H3</button>
                <span className="sep" />
                <button type="button" onClick={() => envolver('**')} title="Negrito">B</button>
                <button type="button" onClick={() => envolver('*')} title="Itálico"><i>I</i></button>
                <button type="button" onClick={inserirLink} title="Link">Link</button>
                <span className="sep" />
                <button type="button" onClick={() => prefixarLinha('- ')} title="Lista">• Lista</button>
                <button type="button" onClick={() => prefixarLinha('1. ')} title="Lista numerada">1. Lista</button>
                <button type="button" onClick={() => prefixarLinha('> ')} title="Citação">“ ”</button>
                <label className="botao-texto" style={{ padding: '6px 10px', cursor: 'pointer', color: 'var(--texto-suave)', fontWeight: 600, fontSize: '0.86rem' }}>
                  Imagem
                  <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && enviarImagem(e.target.files[0], 'corpo')} />
                </label>
                <div className="abas">
                  <button type="button" aria-pressed={aba === 'escrever'} onClick={() => setAba('escrever')}>Escrever</button>
                  <button type="button" aria-pressed={aba === 'previa'} onClick={() => setAba('previa')}>Prévia</button>
                </div>
              </div>
              <textarea
                id="corpo"
                ref={textoRef}
                name="corpo"
                className="editor-texto"
                value={corpo}
                onChange={(e) => setCorpo(e.target.value)}
                hidden={aba !== 'escrever'}
                placeholder={'Comece com a resposta direta, nas duas primeiras frases.\n\n## Subtítulo em forma de pergunta?\n\nTexto...'}
              />
              {aba === 'previa' && <div className="editor-previa prosa" dangerouslySetInnerHTML={{ __html: previa }} />}
            </div>
            <span className="ajuda">
              Use ## para subtítulos, **negrito**, [texto](endereço) para links. Links para páginas do site começam com /, por exemplo /ferramentas.
            </span>
          </div>

          <div className="painel">
            <h2>Perguntas frequentes</h2>
            <p className="ajuda" style={{ fontSize: '0.86rem', color: 'var(--texto-fraco)' }}>
              Aparecem no fim do artigo e viram dados estruturados para o Google e para as IAs. De 3 a 5 perguntas é o ideal.
            </p>
            {faq.map((item, i) => (
              <div key={i} className="faq-item">
                <input
                  type="text"
                  aria-label={`Pergunta ${i + 1}`}
                  placeholder="Pergunta"
                  value={item.pergunta}
                  onChange={(e) => setFaq(faq.map((f, j) => (j === i ? { ...f, pergunta: e.target.value } : f)))}
                />
                <textarea
                  rows={2}
                  aria-label={`Resposta ${i + 1}`}
                  placeholder="Resposta curta e direta"
                  value={item.resposta}
                  onChange={(e) => setFaq(faq.map((f, j) => (j === i ? { ...f, resposta: e.target.value } : f)))}
                />
                {faq.length > 1 && (
                  <button type="button" className="botao-texto botao-perigo" style={{ justifySelf: 'start' }} onClick={() => setFaq(faq.filter((_, j) => j !== i))}>
                    Remover pergunta
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="botao botao-secundario botao-pequeno" style={{ justifySelf: 'start' }} onClick={() => setFaq([...faq, { pergunta: '', resposta: '' }])}>
              + Adicionar pergunta
            </button>
          </div>

          <div className="painel">
            <h2>Como aparece no Google</h2>
            <div className="serp">
              <div className="serp-url">tiagogaze.com.br › blog › {slugFinal || '...'}</div>
              <div className="serp-titulo">{titulo || 'Título do artigo'} · Tiago Azevedo</div>
              <div className="serp-desc">{resumo || 'O resumo aparece aqui. Escreva a resposta direta em até 160 caracteres.'}</div>
            </div>
          </div>
        </div>

        <aside className="lateral">
          <div className="painel">
            <h2>Publicação</h2>
            <div className="campo">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value as StatusArtigo)}>
                <option value="rascunho">Rascunho</option>
                <option value="agendado">Agendado</option>
                <option value="publicado">Publicado</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="publicado_em">Data de publicação</label>
              <input id="publicado_em" name="publicado_em" type="datetime-local" defaultValue={paraDataLocal(artigo?.publicado_em) || dataInicial} />
              <span className="ajuda">Horário de Brasília. Em branco, publica agora.</span>
            </div>
            <BotaoSalvar status={status} />
            {artigo && artigo.status !== 'rascunho' && (
              <a href={`/blog/${artigo.slug}`} target="_blank" rel="noopener" className="botao-texto" style={{ textAlign: 'center' }}>
                Ver no site ↗
              </a>
            )}
          </div>

          <div className="painel">
            <h2>Organização</h2>
            <div className="campo">
              <label htmlFor="editoria_id">Editoria</label>
              <select id="editoria_id" name="editoria_id" defaultValue={artigo?.editoria_id || ''}>
                <option value="">Sem editoria</option>
                {editorias.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                    {e.ativa ? '' : ' (inativa)'}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="tags">Tags</label>
              <input id="tags" name="tags" type="text" defaultValue={artigo?.tags.join(', ')} placeholder="WhatsApp, atendimento, IA" />
              <span className="ajuda">Separe por vírgula.</span>
            </div>
          </div>

          <div className="painel">
            <h2>SEO</h2>
            <div className="campo">
              <label htmlFor="palavra_chave">Palavra-chave principal</label>
              <input id="palavra_chave" name="palavra_chave" type="text" value={palavraChave} onChange={(e) => setPalavraChave(e.target.value)} placeholder="agente de IA para WhatsApp" />
            </div>
            <div className="campo">
              <label htmlFor="palavras_secundarias">Palavras-chave secundárias</label>
              <input id="palavras_secundarias" name="palavras_secundarias" type="text" defaultValue={artigo?.palavras_secundarias.join(', ')} placeholder="chatbot, atendimento automático" />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>
                Checagem: {nota} de {checagens.length}
              </span>
              {checagens.map((c) => (
                <span key={c.texto} style={{ fontSize: '0.82rem', color: c.ok ? 'var(--verde)' : 'var(--texto-fraco)' }}>
                  {c.ok ? '✓' : '○'} {c.texto}
                </span>
              ))}
            </div>
          </div>

          <div className="painel">
            <h2>Imagem de capa</h2>
            {capaUrl ? (
              <div className="capa-previa">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={capaUrl} alt={capaAlt} />
              </div>
            ) : (
              <p className="ajuda" style={{ fontSize: '0.86rem', color: 'var(--texto-fraco)' }}>
                Sem capa, o site usa um fundo com o nome da editoria. Tamanho ideal: 1600 × 900 px, até 4 MB.
              </p>
            )}
            <label className="botao botao-secundario botao-pequeno" style={{ cursor: 'pointer' }}>
              {enviandoImagem ? 'Enviando...' : capaUrl ? 'Trocar imagem' : 'Enviar imagem'}
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && enviarImagem(e.target.files[0], 'capa')} />
            </label>
            {capaUrl && (
              <button type="button" className="botao-texto botao-perigo" onClick={() => setCapaUrl('')}>
                Remover capa
              </button>
            )}
            {erroImagem && <p className="aviso aviso-erro">{erroImagem}</p>}
            <div className="campo">
              <label htmlFor="capa_alt">Texto alternativo</label>
              <input id="capa_alt" name="capa_alt" type="text" value={capaAlt} onChange={(e) => setCapaAlt(e.target.value)} placeholder="Descreva o que aparece na imagem" />
            </div>
          </div>

          {outros.length > 0 && (
            <div className="painel">
              <h2>Artigos relacionados</h2>
              <div className="checkbox-lista">
                {outros.map((o) => (
                  <label key={o.id}>
                    <input type="checkbox" name="relacionados" value={o.id} defaultChecked={artigo?.relacionados.includes(o.id)} />
                    {o.titulo}
                  </label>
                ))}
              </div>
              <span className="ajuda">Sem escolha, o site mostra os mais recentes da mesma editoria.</span>
            </div>
          )}
        </aside>
      </form>

      {artigo && (
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--borda)' }}>
          {!confirmandoExclusao ? (
            <button type="button" className="botao-texto botao-perigo" onClick={() => setConfirmandoExclusao(true)}>
              Excluir este artigo
            </button>
          ) : (
            <form action={excluirArtigo} className="linha-acoes">
              <input type="hidden" name="id" value={artigo.id} />
              <span style={{ color: 'var(--texto-suave)' }}>O artigo some do site e não dá para desfazer.</span>
              <button type="submit" className="botao botao-secundario botao-pequeno" style={{ borderColor: 'var(--vermelho)', color: 'var(--vermelho)' }}>
                Excluir de vez
              </button>
              <button type="button" className="botao-texto" onClick={() => setConfirmandoExclusao(false)}>
                Cancelar
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
