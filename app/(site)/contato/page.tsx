import type { Metadata } from 'next';
import { IconeWhatsApp } from '@/components/Icones';
import { SITE, linkWhatsApp } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com Tiago Azevedo pelo WhatsApp ou por e-mail. Atendimento em todo o Brasil.',
  alternates: { canonical: '/contato' },
};

export default function Contato() {
  return (
    <>
      <section className="hero-pagina">
        <div className="container secao-cabeca" style={{ marginBottom: 0 }}>
          <span className="rotulo">Contato</span>
          <h1>Vamos conversar?</h1>
          <p>
            Me conta em uma frase o que você precisa. Quem responde primeiro é a SecretárIA, minha assistente de IA, que entende o seu caso e
            marca a conversa comigo.
          </p>
        </div>
      </section>

      <section className="secao" style={{ paddingTop: 16 }}>
        <div className="container">
          <div className="canais">
            <div className="cartao canal">
              <span className="rotulo">WhatsApp</span>
              <span className="valor">{SITE.whatsappExibicao}</span>
              <p>O caminho mais rápido. Resposta na hora, a qualquer hora.</p>
              <a className="botao botao-primario" style={{ alignSelf: 'flex-start' }} href={linkWhatsApp()} target="_blank" rel="noopener">
                <IconeWhatsApp />
                Falar no WhatsApp
              </a>
            </div>
            <div className="cartao canal">
              <span className="rotulo">E-mail</span>
              <span className="valor">{SITE.email}</span>
              <p>Para propostas, documentos e parcerias.</p>
              <a className="botao botao-secundario" style={{ alignSelf: 'flex-start' }} href={`mailto:${SITE.email}`}>
                Enviar e-mail
              </a>
            </div>
          </div>
          <p style={{ marginTop: 32, color: 'var(--texto-suave)' }}>Base em {SITE.cidade}, com atendimento em todo o Brasil e online.</p>
        </div>
      </section>
    </>
  );
}
