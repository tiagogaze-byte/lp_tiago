'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { excluirPagina, salvarPagina, type Resultado } from '@/app/admin/acoes';
import type { Bloco, ItemCartao, Pagina, TipoBloco } from '@/lib/tipos';

// Editor de página em blocos: cada bloco é uma faixa do site, de cima para baixo.

const NOMES: Record<TipoBloco, { nome: string; dica: string }> = {
  topo: { nome: 'Topo', dica: 'Título grande, texto, botões e foto' },
  cartoes: { nome: 'Cartões', dica: 'Serviços, diferenciais ou etapas lado a lado' },
  texto: { nome: 'Texto', dica: 'Parágrafos livres, com imagem opcional' },
  citacao: { nome: 'Citação', dica: 'Uma frase em destaque' },
  contato: { nome: 'Contato', dica: 'WhatsApp, telefone e e-mail da Identidade' },
  chamada: { nome: 'Chamada', dica: 'Convite final com um botão' },
};

const novoId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

function blocoNovo(tipo: TipoBloco): Bloco {
  const id = novoId();
  switch (tipo) {
    case 'topo':
      return { id, tipo, rotulo: '', titulo: '', destaque: '', texto: '', imagem_url: '', imagem_alt: '', botao_texto: '', botao_link: '', botao2_texto: '', botao2_link: '' };
    case 'cartoes':
      return { id, tipo, rotulo: '', titulo: '', texto: '', numerados: false, itens: [{ titulo: '', texto: '' }, { titulo: '', texto: '' }, { titulo: '', texto: '' }] };
    case 'texto':
      return { id, tipo, rotulo: '', titulo: '', corpo: '', imagem_url: '', imagem_alt: '' };
    case 'citacao':
      return { id, tipo, texto: '', autor: '' };
    case 'contato':
      return { id, tipo, rotulo: 'Contato', titulo: 'Vamos conversar?', texto: '' };
    case 'chamada':
      return { id, tipo, titulo: '', texto: '', botao_texto: 'Falar no WhatsApp', botao_link: 'whatsapp' };
  }
}

function resumo(b: Bloco) {
  if (b.tipo === 'citacao') return b.texto;
  if (b.tipo === 'cartoes') return `${b.titulo || 'Sem título'} · ${b.itens.length} cartão(ões)`;
  return b.titulo || 'Sem título';
}

function Salvar() {
  const { pending } = useFormStatus();
  return (
    <button className="botao botao-primario" type="submit" disabled={pending} style={{ width: '100%' }}>
      {pending ? 'Salvando...' : 'Salvar página'}
    </button>
  );
}

function Campo({
  id,
  rotulo,
  valor,
  aoMudar,
  dica,
  linhas,
  marcador,
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  dica?: string;
  linhas?: number;
  marcador?: string;
}) {
  return (
    <div className="campo">
      <label htmlFor={id}>
        {rotulo} {dica && <small>{dica}</small>}
      </label>
      {linhas ? (
        <textarea id={id} rows={linhas} value={valor} placeholder={marcador} onChange={(e) => aoMudar(e.target.value)} />
      ) : (
        <input id={id} type="text" value={valor} placeholder={marcador} onChange={(e) => aoMudar(e.target.value)} />
      )}
    </div>
  );
}

const DICA_LINK = 'whatsapp, /sobre ou site externo';

