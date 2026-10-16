-- =============================================================
-- Portal tiagogaze.com.br — estrutura do banco (Supabase)
-- Rode este arquivo inteiro uma vez no SQL Editor do Supabase.
-- Depois, troque o e-mail na última seção pelo seu login de admin.
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------- Admins ----------
create table if not exists public.admins (
  email text primary key,
  criado_em timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------- Editorias ----------
create table if not exists public.editorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  descricao text not null default '',
  ordem int not null default 0,
  ativa boolean not null default true,
  criado_em timestamptz not null default now()
);

-- ---------- Artigos ----------
create table if not exists public.artigos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text not null unique,
  resumo text not null default '',            -- meta description
  corpo text not null default '',             -- markdown
  editoria_id uuid references public.editorias(id) on delete set null,
  tags text[] not null default '{}',
  palavra_chave text not null default '',
  palavras_secundarias text[] not null default '{}',
  capa_url text,
  capa_alt text not null default '',
  faq jsonb not null default '[]'::jsonb,     -- [{ "pergunta": "...", "resposta": "..." }]
  relacionados uuid[] not null default '{}',
  status text not null default 'rascunho'
    check (status in ('rascunho', 'agendado', 'publicado')),
  publicado_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists artigos_status_data_idx on public.artigos (status, publicado_em desc);
create index if not exists artigos_editoria_idx on public.artigos (editoria_id);
create index if not exists artigos_tags_idx on public.artigos using gin (tags);

create or replace function public.tocar_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists artigos_atualizado_em on public.artigos;
create trigger artigos_atualizado_em
  before update on public.artigos
  for each row execute function public.tocar_atualizado_em();

-- ---------- Segurança (RLS) ----------
alter table public.admins enable row level security;
alter table public.editorias enable row level security;
alter table public.artigos enable row level security;

-- Visitantes: só editorias ativas e artigos publicados (ou agendados cuja data já chegou)
drop policy if exists "editorias publicas" on public.editorias;
create policy "editorias publicas" on public.editorias
  for select using (ativa or public.is_admin());

drop policy if exists "artigos publicos" on public.artigos;
create policy "artigos publicos" on public.artigos
  for select using (
    (status in ('publicado', 'agendado') and publicado_em <= now())
    or public.is_admin()
  );

-- Admin: escreve tudo
drop policy if exists "admin escreve editorias" on public.editorias;
create policy "admin escreve editorias" on public.editorias
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin escreve artigos" on public.artigos;
create policy "admin escreve artigos" on public.artigos
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin ve admins" on public.admins;
create policy "admin ve admins" on public.admins
  for select using (public.is_admin());

-- ---------- Imagens de capa (Storage) ----------
insert into storage.buckets (id, name, public)
values ('capas', 'capas', true)
on conflict (id) do nothing;

drop policy if exists "capas leitura publica" on storage.objects;
create policy "capas leitura publica" on storage.objects
  for select using (bucket_id = 'capas');

drop policy if exists "capas admin envia" on storage.objects;
create policy "capas admin envia" on storage.objects
  for insert with check (bucket_id = 'capas' and public.is_admin());

drop policy if exists "capas admin altera" on storage.objects;
create policy "capas admin altera" on storage.objects
  for update using (bucket_id = 'capas' and public.is_admin());

drop policy if exists "capas admin apaga" on storage.objects;
create policy "capas admin apaga" on storage.objects
  for delete using (bucket_id = 'capas' and public.is_admin());

-- ---------- Editorias iniciais ----------
insert into public.editorias (nome, slug, descricao, ordem) values
  ('IA Aplicada', 'ia-aplicada', 'Como usar IA no trabalho real: ferramentas, agentes e casos práticos.', 1),
  ('Comunicação Política', 'comunicacao-politica', 'Mandatos, campanhas, narrativa e reputação.', 2),
  ('Dados Eleitorais', 'dados-eleitorais', 'Leitura de votos, mapas e análise de eleições.', 3),
  ('Automação e Atendimento', 'automacao-atendimento', 'WhatsApp, fluxos e atendimento com IA.', 4),
  ('Estratégia e Posicionamento', 'estrategia-posicionamento', 'Branding, autoridade, narrativa e presença digital.', 5),
  ('Setor Público e Terceiro Setor', 'setor-publico', 'Comunicação pública, OSCs, parcerias e projetos sociais.', 6),
  ('Negócios Digitais', 'negocios-digitais', 'Cursos online, lançamentos, tráfego e vendas.', 7)
on conflict (slug) do nothing;

-- ---------- Seu login de admin ----------
-- 1) Crie seu usuário em Authentication > Users > Add user (e-mail + senha).
-- 2) Rode a linha abaixo com o mesmo e-mail:
insert into public.admins (email) values ('tiago.gaze@gmail.com')
on conflict (email) do nothing;
