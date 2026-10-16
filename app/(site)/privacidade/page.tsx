import type { Metadata } from 'next';
import { SITE } from '@/content/site';

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description: 'Como os dados de contato são tratados no site e no atendimento por WhatsApp.',
  alternates: { canonical: '/privacidade' },
};

export default function Privacidade() {
  return (
    <section className="secao">
      <div className="container">
        <div className="texto-longo">
          <span className="rotulo">Privacidade</span>
          <h1 style={{ color: 'var(--texto)', fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>Política de privacidade</h1>
          <p>
            Este site e o atendimento pelo WhatsApp seguem a Lei Geral de Proteção de Dados (Lei 13.709/2018). Aqui está, em linguagem
            simples, o que acontece com os seus dados.
          </p>
          <h2 style={{ color: 'var(--texto)', fontSize: '1.4rem' }}>Quais dados coletamos</h2>
          <p>
            No WhatsApp, a assistente de IA pede apenas nome, contato, cidade e a descrição da sua demanda. Nunca pedimos documentos, CPF ou
            dados bancários. O site não tem formulários e não usa cookies de publicidade.
          </p>
          <h2 style={{ color: 'var(--texto)', fontSize: '1.4rem' }}>Para que usamos</h2>
          <p>Só para entender o que você precisa, responder e agendar uma conversa. Não vendemos nem compartilhamos seus dados com terceiros.</p>
          <h2 style={{ color: 'var(--texto)', fontSize: '1.4rem' }}>Atendimento por IA</h2>
          <p>
            O primeiro atendimento é feito por uma assistente de inteligência artificial, que se identifica como tal. Você pode pedir para
            falar com uma pessoa a qualquer momento.
          </p>
          <h2 style={{ color: 'var(--texto)', fontSize: '1.4rem' }}>Seus direitos</h2>
          <p>
            Você pode pedir para ver, corrigir ou apagar seus dados quando quiser, pelo e-mail <strong>{SITE.email}</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
