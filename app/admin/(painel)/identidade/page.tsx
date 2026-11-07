import { FormIdentidade } from '@/components/admin/FormIdentidade';
import { exigirSessao } from '@/lib/auth';
import { identidadeDoSite } from '@/lib/identidade';
import { TEMAS } from '@/lib/temas';

export const dynamic = 'force-dynamic';

export default async function Identidade() {
  await exigirSessao();
  const id = await identidadeDoSite();

  return (
    <>
      {/* As duas fontes, para a prévia mostrar a opção que não está em uso */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@600&family=Lora:wght@600&display=swap" />
      <div className="admin-titulo">
        <h1>Identidade</h1>
      </div>
      <p style={{ color: 'var(--texto-suave)', marginTop: -8, marginBottom: 24, maxWidth: 640 }}>
        Nome, logo, cores, fonte e contato do site. A prévia muda na hora; o site só muda quando você salvar.
      </p>
      <FormIdentidade
        temas={TEMAS}
        inicial={{
          nome: id.nome,
          slogan: id.slogan,
          logoUrl: id.logoUrl,
          tema: id.tema.id,
          fonte: id.fonte,
          whatsapp: id.contato.whatsappExibicao,
          telefone: id.contato.telefone,
          email: id.contato.email,
          cidade: id.contato.cidade,
          registro: id.contato.registro,
          blog: id.blogAtivo,
        }}
      />
    </>
  );
}
