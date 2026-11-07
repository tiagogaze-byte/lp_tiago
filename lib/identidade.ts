import { cache } from 'react';
import { SITE } from '@/content/site';
import { bancoConfigurado, umaLinha, CLIENTE_PADRAO } from './db';
import { temaPorId, type Tema } from './temas';

// Identidade do site: nome, assinatura, logo e tema de cor.
// Vem do cadastro do cliente; sem banco (ou antes da configuração), usa os dados fixos do site.

export type Identidade = { nome: string; slogan: string; logoUrl: string | null; tema: Tema };

const PADRAO: Identidade = { nome: SITE.nome, slogan: SITE.assinatura, logoUrl: null, tema: temaPorId(null) };

type Linha = { nome: string; tema: string; slogan?: string; logo_url?: string | null };

export const identidadeDoSite = cache(async (): Promise<Identidade> => {
  if (!bancoConfigurado()) return PADRAO;
  try {
    const linha = await umaLinha<Linha>('select nome, tema, slogan, logo_url from clientes where slug = $1', [CLIENTE_PADRAO]);
    if (!linha) return PADRAO;
    return {
      nome: linha.nome || PADRAO.nome,
      slogan: linha.slogan || PADRAO.slogan,
      logoUrl: linha.logo_url || null,
      tema: temaPorId(linha.tema),
    };
  } catch {
    // Banco ainda sem as colunas novas: o painel cria na primeira vez que a Aparência for salva.
    try {
      const linha = await umaLinha<Linha>('select nome, tema from clientes where slug = $1', [CLIENTE_PADRAO]);
      if (linha) return { ...PADRAO, nome: linha.nome || PADRAO.nome, tema: temaPorId(linha.tema) };
    } catch {}
    return PADRAO;
  }
});
