import { ARTIGOS_EXEMPLO, EDITORIAS_EXEMPLO } from '@/content/exemplos';
import { supabaseConfigurado, supabasePublico } from './supabase/server';
import type { Artigo, ArtigoComEditoria, Editoria } from './tipos';

// Leitura pública do blog. Sem Supabase configurado, usa os artigos de exemplo.

const CAMPOS = '*, editoria:editorias(*)';

export async function listarEditorias(): Promise<Editoria[]> {
  if (!supabaseConfigurado()) return EDITORIAS_EXEMPLO;
  const { data } = await supabasePublico().from('editorias').select('*').eq('ativa', true).order('ordem');
  return (data as Editoria[]) || [];
}

export async function listarArtigos(opcoes: { editoriaSlug?: string; tag?: string; limite?: number } = {}) {
  if (!supabaseConfigurado()) {
    let lista = [...ARTIGOS_EXEMPLO].sort((a, b) => (b.publicado_em || '').localeCompare(a.publicado_em || ''));
    if (opcoes.editoriaSlug) lista = lista.filter((a) => a.editoria?.slug === opcoes.editoriaSlug);
    if (opcoes.tag) lista = lista.filter((a) => a.tags.includes(opcoes.tag!));
    return lista.slice(0, opcoes.limite || 100);
  }

  let consulta = supabasePublico()
    .from('artigos')
    .select(CAMPOS)
    .in('status', ['publicado', 'agendado'])
    .lte('publicado_em', new Date().toISOString())
    .order('publicado_em', { ascending: false })
    .limit(opcoes.limite || 100);

  if (opcoes.tag) consulta = consulta.contains('tags', [opcoes.tag]);
  if (opcoes.editoriaSlug) {
    const { data: ed } = await supabasePublico().from('editorias').select('id').eq('slug', opcoes.editoriaSlug).single();
    if (!ed) return [];
    consulta = consulta.eq('editoria_id', ed.id);
  }

  const { data } = await consulta;
  return (data as ArtigoComEditoria[]) || [];
}

export async function buscarArtigo(slug: string): Promise<ArtigoComEditoria | null> {
  if (!supabaseConfigurado()) return ARTIGOS_EXEMPLO.find((a) => a.slug === slug) || null;
  const { data } = await supabasePublico()
    .from('artigos')
    .select(CAMPOS)
    .eq('slug', slug)
    .in('status', ['publicado', 'agendado'])
    .lte('publicado_em', new Date().toISOString())
    .maybeSingle();
  return (data as ArtigoComEditoria) || null;
}

// Relacionados escolhidos no painel; se não houver, os mais recentes da mesma editoria.
export async function buscarRelacionados(artigo: Artigo, limite = 3) {
  const todos = await listarArtigos({ limite: 50 });
  const outros = todos.filter((a) => a.id !== artigo.id);
  const escolhidos = outros.filter((a) => artigo.relacionados.includes(a.id));
  const mesmaEditoria = outros.filter((a) => a.editoria_id === artigo.editoria_id && !escolhidos.includes(a));
  return [...escolhidos, ...mesmaEditoria, ...outros.filter((a) => !escolhidos.includes(a) && !mesmaEditoria.includes(a))].slice(0, limite);
}
