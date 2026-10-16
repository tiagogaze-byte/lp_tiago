import type { Metadata } from 'next';
import { bancoConfigurado } from '@/lib/db';

export const metadata: Metadata = { title: 'Painel', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!bancoConfigurado()) {
    return (
      <div className="admin">
        <div className="container login-caixa">
          <h1 style={{ fontSize: '1.8rem' }}>O painel ainda não está ligado ao banco.</h1>
          <p className="aviso aviso-info">
            Falta conectar o banco Neon a este projeto na Vercel (aba Storage). Depois de conectar, publique de novo e volte aqui.
          </p>
        </div>
      </div>
    );
  }
  return <div className="admin">{children}</div>;
}
