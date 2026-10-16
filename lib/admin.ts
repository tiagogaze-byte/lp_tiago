import 'server-only';
import { consulta, umaLinha } from './db';
import type { Artigo, Editoria } from './tipos';

// Leituras do painel. Sempre filtradas pelo cliente da sessão.

const DATAS = `
  to_char(publicado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as publicado_em,
  to_char(atualizado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as atualizado_em,
  to_char(criado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as criado_em`;

export type LinhaPainel = Pick<Artigo, 'id' | 'titulo' | 'slug' | 'status' | 'publicado_em' | 'atualizado_em'> & {
  editoria_nome: string | null;
};

export async function editoriasDoCliente(clienteId: string) {
  return consulta<Editoria>('select * from editorias where cliente_id = $1 order by ordem, nome', [clienteId]);
}

export async function artigosDoCliente(
  clienteId: string,
  filtros: { status?: string; editoria?: string; q?: string } = {},
): Promise<LinhaPainel[]> {
  const condicoes = ['a.cliente_id = $1'];
  const parametros: unknown[] = [clienteId];
  if (filtros.status) {
    parametros.push(filtros.status);
    condicoes.push(`a.status = $${parametros.length}`);
  }
  if (filtros.editoria) {
    parametros.push(filtros.editoria);
    condicoes.push(`a.editoria_id = $${parametros.length}`);
  }
  if (filtros.q) {
    parametros.push(`%${filtros.q}%`);
    condicoes.push(`a.titulo ilike $${parametros.length}`);
  }
  return consulta<LinhaPainel>(
    `select a.id, a.titulo, a.slug, a.status, e.nome as editoria_nome,
       to_char(a.publicado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as publicado_em,
       to_char(a.atualizado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as atualizado_em
     from artigos a left join editorias e on e.id = a.editoria_id
     where ${condicoes.join(' and ')} order by a.atualizado_em desc limit 1000`,
    parametros,
  );
}

export async function contarPorStatus(clienteId: string) {
  const linhas = await consulta<{ status: string; total: number }>(
    'select status, count(*)::int as total from artigos where cliente_id = $1 group by status',
    [clienteId],
  );
  const total = (s: string) => linhas.find((l) => l.status === s)?.total || 0;
  return { publicado: total('publicado'), agendado: total('agendado'), rascunho: total('rascunho') };
}

export async function artigoDoCliente(clienteId: string, id: string) {
  return umaLinha<Artigo>(`select *, ${DATAS} from artigos where cliente_id = $1 and id = $2`, [clienteId, id]);
}

export async function titulosPublicados(clienteId: string, excetoId?: string) {
  return consulta<{ id: string; titulo: string }>(
    `select id, titulo from artigos where cliente_id = $1 and status <> 'rascunho' and id <> coalesce($2::uuid, '00000000-0000-0000-0000-000000000000'::uuid)
     order by publicado_em desc nulls last limit 300`,
    [clienteId, excetoId || null],
  );
}

export type ItemAgenda = { id: string; titulo: string; status: Artigo['status']; publicado_em: string | null; editoria_nome: string | null };

export async function agendaDoMes(clienteId: string, inicio: string, fim: string) {
  return consulta<ItemAgenda>(
    `select a.id, a.titulo, a.status, e.nome as editoria_nome,
       to_char(a.publicado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as publicado_em
     from artigos a left join editorias e on e.id = a.editoria_id
     where a.cliente_id = $1 and a.publicado_em >= $2::timestamptz and a.publicado_em < $3::timestamptz
     order by a.publicado_em`,
    [clienteId, inicio, fim],
  );
}

export async function rascunhosSemData(clienteId: string) {
  return consulta<ItemAgenda>(
    `select a.id, a.titulo, a.status, e.nome as editoria_nome, null as publicado_em
     from artigos a left join editorias e on e.id = a.editoria_id
     where a.cliente_id = $1 and a.status = 'rascunho' and a.publicado_em is null
     order by a.atualizado_em desc limit 50`,
    [clienteId],
  );
}
