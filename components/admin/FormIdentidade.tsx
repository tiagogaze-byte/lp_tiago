'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { salvarIdentidade, type Resultado } from '@/app/admin/acoes';
import { FONTES, variaveisDoTema, type Tema } from '@/lib/temas';
import { iconeSvg } from '@/lib/icone';

type Inicial = {
  nome: string;
  slogan: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  iconeFixo: string | null; // ícone padrão que não é gerado (o "t." do Tiago)
  tema: string;
  fonte: string;
  whatsapp: string;
  telefone: string;
  email: string;
  cidade: string;
  registro: string;
  blog: boolean;
};

function Enviar() {
  const { pending } = useFormStatus();
  return (
    <button className="botao botao-primario" type="submit" disabled={pending}>
      {pending ? 'Salvando...' : 'Salvar'}
    </button>
  );
}

export function FormIdentidade({ temas, inicial }: { temas: Tema[]; inicial: Inicial }) {
  const [estado, acao] = useFormState<Resultado | null, FormData>(salvarIdentidade, null);
  const [nome, setNome] = useState(inicial.nome);
  const [slogan, setSlogan] = useState(inicial.slogan);
  const [logoUrl, setLogoUrl] = useState(inicial.logoUrl || '');
  const [temaId, setTemaId] = useState(inicial.tema);
  const [fonteId, setFonteId] = useState(inicial.fonte);
  const [faviconUrl, setFaviconUrl] = useState(inicial.faviconUrl || '');
  const [enviando, setEnviando] = useState<'' | 'logo' | 'favicon'>('');
  const [erro, setErro] = useState<{ campo: string; texto: string } | null>(null);

  const tema = temas.find((t) => t.id === temaId) || temas[0];
  const fonte = FONTES.find((f) => f.id === fonteId) || FONTES[0];

  async function enviarImagem(arquivo: File, campo: 'logo' | 'favicon') {
    setErro(null);
    setEnviando(campo);
    const dados = new FormData();
    dados.append('arquivo', arquivo);
    dados.append('nome', campo);
    try {
      const resposta = await fetch('/api/upload', { method: 'POST', body: dados });
      const json = (await resposta.json()) as { url?: string; erro?: string };
      if (!resposta.ok || !json.url) setErro({ campo, texto: json.erro || 'Não foi possível enviar a imagem.' });
      else if (campo === 'logo') setLogoUrl(json.url);
      else setFaviconUrl(json.url);
    } catch {
      setErro({ campo, texto: 'Não foi possível enviar a imagem. Confira sua conexão e tente de novo.' });
    } finally {
      setEnviando('');
    }
  }

  // O que vai aparecer na aba do navegador.
  const iconeAtual = faviconUrl || inicial.iconeFixo || `data:image/svg+xml;utf8,${encodeURIComponent(iconeSvg(nome || 'S', tema, fonteId))}`;

  return (
    <form action={acao} className="aparencia">
      <input type="hidden" name="tema" value={temaId} />
      <input type="hidden" name="fonte" value={fonteId} />
      <input type="hidden" name="logo_url" value={logoUrl} />
      <input type="hidden" name="favicon_url" value={faviconUrl} />

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
              Logo <small>opcional · PNG ou WebP com fundo transparente, na horizontal</small>
            </label>
            <div className="linha-acoes" style={{ justifyContent: 'flex-start' }}>
              <input
                id="logo"
                type="file"
                accept="image/png,image/webp,image/jpeg,image/avif,image/gif"
                disabled={Boolean(enviando)}
                onChange={(e) => e.target.files?.[0] && enviarImagem(e.target.files[0], 'logo')}
              />
              {logoUrl && (
                <button type="button" className="botao-texto" onClick={() => setLogoUrl('')}>
                  Tirar logo e usar o nome
                </button>
              )}
            </div>
            {enviando === 'logo' && <small>Enviando a logo...</small>}
            {erro?.campo === 'logo' && <small style={{ color: 'var(--vermelho)' }}>{erro.texto}</small>}
          </div>
          <div className="campo">
            <label htmlFor="favicon">
              Ícone da aba <small>opcional · imagem quadrada, 512 × 512 px · sem enviar, usa a inicial nas cores do tema</small>
            </label>
            <div className="linha-acoes" style={{ justifyContent: 'flex-start' }}>
              <span className="icone-previa" aria-label="Prévia do ícone na aba">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconeAtual} alt="" width={20} height={20} />
                <span>{nome || 'Seu site'}</span>
              </span>
              <input
                id="favicon"
                type="file"
                accept="image/png,image/webp,image/jpeg,image/avif"
                disabled={Boolean(enviando)}
                onChange={(e) => e.target.files?.[0] && enviarImagem(e.target.files[0], 'favicon')}
              />
              {faviconUrl && (
                <button type="button" className="botao-texto" onClick={() => setFaviconUrl('')}>
                  Voltar ao ícone automático
                </button>
              )}
            </div>
            {enviando === 'favicon' && <small>Enviando o ícone...</small>}
            {erro?.campo === 'favicon' && <small style={{ color: 'var(--vermelho)' }}>{erro.texto}</small>}
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

        <section className="painel" style={{ gap: 14 }}>
          <h2 className="aparencia-subtitulo">Fonte dos títulos</h2>
          <div className="temas" role="radiogroup" aria-label="Fonte dos títulos">
            {FONTES.map((f) => (
              <button key={f.id} type="button" role="radio" aria-checked={f.id === fonteId} className="tema-opcao" onClick={() => setFonteId(f.id)}>
                <span className="tema-amostra fonte-amostra" style={{ fontFamily: f.titulo }}>
                  Aa
                </span>
                <span className="tema-nome">
                  {f.nome}
                  <small>{f.descricao}</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="painel" style={{ gap: 14 }}>
          <h2 className="aparencia-subtitulo">Contato</h2>
          <p className="ajuda">Aparece no cabeçalho, no rodapé, nos botões de WhatsApp e no bloco de contato das páginas. Campo vazio não aparece no site.</p>
          <div className="grade grade-2" style={{ gap: 14 }}>
            <div className="campo">
              <label htmlFor="whatsapp">WhatsApp <small>com DDD</small></label>
              <input id="whatsapp" name="whatsapp" type="tel" inputMode="tel" defaultValue={inicial.whatsapp} placeholder="(31) 99999-0000" />
            </div>
            <div className="campo">
              <label htmlFor="telefone">Telefone fixo <small>opcional</small></label>
              <input id="telefone" name="telefone" type="tel" defaultValue={inicial.telefone} placeholder="(31) 3333-0000" />
            </div>
            <div className="campo">
              <label htmlFor="email">E-mail de contato</label>
              <input id="email" name="email" type="email" defaultValue={inicial.email} />
            </div>
            <div className="campo">
              <label htmlFor="cidade">Cidade <small>opcional</small></label>
              <input id="cidade" name="cidade" type="text" defaultValue={inicial.cidade} placeholder="Belo Horizonte (MG)" />
            </div>
          </div>
          <div className="campo">
            <label htmlFor="registro">Registro profissional <small>opcional · ex.: CRP 04/44138, OAB/MG 123.456, CRM 12345</small></label>
            <input id="registro" name="registro" type="text" defaultValue={inicial.registro} />
          </div>
          <label className="caixa">
            <input type="checkbox" name="blog" defaultChecked={inicial.blog} /> Mostrar o blog no site
          </label>
        </section>

        <div className="linha-acoes" style={{ justifyContent: 'flex-start' }}>
          <Enviar />
          {estado && <span className={`aviso ${estado.ok ? 'aviso-ok' : 'aviso-erro'}`}>{estado.mensagem}</span>}
        </div>
      </div>

      <aside className="aparencia-previa" aria-label="Prévia do site">
        <small className="aparencia-rotulo">Prévia</small>
        <div className="previa-site" style={{ ...variaveisDoTema(tema), '--fonte-titulo': fonte.titulo } as React.CSSProperties}>
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
