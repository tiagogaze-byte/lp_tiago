import Link from 'next/link';
import { exigirSessao } from '@/lib/auth';
import { sair } from '../acoes';

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const sessao = await exigirSessao();

  return (
    <>
      <header className="admin-topo">
        <div className="container">
          <Link href="/admin" className="marca" style={{ fontSize: '1rem' }}>
            Painel<span style={{ color: 'var(--laranja)' }}>.</span>
          </Link>
          <nav>
            <Link href="/admin">Artigos</Link>
            <Link href="/admin/agenda">Agenda</Link>
            <Link href="/admin/editorias">Editorias</Link>
            <Link href="/" target="_blank">
              Ver site ↗
            </Link>
            <span style={{ color: 'var(--texto-fraco)' }}>{sessao.nome.split(' ')[0]}</span>
            <form action={sair}>
              <button className="botao-texto" type="submit">
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="container admin-conteudo">{children}</main>
    </>
  );
}