function Imagem({ id, url, alt, aoMudar }: { id: string; url: string; alt: string; aoMudar: (url: string, alt: string) => void }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  async function enviar(arquivo: File) {
    setErro('');
    setEnviando(true);
    const dados = new FormData();
    dados.append('arquivo', arquivo);
    dados.append('nome', arquivo.name.replace(/\.[^.]+$/, ''));
    try {
      const resposta = await fetch('/api/upload', { method: 'POST', body: dados });
      const json = (await resposta.json()) as { url?: string; erro?: string };
      if (!resposta.ok || !json.url) setErro(json.erro || 'Não foi possível enviar a imagem.');
      else aoMudar(json.url, alt);
    } catch {
      setErro('Não foi possível enviar a imagem. Confira sua conexão e tente de novo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="bloco-imagem">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" />
      ) : (
        <span className="bloco-imagem-vazia">Sem imagem</span>
      )}
      <div style={{ display: 'grid', gap: 10, flex: 1, minWidth: 0 }}>
        <div className="campo">
          <label htmlFor={`${id}-arquivo`}>
            Imagem <small>JPG, PNG ou WebP até 4 MB</small>
          </label>
          <input id={`${id}-arquivo`} type="file" accept="image/png,image/jpeg,image/webp,image/avif" disabled={enviando} onChange={(e) => e.target.files?.[0] && enviar(e.target.files[0])} />
          {enviando && <small>Enviando...</small>}
          {erro && <small style={{ color: 'var(--vermelho)' }}>{erro}</small>}
        </div>
        {url && (
          <>
            <Campo id={`${id}-alt`} rotulo="Descrição da imagem" dica="para Google e leitores de tela" valor={alt} aoMudar={(v) => aoMudar(url, v)} />
            <button type="button" className="botao-texto" style={{ justifySelf: 'start' }} onClick={() => aoMudar('', '')}>
              Tirar imagem
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function EditorBloco({ bloco, mudar }: { bloco: Bloco; mudar: (b: Bloco) => void }) {
  const id = bloco.id;

  switch (bloco.tipo) {
    case 'topo':
      return (
        <>
          <Campo id={`${id}-rotulo`} rotulo="Rótulo" dica="pequeno, acima do título" valor={bloco.rotulo} aoMudar={(v) => mudar({ ...bloco, rotulo: v })} marcador="Psicologia clínica" />
          <div className="grade grade-2" style={{ gap: 14 }}>
            <Campo id={`${id}-titulo`} rotulo="Título" valor={bloco.titulo} aoMudar={(v) => mudar({ ...bloco, titulo: v })} />
            <Campo id={`${id}-destaque`} rotulo="Continuação colorida" dica="opcional" valor={bloco.destaque} aoMudar={(v) => mudar({ ...bloco, destaque: v })} />
          </div>
          <Campo id={`${id}-texto`} rotulo="Texto" valor={bloco.texto} linhas={3} aoMudar={(v) => mudar({ ...bloco, texto: v })} />
          <div className="grade grade-2" style={{ gap: 14 }}>
            <Campo id={`${id}-b1`} rotulo="Botão principal" valor={bloco.botao_texto} aoMudar={(v) => mudar({ ...bloco, botao_texto: v })} marcador="Entrar em contato" />
            <Campo id={`${id}-b1l`} rotulo="Leva para" dica={DICA_LINK} valor={bloco.botao_link} aoMudar={(v) => mudar({ ...bloco, botao_link: v })} marcador="whatsapp" />
            <Campo id={`${id}-b2`} rotulo="Segundo botão" dica="opcional" valor={bloco.botao2_texto} aoMudar={(v) => mudar({ ...bloco, botao2_texto: v })} />
            <Campo id={`${id}-b2l`} rotulo="Leva para" dica={DICA_LINK} valor={bloco.botao2_link} aoMudar={(v) => mudar({ ...bloco, botao2_link: v })} />
          </div>
          <Imagem id={id} url={bloco.imagem_url} alt={bloco.imagem_alt} aoMudar={(url, alt) => mudar({ ...bloco, imagem_url: url, imagem_alt: alt })} />
        </>
      );

    case 'cartoes': {
      const mudarItem = (i: number, item: ItemCartao) => mudar({ ...bloco, itens: bloco.itens.map((x, j) => (j === i ? item : x)) });
      return (
        <>
          <div className="grade grade-2" style={{ gap: 14 }}>
            <Campo id={`${id}-rotulo`} rotulo="Rótulo" dica="opcional" valor={bloco.rotulo} aoMudar={(v) => mudar({ ...bloco, rotulo: v })} />
            <Campo id={`${id}-titulo`} rotulo="Título da seção" dica="opcional" valor={bloco.titulo} aoMudar={(v) => mudar({ ...bloco, titulo: v })} />
          </div>
          <Campo id={`${id}-texto`} rotulo="Texto de apoio" dica="opcional" valor={bloco.texto} aoMudar={(v) => mudar({ ...bloco, texto: v })} />
          <label className="caixa">
            <input type="checkbox" checked={bloco.numerados} onChange={(e) => mudar({ ...bloco, numerados: e.target.checked })} /> Numerar os cartões (01, 02, 03)
          </label>
          <div className="bloco-itens">
            {bloco.itens.map((item, i) => (
              <div key={i} className="bloco-item">
                <div className="linha-acoes">
                  <strong style={{ fontSize: '0.85rem' }}>Cartão {i + 1}</strong>
                  <button type="button" className="botao-texto" onClick={() => mudar({ ...bloco, itens: bloco.itens.filter((_, j) => j !== i) })}>
                    Remover
                  </button>
                </div>
                <Campo id={`${id}-i${i}t`} rotulo="Título" valor={item.titulo} aoMudar={(v) => mudarItem(i, { ...item, titulo: v })} />
                <Campo id={`${id}-i${i}x`} rotulo="Texto" valor={item.texto} linhas={3} aoMudar={(v) => mudarItem(i, { ...item, texto: v })} />
              </div>
            ))}
          </div>
          {bloco.itens.length < 12 && (
            <button type="button" className="botao botao-secundario botao-pequeno" style={{ justifySelf: 'start' }} onClick={() => mudar({ ...bloco, itens: [...bloco.itens, { titulo: '', texto: '' }] })}>
              + Cartão
            </button>
          )}
        </>
      );
    }

    case 'texto':
      return (
        <>
          <div className="grade grade-2" style={{ gap: 14 }}>
            <Campo id={`${id}-rotulo`} rotulo="Rótulo" dica="opcional" valor={bloco.rotulo} aoMudar={(v) => mudar({ ...bloco, rotulo: v })} />
            <Campo id={`${id}-titulo`} rotulo="Título" dica="opcional" valor={bloco.titulo} aoMudar={(v) => mudar({ ...bloco, titulo: v })} />
          </div>
          <Campo
            id={`${id}-corpo`}
            rotulo="Texto"
            dica="linha em branco separa parágrafos · **negrito** · [link](https://...) · - lista"
            valor={bloco.corpo}
            linhas={8}
            aoMudar={(v) => mudar({ ...bloco, corpo: v })}
          />
          <Imagem id={id} url={bloco.imagem_url} alt={bloco.imagem_alt} aoMudar={(url, alt) => mudar({ ...bloco, imagem_url: url, imagem_alt: alt })} />
        </>
      );

    case 'citacao':
      return (
        <>
          <Campo id={`${id}-texto`} rotulo="Frase" dica="sem aspas, elas entram sozinhas" valor={bloco.texto} linhas={2} aoMudar={(v) => mudar({ ...bloco, texto: v })} />
          <Campo id={`${id}-autor`} rotulo="Autor" dica="opcional" valor={bloco.autor} aoMudar={(v) => mudar({ ...bloco, autor: v })} />
        </>
      );

    case 'contato':
      return (
        <>
          <div className="grade grade-2" style={{ gap: 14 }}>
            <Campo id={`${id}-rotulo`} rotulo="Rótulo" dica="opcional" valor={bloco.rotulo} aoMudar={(v) => mudar({ ...bloco, rotulo: v })} />
            <Campo id={`${id}-titulo`} rotulo="Título" valor={bloco.titulo} aoMudar={(v) => mudar({ ...bloco, titulo: v })} />
          </div>
          <Campo id={`${id}-texto`} rotulo="Texto" dica="opcional" valor={bloco.texto} aoMudar={(v) => mudar({ ...bloco, texto: v })} />
          <p className="ajuda">WhatsApp, telefone, e-mail, registro e cidade vêm da tela Identidade.</p>
        </>
      );

    case 'chamada':
      return (
        <>
          <Campo id={`${id}-titulo`} rotulo="Título" valor={bloco.titulo} aoMudar={(v) => mudar({ ...bloco, titulo: v })} />
          <Campo id={`${id}-texto`} rotulo="Texto" dica="opcional" valor={bloco.texto} linhas={2} aoMudar={(v) => mudar({ ...bloco, texto: v })} />
          <div className="grade grade-2" style={{ gap: 14 }}>
            <Campo id={`${id}-b1`} rotulo="Botão" valor={bloco.botao_texto} aoMudar={(v) => mudar({ ...bloco, botao_texto: v })} />
            <Campo id={`${id}-b1l`} rotulo="Leva para" dica={DICA_LINK} valor={bloco.botao_link} aoMudar={(v) => mudar({ ...bloco, botao_link: v })} />
          </div>
        </>
      );
  }
}

export function FormPagina({ pagina, nova }: { pagina: Pagina; nova?: boolean }) {
  const [estado, acao] = useFormState<Resultado | null, FormData>(salvarPagina, null);
  const [blocos, setBlocos] = useState<Bloco[]>(pagina.blocos);
  const [aberto, setAberto] = useState<string | null>(nova ? pagina.blocos[0]?.id || null : null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const home = pagina.slug === 'inicio';

  const mover = (i: number, passo: number) =>
    setBlocos((lista) => {
      const j = i + passo;
      if (j < 0 || j >= lista.length) return lista;
      const copia = [...lista];
      [copia[i], copia[j]] = [copia[j], copia[i]];
      return copia;
    });

  const adicionar = (tipo: TipoBloco) => {
    const b = blocoNovo(tipo);
    setBlocos((lista) => [...lista, b]);
    setAberto(b.id);
  };

  return (
    <form action={acao} className="editor-pagina">
      <input type="hidden" name="id" value={pagina.id} />
      <input type="hidden" name="blocos" value={JSON.stringify(blocos)} />

      <div className="editor-blocos">
        {blocos.length === 0 && <p className="vazio">Esta página ainda não tem blocos. Escolha um abaixo para começar.</p>}
        {blocos.map((bloco, i) => {
          const estaAberto = aberto === bloco.id;
          return (
            <section key={bloco.id} className={`painel bloco-editor${estaAberto ? ' aberto' : ''}`}>
              <div className="bloco-cabeca">
                <button type="button" className="bloco-titulo" onClick={() => setAberto(estaAberto ? null : bloco.id)} aria-expanded={estaAberto}>
                  <span className="bloco-tipo">{NOMES[bloco.tipo].nome}</span>
                  <span className="bloco-resumo">{resumo(bloco)}</span>
                </button>
                <div className="bloco-acoes">
                  <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Subir bloco" title="Subir">
                    ↑
                  </button>
                  <button type="button" onClick={() => mover(i, 1)} disabled={i === blocos.length - 1} aria-label="Descer bloco" title="Descer">
                    ↓
                  </button>
                  <button type="button" onClick={() => setBlocos((l) => l.filter((b) => b.id !== bloco.id))} aria-label="Remover bloco" title="Remover">
                    ✕
                  </button>
                </div>
              </div>
              {estaAberto && (
                <div className="bloco-corpo">
                  <EditorBloco bloco={bloco} mudar={(novo) => setBlocos((l) => l.map((b) => (b.id === novo.id ? novo : b)))} />
                </div>
              )}
            </section>
          );
        })}

        <div className="painel" style={{ gap: 12 }}>
          <strong style={{ fontSize: '0.95rem' }}>Adicionar bloco</strong>
          <div className="bloco-novos">
            {(Object.keys(NOMES) as TipoBloco[]).map((tipo) => (
              <button key={tipo} type="button" className="bloco-novo" onClick={() => adicionar(tipo)}>
                <strong>{NOMES[tipo].nome}</strong>
                <small>{NOMES[tipo].dica}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="editor-lateral">
        <div className="painel" style={{ gap: 14 }}>
          <div className="campo">
            <label htmlFor="titulo">Nome da página <small>aparece no menu</small></label>
            <input id="titulo" name="titulo" type="text" defaultValue={pagina.titulo} required />
          </div>
          <div className="campo">
            <label htmlFor="slug">Endereço</label>
            {home ? (
              <input id="slug" type="text" value="/ (página inicial)" disabled />
            ) : (
              <input id="slug" name="slug" type="text" defaultValue={pagina.slug} />
            )}
          </div>
          <div className="campo">
            <label htmlFor="descricao">Descrição para o Google <small>até 160 caracteres</small></label>
            <textarea id="descricao" name="descricao" rows={3} maxLength={300} defaultValue={pagina.descricao} />
          </div>
          <div className="linha-acoes" style={{ justifyContent: 'flex-start', gap: 16 }}>
            <label className="caixa">
              <input type="checkbox" name="no_menu" defaultChecked={pagina.no_menu} /> No menu
            </label>
            <div className="campo" style={{ width: 90 }}>
              <label htmlFor="ordem">Posição</label>
              <input id="ordem" name="ordem" type="number" defaultValue={pagina.ordem} />
            </div>
          </div>
          {!home && (
            <label className="caixa">
              <input type="checkbox" name="publicada" defaultChecked={pagina.publicada} /> No ar
            </label>
          )}
          <Salvar />
          {estado && <p className={`aviso ${estado.ok ? 'aviso-ok' : 'aviso-erro'}`}>{estado.mensagem}</p>}
          <a className="botao botao-secundario botao-pequeno" href={home ? '/' : `/${pagina.slug}`} target="_blank" rel="noopener">
            Ver no site ↗
          </a>
        </div>
        {!home &&
          (confirmarExclusao ? (
            <div className="painel" style={{ gap: 10 }}>
              <p style={{ margin: 0 }}>Excluir esta página? Não dá para desfazer.</p>
              <div className="linha-acoes" style={{ justifyContent: 'flex-start' }}>
                <button className="botao botao-pequeno botao-perigo" type="submit" formAction={excluirPagina} formNoValidate>
                  Excluir
                </button>
                <button type="button" className="botao-texto" onClick={() => setConfirmarExclusao(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="botao-texto" style={{ color: 'var(--vermelho)', justifySelf: 'start' }} onClick={() => setConfirmarExclusao(true)}>
              Excluir página
            </button>
          ))}
      </aside>
    </form>
  );
}
