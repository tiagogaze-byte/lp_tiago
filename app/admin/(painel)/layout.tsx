import Link from 'next/link';
import { redirect } from 'next/navigation';
import { supabaseServidor } from '@/lib/supabase/server';
import { sair } from '../acoes';

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: ehAdmin } = await supabase.rpc('is_admin');

  return (
    <>
      <header className="admin-topo">
        <div className="container">
          <Link href="/admin" className="marca" style={{ fontSize: '1rem' }}>
            Painel<span style={{ color: 'var(--laranja)' }}>.</span>
          </Link>
          <nav>
            <Link href="/admin">Artigos</Link>
            <Link href="/admin/editorias">Editorias</Link>
            <Link href="/" target="_blank">
              Ver site ↗
            </Link>
            <form action={sair}>
              <button className="botao-texto" type="submit">
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="container admin-conteudo">
        {ehAdmin ? (
          children
        ) : (
          <p className="aviso aviso-erro">
            O login {user.email} entrou, mas não está na lista de administradores. Adicione esse e-mail na tabela “admins” do Supabase.
          </p>
        )}
      </main>
    </>
  );
}
