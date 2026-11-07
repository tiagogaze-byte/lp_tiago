import Link from 'next/link';

export type DadosMarca = { nome: string; slogan: string; logoUrl: string | null };

// Logo do cliente, se houver; senão o nome com o ponto na cor do tema.
export function Marca({ marca, estilo }: { marca: DadosMarca; estilo?: React.CSSProperties }) {
  return (
    <Link href="/" className="marca" style={estilo} aria-label={`${marca.nome}, página inicial`}>
      {marca.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={marca.logoUrl} alt={marca.nome} className="marca-logo" />
      ) : (
        <>
          {marca.nome}
          <span>.</span>
        </>
      )}
    </Link>
  );
}
