import { iconeSvg } from '@/lib/icone';
import { identidadeDoSite } from '@/lib/identidade';

export const revalidate = 60;

// Ícone da aba gerado com a inicial do site e as cores do tema.
export async function GET() {
  const id = await identidadeDoSite();
  const svg = iconeSvg(id.nome, id.tema, id.fonte);
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=300, s-maxage=60' } });
}

