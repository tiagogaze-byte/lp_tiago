'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { salvarAparencia, type Resultado } from '@/app/admin/acoes';
import { variaveisDoTema, type Tema } from '@/lib/temas';

type Inicial = { nome: string; slogan: string; logoUrl: string | null; tema: string };

function Enviar() {
  const { pending } = useFormStatus();
  return (
    <button className="botao botao-primario" type="submit" disabled={pending}>
      {pending ? 'Salvando...' : 'Salvar aparência'}
    </button>
  );
}

export function FormAparencia({ temas, inicial }: { temas: Tema[]; inicial: Inicial }) {
  const [estado, acao] = useFormState<Resultado | null, FormData>(salvarAparencia, null);
  const [nome, setNome] = useState(inicial.nome);
  const [slogan, setSlogan] = useState(inicial.slogan);
  const [logoUrl, setLogoUrl] = useState(inicial.logoUrl || '');
  const [temaId, setTemaId] = useState(inicial.tema);
  const [enviando, setEnviando] = useState(false);
  const [erroLogo, setErroLogo] = useState('');

  const tema = temas.find((t) => t.id === temaId) || temas[0];

  async function enviarLogo(arquivo: File) {
    setErroLogo('');
    setEnviando(true);
    const dados = new FormData();
    dados.append('arquivo', arquivo);
    dados.append('nome', 'logo');
    try {
      const resposta = await fetch('/api/upload', { method: 'POST', body: dados });
      const json = (await resposta.json()) as { url?: string; erro?: string };
      if (!resposta.ok || !json.url) setErroLogo(json.erro || 'Não foi possível enviar a logo.');
      else setLogoUrl(json.url);
    } catch {
      setErroLogo('Não foi possível enviar a logo. Confira sua conexão e tente de novo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form action={acao} className="aparencia">
      <input type="hidden" name="tema" value={temaId} />
      <input type="hidden" name="logo_url" value={logoUrl} />

      <div className="aparencia-campos">
        <section className="painel" style={{ gap: 14 }}>
          <h2 className="aparencia-subtitulo">Identidade</h2>
          <div className="campo">
            <label htmlFor="nome">
              Nome do site <small>{nome.length}/40</small>
            </label>
            <input id="nome" name="nome" type="text" value={nome} maxLength={40} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="campo">
            <label htmlFor="slogan">
              Assinatura <small>aparece no rodapé e no título do Google · {slogan.length}/80</small>
            </label>
            <input id="slogan" name="slogan" type="text" value={slogan} maxLength={80} onChange={(e) => setSlogan(e.target.value)} />
          </div>
          <div className="campo">
            <label htmlFor="logo">
              Logo <small>opcional · PNG ou SVG com fundo transparente, na horizontal</small>
            </label>
            <div className="linha-acoes" style={{ justifyContent: 'flex-start' }}>
              <input
                id="logo"
                type="file"
                accept="image/png,image/webp,image/jpeg,image/avif,image/gif"
                disabled={enviando}
                onChange={(e) => e.target.files?.[0] && enviarLogo(e.target.files[0])}
              />
              {logoUrl && (
                <button type="button" className="botao-texto" onClick={() => setLogoUrl('')}>
                  Tirar logo e usar o nome
                </button>
              )}
            </div>
            {enviando && <small>Enviando a logo...</small>}
            {erroLogo && <small style={{ color: 'var(--vermelho)' }}>{erroLogo}</small>}
          </div>
        </section>

        <section className="painel" style={{ gap: 14 }}>
          <h2 className="aparencia-subtitulo">Cores</h2>
          <div className="temas" role="radiogroup" aria-label="Tema de cores">
            {temas.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={t.id === temaId}
                className="tema-opcao"
                onClick={() => setTemaId(t.id)}
              >
                <span className="tema-amostra" style={{ background: t.fundo }}>
                  <span style={{ background: `linear-gradient(135deg, ${t.destaque}, ${t.destaqueEscuro})` }} />
                </span>
                <span className="tema-nome">
                  {t.nome}
                  <small>{t.modo === 'claro' ? 'Fundo claro' : 'Fundo escuro'}</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="linha-acoes" style={{ justifyContent: 'flex-start' }}>
          <Enviar />
          {estado && <span className={`aviso ${estado.ok ? 'aviso-ok' : 'aviso-erro'}`}>{estado.mensagem}</span>}
        </div>
      </div>

      <aside className="aparencia-previa" aria-label="Prévia do site">
        <small className="aparencia-rotulo">Prévia</small>
        <div className="previa-site" style={variaveisDoTema(tema) as React.CSSProperties}>
          <div className="previa-topo">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="marca-logo" style={{ height: 24 }} />
            ) : (
              <span className="marca">
                {nome || 'Seu nome'}
                <span>.</span>
              </span>
            )}
            <span className="previa-menu">
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="previa-hero">
            <small>{slogan || 'Sua assinatura'}</small>
            <strong>
              Um título forte sobre <em>o que você faz</em>
            </strong>
            <p>Texto de apoio do site, na cor de leitura do tema.</p>
            <span className="previa-botao">Conversar no WhatsApp</span>
          </div>
          <div className="previa-cartoes">
            <span>
              <b />
              Serviço
            </span>
            <span>
              <b />
              Blog
            </span>
          </div>
          <div className="previa-rodape">
            © {new Date().getFullYear()} {nome || 'Seu nome'}
          </div>
        </div>
      </aside>
    </form>
  );
}
