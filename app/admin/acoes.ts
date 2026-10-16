'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ARTIGOS_EXEMPLO, EDITORIAS_EXEMPLO } from '@/content/exemplos';
import { conferirSenha, criarSessao, encerrarSessao, exigirSessao, gerarHash } from '@/lib/auth';
import { CLIENTE_PADRAO, consulta, umaLinha } from '@/lib/db';
import { ESTRUTURA_DO_BANCO } from '@/lib/schema';
import type { ItemFaq, StatusArtigo } from '@/lib/tipos';
import { gerarSlug, listaDeTexto } from '@/lib/util';

export type Resultado = { ok: boolean; mensagem: string; id?: string };

function revalidarBlog(slug?: string, editoriaSlug?: string) {
  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/sitemap.xml');
  revalidatePath('/feed.xml');
  revalidatePath('/llms.txt');
  if (slug) revalidatePath(`/blog/${slug}`);
  if (editoriaSlug) revalidatePath(`/blog/editoria/${editoriaSlug}`);
}

// ---------- Primeira configuração ----------

export async function existeUsuario() {
  try {
    const linha = await umaLinha<{ total: number }>('select count(*)::int as total from usuarios');
    return (linha?.total || 0) > 0;
  } catch {
    return false; // tabelas ainda não existem
  }
}

export async function configurarPortal(_anterior: Resultado | null, form: FormData): Promise<Resultado> {
  if (await existeUsuario()) return { ok: false, mensagem: 'O painel já foi configurado. Entre com seu e-mail e senha.' };

  const nome = String(form.get('nome') || '').trim();
  const email = String(form.get('email') || '').trim().toLowerCase();
  const senha = String(form.get('senha') || '');
  const confirmacao = String(form.get('confirmacao') || '');
  if (!nome || !email) return { ok: false, mensagem: 'Preencha nome e e-mail.' };
  if (senha.length < 10) return { ok: false, mensagem: 'A senha precisa ter pelo menos 10 caracteres.' };
  if (senha !== confirmacao) return { ok: false, mensagem: 'As duas senhas não são iguais.' };

  try {
    for (const comando of ESTRUTURA_DO_BANCO) await consulta(comando);

    const cliente = await umaLinha<{ id: string }>(
      `insert into clientes (slug, nome, dominio) values ($1, $2, $3)
       on conflict (slug) do update set nome = excluded.nome returning id`,
      [CLIENTE_PADRAO, 'Tiago Azevedo', 'tiagogaze.com.br'],
    );
    const clienteId = cliente!.id;

    // Editorias iniciais
    const mapaEditorias: Record<string, string> = {};
    for (const e of EDITORIAS_EXEMPLO) {
      const linha = await umaLinha<{ id: string }>(
        `insert into editorias (cliente_id, nome, slug, descricao, ordem) values ($1, $2, $3, $4, $5)
         on conflict (cliente_id, slug) do update set nome = excluded.nome returning id`,
        [clienteId, e.nome, e.slug, e.descricao, e.ordem],
      );
      mapaEditorias[e.id] = linha!.id;
    }

    // Artigos que já estavam no site
    for (const a of ARTIGOS_EXEMPLO) {
      await consulta(
        `insert into artigos (cliente_id, titulo, slug, resumo, corpo, editoria_id, tags, palavra_chave, palavras_secundarias,
           capa_url, capa_alt, faq, status, publicado_em)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14)
         on conflict (cliente_id, slug) do nothing`,
        [
          clienteId, a.titulo, a.slug, a.resumo, a.corpo, a.editoria_id ? mapaEditorias[a.editoria_id] : null, a.tags,
          a.palavra_chave, a.palavras_secundarias, a.capa_url, a.capa_alt, JSON.stringify(a.faq), a.status, a.publicado_em,
        ],
      );
    }

    const usuario = await umaLinha<{ id: string }>(
      `insert into usuarios (cliente_id, nome, email, senha_hash, perfil) values ($1, $2, $3, $4, 'dono') returning id`,
      [clienteId, nome, email, await gerarHash(senha)],
    );
    criarSessao(usuario!.id);
  } catch (erro) {
    return { ok: false, mensagem: `Não foi possível configurar o banco: ${(erro as Error).message}` };
  }

  revalidarBlog();
  redirect('/admin?bemvindo=1');
}

