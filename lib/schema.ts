// Estrutura do banco. Pronta para vários clientes: toda tabela de conteúdo tem cliente_id.
// Executada pela tela /admin/configurar. Pode rodar de novo: nada é apagado.
export const ESTRUTURA_DO_BANCO: string[] = [
  `create extension if not exists pgcrypto`,
  `create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  dominio text unique,
  tema text not null default 'grafite-laranja',
  situacao text not null default 'ativo' check (situacao in ('ativo', 'suspenso')),
  criado_em timestamptz not null default now()
)`,
  `create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  nome text not null,
  email text not null unique,
  senha_hash text not null,
  perfil text not null default 'admin' check (perfil in ('dono', 'admin', 'editor')),
  criado_em timestamptz not null default now(),
  ultimo_acesso timestamptz
)`,
  `create table if not exists editorias (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  nome text not null,
  slug text not null,
  descricao text not null default '',
  ordem int not null default 0,
  ativa boolean not null default true,
  criado_em timestamptz not null default now(),
  unique (cliente_id, slug)
)`,
  `create table if not exists artigos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  titulo text not null,
  slug text not null,
  resumo text not null default '',
  corpo text not null default '',
  editoria_id uuid references editorias(id) on delete set null,
  tags text[] not null default '{}',
  palavra_chave text not null default '',
  palavras_secundarias text[] not null default '{}',
  capa_url text,
  capa_alt text not null default '',
  faq jsonb not null default '[]'::jsonb,
  relacionados uuid[] not null default '{}',
  status text not null default 'rascunho' check (status in ('rascunho', 'agendado', 'publicado')),
  publicado_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (cliente_id, slug)
)`,
  `create index if not exists artigos_cliente_status_idx on artigos (cliente_id, status, publicado_em desc)`,
  `create index if not exists artigos_editoria_idx on artigos (editoria_id)`,
  `create index if not exists artigos_tags_idx on artigos using gin (tags)`,
  `create index if not exists editorias_cliente_idx on editorias (cliente_id, ordem)`,
];
