'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseServidor } from '@/lib/supabase/server';
import type { ItemFaq, StatusArtigo } from '@/lib/tipos';
import { gerarSlug, listaDeTexto } from '@/lib/util';

export type Resultado = { ok: boolean; mensagem: string; id?: string };

async function exigirAdmin() {
  const supabase = supabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: ehAdmin } = await supabase.rpc('is_admin');
  if (!ehAdmin) throw new Error('Este login não tem permissão de administrador.');
  return supabase;
}

function revalidarBlog(slug?: string, editoriaSlug?: string) {
  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/sitemap.xml');
  revalidatePath('/feed.xml');
  revalidatePath('/llms.txt');
  if (slug) revalidatePath(`/blog/${slug}`);
  if (editoriaSlug) revalidatePath(`/blog/editoria/${editoriaSlug}`);
}

// ---------- Artigos ----------

export async function salvarArtigo(_anterior: Resultado | null, form: FormData): Promise<Resultado> {
  const supabase = await exigirAdmin();

  const id = String(form.get('id') || '') || undefined;
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

  const registro = {
    titulo,
    slug,
    resumo: String(form.get('resumo') || '').trim(),
    corpo: String(form.get('corpo') || ''),
    editoria_id: String(form.get('editoria_id') || '') || null,
    tags: listaDeTexto(form.get('tags')),
    palavra_chave: String(form.get('palavra_chave') || '').trim(),
    palavras_secundarias: listaDeTexto(form.get('palavras_secundarias')),
    capa_url: String(form.get('capa_url') || '') || null,
    capa_alt: String(form.get('capa_alt') || '').trim(),
    faq,
    relacionados: form.getAll('relacionados').map(String).filter((r) => r && r !== id),
    status,
    publicado_em,
  };

  const { data: conflito } = await supabase.from('artigos').select('id').eq('slug', slug).maybeSingle();
  if (conflito && conflito.id !== id) return { ok: false, mensagem: `Já existe outro artigo com o slug “${slug}”. Troque o slug.` };

  const consulta = id
    ? supabase.from('artigos').update(registro).eq('id', id).select('id, editoria:editorias(slug)').single()
    : supabase.from('artigos').insert(registro).select('id, editoria:editorias(slug)').single();
  const { data, error } = await consulta;
  if (error || !data) return { ok: false, mensagem: `Não foi possível salvar: ${error?.message || 'erro desconhecido'}.` };

  const ed = data.editoria as unknown as { slug: string } | null;
  revalidarBlog(slug, ed?.slug);
  const textos: Record<StatusArtigo, string> = {
    rascunho: 'Rascunho salvo.',
    agendado: 'Artigo agendado.',
    publicado: 'Artigo publicado.',
  };
  if (!id) redirect(`/admin/artigos/${data.id}?salvo=${status}`);
  return { ok: true, mensagem: textos[status], id: data.id };
}

export async function excluirArtigo(form: FormData) {
  const supabase = await exigirAdmin();
  const id = String(form.get('id'));
  const { data } = await supabase.from('artigos').delete().eq('id', id).select('slug').single();
  revalidarBlog(data?.slug);
  redirect('/admin?excluido=1');
}

// ---------- Editorias ----------

export async function salvarEditoria(_anterior: Resultado | null, form: FormData): Promise<Resultado> {
  const supabase = await exigirAdmin();
  const id = String(form.get('id') || '') || undefined;
  const nome = String(form.get('nome') || '').trim();
  if (!nome) return { ok: false, mensagem: 'A editoria precisa de um nome.' };
  const registro = {
    nome,
    slug: gerarSlug(String(form.get('slug') || '') || nome),
    descricao: String(form.get('descricao') || '').trim(),
    ordem: Number(form.get('ordem') || 0),
    ativa: form.get('ativa') === 'on',
  };
  const { error } = id ? await supabase.from('editorias').update(registro).eq('id', id) : await supabase.from('editorias').insert(registro);
  if (error) {
    const msg = error.code === '23505' ? 'Já existe uma editoria com esse slug.' : error.message;
    return { ok: false, mensagem: `Não foi possível salvar: ${msg}` };
  }
  revalidarBlog(undefined, registro.slug);
  revalidatePath('/admin/editorias');
  return { ok: true, mensagem: id ? 'Editoria atualizada.' : 'Editoria criada.' };
}

export async function excluirEditoria(form: FormData) {
  const supabase = await exigirAdmin();
  const id = String(form.get('id'));
  const { count } = await supabase.from('artigos').select('id', { count: 'exact', head: true }).eq('editoria_id', id);
  if (count && count > 0) redirect(`/admin/editorias?erro=${encodeURIComponent(`Essa editoria tem ${count} artigo(s). Mova os artigos ou desative a editoria em vez de excluir.`)}`);
  await supabase.from('editorias').delete().eq('id', id);
  revalidarBlog();
  redirect('/admin/editorias?excluida=1');
}

// ---------- Sessão ----------

export async function sair() {
  await supabaseServidor().auth.signOut();
  redirect('/admin/login');
}