// ---------- Sessão ----------

export async function entrar(_anterior: Resultado | null, form: FormData): Promise<Resultado> {
  const email = String(form.get('email') || '').trim().toLowerCase();
  const senha = String(form.get('senha') || '');
  const usuario = await umaLinha<{ id: string; senha_hash: string }>('select id, senha_hash from usuarios where email = $1', [email]).catch(
    () => null,
  );
  if (!usuario || !(await conferirSenha(senha, usuario.senha_hash))) {
    return { ok: false, mensagem: 'E-mail ou senha incorretos. Confira e tente de novo.' };
  }
  await consulta('update usuarios set ultimo_acesso = now() where id = $1', [usuario.id]);
  criarSessao(usuario.id);
  redirect('/admin');
}

export async function sair() {
  encerrarSessao();
  redirect('/admin/login');
}

// ---------- Artigos ----------

export async function salvarArtigo(_anterior: Resultado | null, form: FormData): Promise<Resultado> {
  const { clienteId } = await exigirSessao();

  const id = String(form.get('id') || '') || null;
  const titulo = String(form.get('titulo') || '').trim();
  const slug = gerarSlug(String(form.get('slug') || '') || titulo);
  const status = String(form.get('status') || 'rascunho') as StatusArtigo;
  const dataInformada = String(form.get('publicado_em') || '');

  if (!titulo) return { ok: false, mensagem: 'O artigo precisa de um título.' };
  if (!slug) return { ok: false, mensagem: 'O slug ficou vazio. Escreva um título ou um slug com letras.' };

  let publicado_em: string | null = dataInformada ? new Date(`${dataInformada}:00-03:00`).toISOString() : null;
  if (status === 'publicado' && !publicado_em) publicado_em = new Date().toISOString();
  if (status === 'agendado') {
    if (!publicado_em) return { ok: false, mensagem: 'Para agendar, escolha a data e a hora de publicação.' };
    if (new Date(publicado_em) <= new Date()) return { ok: false, mensagem: 'A data do agendamento precisa estar no futuro.' };
  }

  let faq: ItemFaq[] = [];
  try {
    faq = (JSON.parse(String(form.get('faq') || '[]')) as ItemFaq[]).filter((f) => f.pergunta?.trim() && f.resposta?.trim());
  } catch {
    faq = [];
  }

  const editoriaId = String(form.get('editoria_id') || '') || null;
  const relacionados = form.getAll('relacionados').map(String).filter((r) => r && r !== id);

  const conflito = await umaLinha<{ id: string }>('select id from artigos where cliente_id = $1 and slug = $2', [clienteId, slug]);
  if (conflito && conflito.id !== id) return { ok: false, mensagem: `Já existe outro artigo com o slug “${slug}”. Troque o slug.` };

  const valores = [
    titulo, slug, String(form.get('resumo') || '').trim(), String(form.get('corpo') || ''), editoriaId,
    listaDeTexto(form.get('tags')), String(form.get('palavra_chave') || '').trim(), listaDeTexto(form.get('palavras_secundarias')),
    String(form.get('capa_url') || '') || null, String(form.get('capa_alt') || '').trim(), JSON.stringify(faq), relacionados, status, publicado_em,
  ];

  let salvoId: string;
  try {
    if (id) {
      const linha = await umaLinha<{ id: string }>(
        `update artigos set titulo=$1, slug=$2, resumo=$3, corpo=$4, editoria_id=$5, tags=$6, palavra_chave=$7, palavras_secundarias=$8,
           capa_url=$9, capa_alt=$10, faq=$11::jsonb, relacionados=$12::uuid[], status=$13, publicado_em=$14, atualizado_em=now()
         where id=$15 and cliente_id=$16 returning id`,
        [...valores, id, clienteId],
      );
      if (!linha) return { ok: false, mensagem: 'Artigo não encontrado.' };
      salvoId = linha.id;
    } else {
      const linha = await umaLinha<{ id: string }>(
        `insert into artigos (titulo, slug, resumo, corpo, editoria_id, tags, palavra_chave, palavras_secundarias, capa_url, capa_alt,
           faq, relacionados, status, publicado_em, cliente_id)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::uuid[],$13,$14,$15) returning id`,
        [...valores, clienteId],
      );
      salvoId = linha!.id;
    }
  } catch (erro) {
    return { ok: false, mensagem: `Não foi possível salvar: ${(erro as Error).message}` };
  }

  const ed = editoriaId ? await umaLinha<{ slug: string }>('select slug from editorias where id = $1', [editoriaId]) : null;
  revalidarBlog(slug, ed?.slug);
  revalidatePath('/admin/agenda');

  if (!id) redirect(`/admin/artigos/${salvoId}?salvo=${status}`);
  const textos: Record<StatusArtigo, string> = { rascunho: 'Rascunho salvo.', agendado: 'Artigo agendado.', publicado: 'Artigo publicado.' };
  return { ok: true, mensagem: textos[status], id: salvoId };
}

