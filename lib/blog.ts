import { ARTIGOS_EXEMPLO, EDITORIAS_EXEMPLO } from '@/content/exemplos';
import { bancoConfigurado, consulta, idDoCliente, umaLinha } from './db';
import type { Artigo, ArtigoComEditoria, Editoria } from './tipos';

// Leitura pública do blog. Sem banco (ou antes da primeira configuração), usa os artigos de exemplo.

const CAMPOS_ARTIGO = `
  a.*,
  to_char(a.publicado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as publicado_em,
  to_char(a.atualizado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as atualizado_em,
  to_char(a.criado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as criado_em,
  case when e.id is null then null else json_build_object(
    'id', e.id, 'nome', e.nome, 'slug', e.slug, 'descricao', e.descricao, 'ordem', e.ordem, 'ativa', e.ativa
  ) end as editoria`;

const VISIVEL = `a.status in ('publicado', 'agendado') and a.publicado_em <= now()`;

async function clienteOuNada() {
  if (!bancoConfigurado()) return null;
  try {
    return await idDoCliente();
  } catch {
    return null; // tabelas ainda não criadas
  }
}

function exemplosOrdenados() {
  return [...ARTIGOS_EXEMPLO].sort((a, b) => (b.publicado_em || '').localeCompare(a.publicado_em || ''));
}

export async function listarEditorias(): Promise<Editoria[]> {
  const cliente = await clienteOuNada();
  if (!cliente) return EDITORIAS_EXEMPLO;
  return consulta<Editoria>('select * from editorias where cliente_id = $1 and ativa order by ordem, nome', [cliente]);
}

export async function listarArtigos(opcoes: { editoriaSlug?: string; tag?: string; limite?: number } = {}): Promise<ArtigoComEditoria[]> {
  const cliente = await clienteOuNada();
  if (!cliente) {
    let lista = exemplosOrdenados();
    if (opcoes.editoriaSlug) lista = lista.filter((a) => a.editoria?.slug === opcoes.editoriaSlug);
    if (opcoes.tag) lista = lista.filter((a) => a.tags.includes(opcoes.tag!));
    return lista.slice(0, opcoes.limite || 100);
  }

  const filtros = ['a.cliente_id = $1', VISIVEL];
  const parametros: unknown[] = [cliente];
  if (opcoes.editoriaSlug) {
    parametros.push(opcoes.editoriaSlug);
    filtros.push(`e.slug = $${parametros.length}`);
  }
  if (opcoes.tag) {
    parametros.push(opcoes.tag);
    filtros.push(`$${parametros.length} = any(a.tags)`);
  }
  parametros.push(opcoes.limite || 100);

  return consulta<ArtigoComEditoria>(
    `select ${CAMPOS_ARTIGO} from artigos a left join editorias e on e.id = a.editoria_id
     where ${filtros.join(' and ')} order by a.publicado_em desc limit $${parametros.length}`,
    parametros,
  );
}

export async function buscarArtigo(slug: string): Promise<ArtigoComEditoria | null> {
  const cliente = await clienteOuNada();
  if (!cliente) return ARTIGOS_EXEMPLO.find((a) => a.slug === slug) || null;
  return umaLinha<ArtigoComEditoria>(
    `select ${CAMPOS_ARTIGO} from artigos a left join editorias e on e.id = a.editoria_id
     where a.cliente_id = $1 and a.slug = $2 and ${VISIVEL}`,
    [cliente, slug],
  );
}

// Relacionados escolhidos no painel; se não houver, os mais recentes da mesma editoria.
export async function buscarRelacionados(artigo: Artigo, limite = 3) {
  const todos = await listarArtigos({ limite: 50 });
  const outros = todos.filter((a) => a.id !== artigo.id);
  const escolhidos = outros.filter((a) => artigo.relacionados.includes(a.id));
  const mesmaEditoria = outros.filter((a) => a.editoria_id === artigo.editoria_id && !escolhidos.includes(a));
  const resto = outros.filter((a) => !escolhidos.includes(a) && !mesmaEditoria.includes(a));
  return [...escolhidos, ...mesmaEditoria, ...resto].slice(0, limite);
}
