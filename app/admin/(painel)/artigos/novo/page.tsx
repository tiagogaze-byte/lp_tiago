import Link from 'next/link';
import { FormArtigo } from '@/components/admin/FormArtigo';
import { editoriasDoCliente, titulosPublicados } from '@/lib/admin';
import { exigirSessao } from '@/lib/auth';

type Props = { searchParams: { data?: string } };

export default async function NovoArtigo({ searchParams }: Props) {
  const { clienteId } = await exigirSessao();
  const [editorias, outros] = await Promise.all([editoriasDoCliente(clienteId), titulosPublicados(clienteId)]);
  // Vindo da agenda, o artigo já nasce com a data escolhida às 9h.
  const dataInicial = searchParams.data && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.data) ? `${searchParams.data}T09:00` : undefined;

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
      <FormArtigo editorias={editorias} outros={outros} dataInicial={dataInicial} />
    </>
  );
}
