import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FormPagina } from '@/components/admin/FormPagina';
import { paginaDoCliente } from '@/lib/admin';
import { exigirSessao } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type Props = { params: { id: string }; searchParams: { nova?: string } };

export default async function EditarPagina({ params, searchParams }: Props) {
  const { clienteId } = await exigirSessao();
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) notFound();
  const pagina = await paginaDoCliente(clienteId, params.id);
  if (!pagina) notFound();

  return (
    <>
      <div className="admin-titulo">
        <div style={{ display: 'grid', gap: 4 }}>
          <Link href="/admin/paginas" style={{ color: 'var(--texto-fraco)', fontSize: '0.88rem', textDecoration: 'none' }}>
            ← Páginas
          </Link>
          <h1>{pagina.titulo}</h1>
        </div>
      </div>
      {searchParams.nova && (
        <p className="aviso aviso-ok" style={{ marginBottom: 20 }}>
          Página criada como rascunho. Monte os blocos, marque “No ar” e salve.
        </p>
      )}
      <FormPagina key={pagina.id} pagina={pagina} nova={Boolean(searchParams.nova)} />
    </>
  );
}
