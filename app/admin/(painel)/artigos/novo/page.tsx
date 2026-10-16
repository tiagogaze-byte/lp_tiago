import Link from 'next/link';
import { FormArtigo } from '@/components/admin/FormArtigo';
import { supabaseServidor } from '@/lib/supabase/server';
import type { Editoria } from '@/lib/tipos';

export default async function NovoArtigo() {
  const supabase = supabaseServidor();
  const [{ data: editorias }, { data: outros }] = await Promise.all([
    supabase.from('editorias').select('*').order('ordem'),
    supabase.from('artigos').select('id, titulo').eq('status', 'publicado').order('publicado_em', { ascending: false }).limit(200),
  ]);

  return (
    <>
      <div className="admin-titulo">
        <div style={{ display: 'grid', gap: 4 }}>
          <Link href="/admin" className="botao-texto">
            ← Artigos
          </Link>
          <h1>Novo artigo</h1>
        </div>
      </div>
      <FormArtigo editorias={(editorias || []) as Editoria[]} outros={outros || []} />
    </>
  );
}
