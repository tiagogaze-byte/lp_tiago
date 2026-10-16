import type { Metadata } from 'next';
import { supabaseConfigurado } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Painel', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigurado()) {
    return (
      <div className="admin">
        <div className="container login-caixa">
          <h1 style={{ fontSize: '1.8rem' }}>O painel ainda não está ligado ao banco.</h1>
          <p className="aviso aviso-info">
            Falta cadastrar as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel e rodar o arquivo
            supabase/schema.sql no Supabase. O passo a passo está no arquivo LEIA-ME.md do projeto.
          </p>
        </div>
      </div>
    );
  }
  return <div className="admin">{children}</div>;
}
