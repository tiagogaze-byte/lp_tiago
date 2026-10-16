import { neon, neonConfig } from '@neondatabase/serverless';

// Só para testes locais: aponta o driver para um Postgres de teste.
if (process.env.NEON_FETCH_ENDPOINT) neonConfig.fetchEndpoint = process.env.NEON_FETCH_ENDPOINT;

// A integração Neon da Vercel cria DATABASE_URL automaticamente.
export function bancoConfigurado() {
  return Boolean(process.env.DATABASE_URL);
}

let conexao: ReturnType<typeof neon> | null = null;

export function sql() {
  if (!conexao) conexao = neon(process.env.DATABASE_URL!);
  return conexao;
}

// Consulta com parâmetros posicionais ($1, $2...). Sempre devolve uma lista de linhas.
export async function consulta<T = Record<string, unknown>>(texto: string, parametros: unknown[] = []): Promise<T[]> {
  const linhas = await sql().query(texto, parametros);
  return linhas as unknown as T[];
}

export async function umaLinha<T = Record<string, unknown>>(texto: string, parametros: unknown[] = []): Promise<T | null> {
  const linhas = await consulta<T>(texto, parametros);
  return linhas[0] || null;
}

// O portal do Tiago é o cliente número 1. Quando a plataforma atender vários clientes,
// este valor passa a vir do domínio acessado.
export const CLIENTE_PADRAO = process.env.CLIENTE_SLUG || 'tiagogaze';

let clienteCache: { slug: string; id: string } | null = null;

export async function idDoCliente(slug = CLIENTE_PADRAO): Promise<string | null> {
  if (clienteCache?.slug === slug) return clienteCache.id;
  const linha = await umaLinha<{ id: string }>('select id from clientes where slug = $1', [slug]);
  if (linha) clienteCache = { slug, id: linha.id };
  return linha?.id || null;
}