export async function excluirArtigo(form: FormData) {
  const { clienteId } = await exigirSessao();
  const linha = await umaLinha<{ slug: string }>('delete from artigos where id = $1 and cliente_id = $2 returning slug', [
    String(form.get('id')),
    clienteId,
  ]);
  revalidarBlog(linha?.slug);
  redirect('/admin?excluido=1');
}

// ---------- Editorias ----------

export async function salvarEditoria(_anterior: Resultado | null, form: FormData): Promise<Resultado> {
  const { clienteId } = await exigirSessao();
  const id = String(form.get('id') || '') || null;
  const nome = String(form.get('nome') || '').trim();
  if (!nome) return { ok: false, mensagem: 'A editoria precisa de um nome.' };
  const slug = gerarSlug(String(form.get('slug') || '') || nome);
  const descricao = String(form.get('descricao') || '').trim();
  const ordem = Number(form.get('ordem') || 0);
  const ativa = form.get('ativa') === 'on';

  try {
    if (id) {
      await consulta('update editorias set nome=$1, slug=$2, descricao=$3, ordem=$4, ativa=$5 where id=$6 and cliente_id=$7', [
        nome, slug, descricao, ordem, ativa, id, clienteId,
      ]);
    } else {
      await consulta('insert into editorias (cliente_id, nome, slug, descricao, ordem, ativa) values ($1,$2,$3,$4,$5,$6)', [
        clienteId, nome, slug, descricao, ordem, ativa,
      ]);
    }
  } catch (erro) {
    const msg = String((erro as Error).message).includes('duplicate') ? 'Já existe uma editoria com esse slug.' : (erro as Error).message;
    return { ok: false, mensagem: `Não foi possível salvar: ${msg}` };
  }
  revalidarBlog(undefined, slug);
  revalidatePath('/admin/editorias');
  return { ok: true, mensagem: id ? 'Editoria atualizada.' : 'Editoria criada.' };
}

export async function excluirEditoria(form: FormData) {
  const { clienteId } = await exigirSessao();
  const id = String(form.get('id'));
  const uso = await umaLinha<{ total: number }>('select count(*)::int as total from artigos where editoria_id = $1 and cliente_id = $2', [
    id,
    clienteId,
  ]);
  if (uso && uso.total > 0) {
    redirect(`/admin/editorias?erro=${encodeURIComponent(`Essa editoria tem ${uso.total} artigo(s). Mova os artigos ou desative a editoria em vez de excluir.`)}`);
  }
  await consulta('delete from editorias where id = $1 and cliente_id = $2', [id, clienteId]);
  revalidarBlog();
  redirect('/admin/editorias?excluida=1');
}
