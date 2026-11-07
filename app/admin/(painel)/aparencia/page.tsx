import { FormAparencia } from '@/components/admin/FormAparencia';
import { exigirSessao } from '@/lib/auth';
import { identidadeDoSite } from '@/lib/identidade';
import { TEMAS } from '@/lib/temas';

export const dynamic = 'force-dynamic';

export default async function Aparencia() {
  await exigirSessao();
  const identidade = await identidadeDoSite();

  return (
    <>
      <div className="admin-titulo">
        <h1>Aparência</h1>
      </div>
      <p style={{ color: 'var(--texto-suave)', marginTop: -8, marginBottom: 24, maxWidth: 640 }}>
        Nome, assinatura, logo e cores do site. A prévia muda na hora; o site só muda quando você salvar.
      </p>
      <FormAparencia
        temas={TEMAS}
        inicial={{ nome: identidade.nome, slogan: identidade.slogan, logoUrl: identidade.logoUrl, tema: identidade.tema.id }}
      />
    </>
  );
}
