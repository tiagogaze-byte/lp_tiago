import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FormArtigo } from '@/components/admin/FormArtigo';
import { artigoDoCliente, editoriasDoCliente, titulosPublicados } from '@/lib/admin';
import { exigirSessao } from '@/lib/auth';

type Props = { params: { id: string }; searchParams: { salvo?: string } };

const AVISOS: Record<string, string> = {
  rascunho: 'Rascunho salvo.',
  agendado: 'Artigo agendado.',
  publicado: 'Artigo publicado.',
};

export default async function EditarArtigo({ params, searchParams }: Props) {
  const { clienteId } = await exigirSessao();
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) notFound();
  const [artigo, editorias, outros] = await Promise.all([
    artigoDoCliente(clienteId, params.id),
    editoriasDoCliente(clienteId),
    titulosPublicados(clienteId, params.id),
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
        key={artigo.id}
        artigo={artigo}
        editorias={editorias}
        outros={outros}
        avisoInicial={searchParams.salvo ? AVISOS[searchParams.salvo] : undefined}
      />
    </>
  );
}
