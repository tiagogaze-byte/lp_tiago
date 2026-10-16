import Link from 'next/link';

export default function NaoEncontrado() {
  return (
    <main className="secao">
      <div className="container secao-cabeca" style={{ margin: '10vh auto', textAlign: 'center', justifyItems: 'center' }}>
        <span className="rotulo">Erro 404</span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>Essa página não existe.</h1>
        <p>O link pode ter mudado. Que tal voltar para o início ou ver o blog?</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" className="botao botao-primario botao-pequeno">
            Ir para o início
          </Link>
          <Link href="/blog" className="botao botao-secundario botao-pequeno">
            Ver o blog
          </Link>
        </div>
      </div>
    </main>
  );
}
