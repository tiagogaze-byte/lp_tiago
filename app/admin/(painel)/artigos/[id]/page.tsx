import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FormArtigo } from '@/components/admin/FormArtigo';
import { supabaseServidor } from '@/lib/supabase/server';
import type { Artigo, Editoria } from '@/lib/tipos';

type Props = { params: { id: string }; searchParams: { salvo?: string } };

const AVISOS: Record<string, string> = {
  rascunho: 'Rascunho salvo.',
  agendado: 'Artigo agendado.',
  publicado: 'Artigo publicado.',
};

export default async function EditarArtigo({ params, searchParams }: Props) {
  const supabase = supabaseServidor();
  const [{ data: artigo }, { data: editorias }, { data: outros }] = await Promise.all([
    supabase.from('artigos').select('*').eq('id', params.id).maybeSingle(),
    supabase.from('editorias').select('*').order('ordem'),
    supabase.from('artigos').select('id, titulo').eq('status', 'publicado').neq('id', params.id).order('publicado_em', { ascending: false }).limit(200),
  ]);
  if (!artigo) notFound();

  return (
    <>
      <div className="admin-titulo">
        <div style={{ display: 'grid', gap: 4 }}>
          <Link href="/admin" className="botao-texto">
            ← Artigos
          </Link>
          <h1>Editar artigo</h1>
        </div>
      </div>
      <FormArtigo
        key={artigo.atualizado_em}
        artigo={artigo as Artigo}
        editorias={(editorias || []) as Editoria[]}
        outros={outros || []}
        avisoInicial={searchParams.salvo ? AVISOS[searchParams.salvo] : undefined}
      />
    </>
  );
}
