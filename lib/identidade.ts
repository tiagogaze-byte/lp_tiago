import { cache } from 'react';
import { MENU, SITE } from '@/content/site';
import { bancoConfigurado, consulta, umaLinha, CLIENTE_PADRAO } from './db';
import { temaPorId, fontePorId, type Tema } from './temas';
import type { ConfigSite } from './tipos';

// Identidade do site: nome, assinatura, logo, cores, fonte, contato e menu.
// Vem do cadastro do cliente; sem banco (ou antes da configuração), usa os dados fixos do site do Tiago.

export type ItemMenu = { href: string; rotulo: string };

export type Contato = {
  whatsapp: string; // só números
  whatsappExibicao: string;
  telefone: string;
  email: string;
  cidade: string;
  registro: string;
  mensagem: string;
};

export type Identidade = {
  clienteId: string | null;
  nome: string;
  slogan: string;
  logoUrl: string | null;
  tema: Tema;
  fonte: string;
  contato: Contato;
  blogAtivo: boolean;
  usaPaginas: boolean; // true: o site é montado em blocos pelo painel; false: páginas fixas do site do Tiago
  menu: ItemMenu[];
};

const CONTATO_PADRAO: Contato = {
  whatsapp: SITE.whatsapp,
  whatsappExibicao: SITE.whatsappExibicao,
  telefone: '',
  email: SITE.email,
  cidade: SITE.cidade,
  registro: '',
  mensagem: 'Olá, Tiago! Vim pelo site e quero conversar.',
};

const PADRAO: Identidade = {
  clienteId: null,
  nome: SITE.nome,
  slogan: SITE.assinatura,
  logoUrl: null,
  tema: temaPorId(null),
  fonte: 'moderna',
  contato: CONTATO_PADRAO,
  blogAtivo: true,
  usaPaginas: false,
  menu: MENU,
};

// (31) 99950-8400 a partir de 5531999508400
export function formatarWhatsapp(numero: string) {
  const d = numero.replace(/\D/g, '').replace(/^55/, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return numero;
}

function contatoDoConfig(config: ConfigSite, nome: string): Contato {
  // O site do Tiago não tem config salva: continua com os dados fixos.
  if (!config || Object.keys(config).length === 0) return CONTATO_PADRAO;
  const whatsapp = (config.whatsapp || '').replace(/\D/g, '');
  return {
    whatsapp,
    whatsappExibicao: whatsapp ? formatarWhatsapp(whatsapp) : '',
    telefone: config.telefone || '',
    email: config.email || '',
    cidade: config.cidade || '',
    registro: config.registro || '',
    mensagem: config.mensagem_whatsapp || `Olá, ${nome.split(' ')[0]}! Vim pelo site e gostaria de conversar.`,
  };
}

type Linha = { id: string; nome: string; tema: string; slogan: string; logo_url: string | null; fonte: string; config: ConfigSite };

export const identidadeDoSite = cache(async (): Promise<Identidade> => {
  if (!bancoConfigurado()) return PADRAO;
  let linha: Linha | null = null;
  try {
    linha = await umaLinha<Linha>('select id, nome, tema, slogan, logo_url, fonte, config from clientes where slug = $1', [CLIENTE_PADRAO]);
  } catch {
    // Banco ainda sem as colunas novas: o painel cria na próxima vez que a Identidade for salva.
    try {
      const antiga = await umaLinha<{ id: string; nome: string; tema: string }>('select id, nome, tema from clientes where slug = $1', [CLIENTE_PADRAO]);
      if (antiga) return { ...PADRAO, clienteId: antiga.id, nome: antiga.nome || PADRAO.nome, tema: temaPorId(antiga.tema) };
    } catch {}
    return PADRAO;
  }
  if (!linha) return PADRAO;

  const config = linha.config || {};
  const nome = linha.nome || PADRAO.nome;
  const blogAtivo = config.blog !== false;

  let paginas: { slug: string; titulo: string }[] = [];
  try {
    paginas = await consulta<{ slug: string; titulo: string }>(
      'select slug, titulo from paginas where cliente_id = $1 and publicada and no_menu order by ordem, titulo',
      [linha.id],
    );
  } catch {}
  const usaPaginas = paginas.some((p) => p.slug === 'inicio') || (await temHome(linha.id));

  let menu: ItemMenu[] = MENU;
  if (usaPaginas) {
    menu = paginas.map((p) => ({ href: p.slug === 'inicio' ? '/' : `/${p.slug}`, rotulo: p.titulo }));
    if (blogAtivo) {
      const posicaoContato = menu.findIndex((m) => m.href === '/contato');
      menu.splice(posicaoContato >= 0 ? posicaoContato : menu.length, 0, { href: '/blog', rotulo: 'Blog' });
    }
  } else if (!blogAtivo) {
    menu = MENU.filter((m) => m.href !== '/blog');
  }

  return {
    clienteId: linha.id,
    nome,
    slogan: linha.slogan || (usaPaginas ? '' : PADRAO.slogan),
    logoUrl: linha.logo_url || null,
    tema: temaPorId(linha.tema),
    fonte: fontePorId(linha.fonte).id,
    contato: contatoDoConfig(config, nome),
    blogAtivo,
    usaPaginas,
    menu,
  };
});

async function temHome(clienteId: string) {
  try {
    const l = await umaLinha<{ ok: boolean }>("select true as ok from paginas where cliente_id = $1 and slug = 'inicio' and publicada", [clienteId]);
    return Boolean(l);
  } catch {
    return false;
  }
}
